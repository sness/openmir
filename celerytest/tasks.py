from celery import task
import commands

from tools.models import *
from classifiers.models import Classifier,TrainingSet,TrainingSetClipList,Classifier
from datetime import datetime
import time
import redis
import simplejson as json

@task()
def add(x, y):
    return x + y

@task()
def celeryTrainClassifier(classifierId, data):
    
    # Add a name for the output file that will be generated
    for item in data:
        newAudioFile = item['recordingName'].replace("/","_")
        item['inputFile'] = "/data/django/openmir/audio/%s.wav" % (item['recordingName'])
        item['outputFile'] = "/tmp/%s-%s-%s.wav" % (newAudioFile, item['startSec'], item['endSec'])

    # Run sox on each input file
    for item in data:
        startSec = float(item['startSec'])
        endSec = float(item['endSec'])
        lengthSec = endSec - startSec
        command = "sox -R %s -c 1 %s trim %f %f" % (item['inputFile'], item['outputFile'], startSec, lengthSec)
        print command
        a = commands.getoutput(command)
        print a

    # Make .mf file
    ts = time.time()
    mfFilename = "/tmp/bextract-%i.mf" % ts
    mfFile = open(mfFilename, "w")
    for item in data:
        mfFile.write("%s\t%s\n" % (item['outputFile'], item['label']))
    mfFile.close()

    # Run bextract on audio file
    mplFilename = "/tmp/bextract-%i.mpl" % ts
    arffFilename = "/tmp/bextract-%i.arff" % ts
    command = "/home/sness/marsyas/release/bin/bextract -csv %s -pm -p %s -w %s" % (mfFilename, mplFilename, arffFilename)
    print command
    a = commands.getoutput(command)

    # Store files
    mfFile = open(mfFilename, "r")
    mfData = mfFile.read()
    mplFile = open(mplFilename, "r")
    mplData = mplFile.read()
    arffFile = open(arffFilename, "r")
    arffData = arffFile.read()

    # # TODO(sness) - Reenable this when debugging is done
    # # # Remove temporary audio files when done
    # # for item in data:
    # #     os.remove(item['outputFile'])
    # # os.remove(mfFilename)
    # # os.remove(mplFilename)

    classifier = Classifier.objects.get(pk=int(classifierId))
    classifier.mf = mfData
    classifier.mpl = mplData
    classifier.arff = arffData
    classifier.trainEndTime = datetime.now()
    classifier.trained = True
    classifier.save()
    
    return "OK"

    
