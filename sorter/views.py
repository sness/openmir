from django.shortcuts import render_to_response
from django.core.context_processors import csrf
from django.template import RequestContext

from recordings.models import Recording

def index(request):
    return render_to_response('sorter/index.html')

