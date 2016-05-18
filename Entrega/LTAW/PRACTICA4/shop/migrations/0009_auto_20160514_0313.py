# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-14 01:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0008_auto_20160513_2207'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='detail',
            name='item',
        ),
        migrations.AddField(
            model_name='item',
            name='audiosrc',
            field=models.FileField(blank='True', upload_to='media/shop/item/detail/Audio'),
        ),
        migrations.AddField(
            model_name='item',
            name='detailImgsrc',
            field=models.ImageField(blank='True', default='static/shop/images/nodisp.jpg', upload_to='media/shop/item/detail/Images'),
        ),
        migrations.AddField(
            model_name='item',
            name='videosrc',
            field=models.FileField(blank='True', upload_to='media/shop/item/detail/Video'),
        ),
        migrations.AlterField(
            model_name='genre',
            name='audiosrc',
            field=models.FileField(blank='True', upload_to='media/shop/genre/Audio'),
        ),
        migrations.AlterField(
            model_name='item',
            name='imgsrc',
            field=models.ImageField(blank='True', default='static/shop/images/nodisp.jpg', upload_to='media/shop/item/Images'),
        ),
        migrations.DeleteModel(
            name='Detail',
        ),
    ]
