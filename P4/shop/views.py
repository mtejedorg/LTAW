from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views import generic

from django.utils import timezone

from .models import Genre, Item

# Create your views here.
def indexView(request):
    genre_list = Genre.objects.order_by('pub_date')[:4]
    context = {'genre_list': genre_list}
    return render(request, 'shop/index.html', context)

def genreView(request, genre_id):
    genre = get_object_or_404(Genre, id=genre_id)
    genre_list = Genre.objects.order_by('pub_date')[:4]
    item_list = Item.objects.filter(genre__id = genre_id).order_by('pub_date')[:4]
    context = {'genre_list': genre_list, 'item_list': item_list, 'actgenre': genre}
    return render(request, 'shop/genre.html', context)


def itemView(request, genre_id, item_id):
    # Echar un ojo a esto ya que deberia buscar genero y dentro del genero el item
    genre_list = Genre.objects.order_by('pub_date')[:4]
    item = get_object_or_404(Item, id=item_id)
    context = {'genre_list': genre_list, 'item': item}
    return render(request, 'shop/detail.html', context)
