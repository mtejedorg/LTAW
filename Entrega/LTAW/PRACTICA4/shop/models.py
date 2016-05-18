from __future__ import unicode_literals

from django.db import models
from django.utils.encoding import python_2_unicode_compatible
from django.core.files.storage import FileSystemStorage

# Create your models here.
@python_2_unicode_compatible
class Genre(models.Model):
    id = models.CharField(primary_key=True, max_length= 200)
    text = models.CharField(max_length=200)
    imgsrc = models.ImageField(upload_to="media/shop/genre/Images", blank="True", default="static/shop/images/nodisp.jpg")
    audiosrc = models.FileField(upload_to="media/shop/genre/Audio", blank="True")
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.text

@python_2_unicode_compatible
class Item(models.Model):
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    id = models.CharField(primary_key=True, max_length= 200)
    text = models.CharField(max_length=200)
    price = models.IntegerField()
    inCart = models.BooleanField(default=False)
    imgsrc = models.ImageField(upload_to="media/shop/item/Images", blank="True", default="static/shop/images/nodisp.jpg")
    detailImgsrc = models.ImageField(upload_to="media/shop/item/detail/Images", blank="True")
    audiosrc = models.FileField(upload_to="media/shop/item/detail/Audio", blank="True")
    videosrc = models.FileField(upload_to="media/shop/item/detail/Video", blank="True")
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.text

@python_2_unicode_compatible
class Order(models.Model):
    orderId = models.CharField(max_length=200)
    orderPrice = models.IntegerField()
    ordererMail = models.CharField(max_length=200)
    ordererDir = models.CharField(max_length=200)

    def __str__(self):
        return self.ordererMail