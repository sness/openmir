from django.shortcuts import render_to_response, render
from django.core.context_processors import csrf
from django.template import RequestContext

from recordings.models import Recording
from clips.models import Clip,ClipList
from django.core import serializers

def index(request):
    recordings = Recording.objects.all()
    return render(request, 'recordings/index.html', {
            'recordings' : recordings,
            })

def show(request, recordingId):
    r = Recording.objects.filter(pk=int(recordingId))
    recordingJson = serializers.serialize("json", r)
    clipsJson = serializers.serialize("json", r[0].clip_set.all())
    
    return render(request, 'recordings/show.html', {'recordingJson' : recordingJson, 'clipsJson' : clipsJson})
