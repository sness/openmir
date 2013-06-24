from django.shortcuts import render_to_response, render, redirect
from django.core.context_processors import csrf
from django.template import RequestContext

from django.utils import simplejson
from django.http import HttpResponse

from django.core import serializers

from classifiers.models import Classifier,TrainingSet,TrainingSetClipList
from clips.models import Clip,ClipList
from recordings.models import Recording

from django.core.servers.basehttp import FileWrapper

from classifiers.serializers import ClassifierSerializer
from rest_framework import viewsets
from rest_framework.decorators import link

from celerytest.tasks import celeryTrainClassifier

from datetime import datetime

import os
import commands
import time
import simplejson as json
import csv
import StringIO

def index(request):
    classifiers = Classifier.objects.all()
    return render(request, 'classifiers/index.html', { 'classifiers' : classifiers })

def train(request, classifierId):
    # TODO(sness)-Convert to POST
    classifier = Classifier.objects.get(pk=int(classifierId))

    trainData = []
    for trainingSetClipList in classifier.trainingSet.trainingsetcliplist_set.all():
        clipList = trainingSetClipList.clipList
        for clip in clipList.clips.all():
            trainData.append({'recordingName' : clip.recording.name,
                            'startSec' : clip.startSec,
                            'endSec' : clip.endSec,
                            'label' : clipList.name
                            })

    # Start a classifier job with celery
    task = celeryTrainClassifier.delay(classifier.id,trainData)
    classifier.celeryTaskId = task.id
    classifier.trainStartTime = datetime.now()
    classifier.trainEndTime = None
    classifier.trained = False
    classifier.save()

    return redirect("/classifiers")
    

def predict(request, classifierId):
    classifier = Classifier.objects.get(pk=int(classifierId))

    # Query parameters
    recordingId = float(request.GET.get('recordingId', '1'))
    startSec = float(request.GET.get('startSec', '0'))
    endSec = float(request.GET.get('endSec', '10.000'))

    # Save mpl as file
    ts = time.time()
    mplFilename = "/tmp/sfplugin-%i.mpl" % ts
    mplFile = open(mplFilename, "w")
    mplFile.write(classifier.mpl)
    mplFile.close()

    # Extract audio from recording with sox
    recording = Recording.objects.get(pk=int(recordingId))    
    audioFilename = "/data/django/openmir/audio/%s.wav" % (str(recording.name))
    lengthSec = endSec - startSec
    outAudioFilename = "/tmp/audio-%i-%f-%f.wav" % (recordingId, startSec, endSec)
    command = "sox -R %s -c 1 %s trim %f %f" % (audioFilename, outAudioFilename, startSec, lengthSec)
    print "command="
    print command
    out = commands.getoutput(command)

    # Run sfplugin on this audio, saving the output
    command = "/home/sness/marsyas/release/bin/sfplugin -pl %s %s -pm" % (mplFilename, outAudioFilename)
    print "command="
    print command
    out = commands.getoutput(command)
    print out
    
    # Convert sfplugin output to json
    data = []
#    reader = csv.reader(StringIO.StringIO(out), delimiter='\t', quotechar='"')
    reader = csv.reader(StringIO.StringIO(out), delimiter=',', quotechar='"')
    for row in reader:
        # TODO(sness) - This is so we don't read any lines that say
        # "coredump" in them.  It would be better to check to make
        # sure sfplugin runs correctly above.
        if len(row) == 4:
            item = { 'name' : row[2],
                     'startSec' : float(row[0]) + startSec,
                     'endSec' : float(row[1]) + startSec,
                     'confidence' : float(row[3]) }
            data.append(item)

    return HttpResponse(simplejson.dumps(data))


class ClassifierViewSet(viewsets.ModelViewSet):
    queryset = Classifier.objects.all()
    serializer_class = ClassifierSerializer


