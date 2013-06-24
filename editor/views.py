from django.shortcuts import render_to_response
from django.core.context_processors import csrf
from django.template import RequestContext

from recordings.models import Recording

def editor(request, recordingId):
    recording = Recording.objects.get(pk=int(recordingId))
    
    return render_to_response('editor/index.html', {
            'recording' : recording,
            })
