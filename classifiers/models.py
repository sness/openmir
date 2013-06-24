from django.db import models
from django import forms
from django.contrib import admin
import sys

from recordings.models import Recording
from clips.models import ClipList,Catalog

class TrainingSet(models.Model):
    name = models.CharField(max_length = 200)

    def __unicode__(self):
        return self.name

class TrainingSetClipList(models.Model):
    trainingSet = models.ForeignKey(TrainingSet)
    clipList = models.ForeignKey(ClipList)

    def __unicode__(self):
        return str(self.id)

class Classifier(models.Model):
    name = models.CharField(max_length = 200)
    trainingSet = models.ForeignKey(TrainingSet)
    catalog = models.ForeignKey(Catalog)
    description = models.TextField(null = True, blank = True)
    options = models.CharField(max_length = 200)
    celeryTaskId = models.CharField(max_length = 200, null = True, blank = True)
    trainStartTime = models.DateTimeField(null = True, blank =  True)
    trainEndTime = models.DateTimeField(null = True, blank = True)
    trained = models.BooleanField(default = False)
    mf = models.TextField(null = True, blank = True)
    arff = models.TextField(null = True, blank = True)
    mpl = models.TextField(null = True, blank = True)
    
    def __unicode__(self):
        return self.name
    
class ClassifierAdmin(admin.ModelAdmin):
    pass

admin.site.register(Classifier, ClassifierAdmin)
