from __future__ import unicode_literals

from django.db import models
from django.utils.encoding import python_2_unicode_compatible

# Create your models here.
@python_2_unicode_compatible
class Genre(models.Model):
    genre_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.question_text

@python_2_unicode_compatible
class Item(models.Model):
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    item_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.choice_text