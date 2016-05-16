from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views import generic

from django.utils import timezone

from .models import Genre, Item, Order
from django.db.models import Sum

import re

from django.db.models import Q

# Create your views here.

def normalize_query(query_string,
                    findterms=re.compile(r'"([^"]+)"|(\S+)').findall,
                    normspace=re.compile(r'\s{2,}').sub):
    ''' Splits the query string in invidual keywords, getting rid of unecessary spaces
        and grouping quoted words together.
        Example:

        >>> normalize_query('  some random  words "with   quotes  " and   spaces')
        ['some', 'random', 'words', 'with quotes', 'and', 'spaces']

    '''
    return [normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)]


def get_query(query_string, search_fields):
    ''' Returns a query, that is a combination of Q objects. That combination
        aims to search keywords within a model by testing the given search fields.

    '''
    query = None  # Query to search for every search term
    terms = normalize_query(query_string)
    for term in terms:
        or_query = None  # Query to search for a given term in each field
        for field_name in search_fields:
            q = Q(**{"%s__icontains" % field_name: term})
            if or_query is None:
                or_query = q
            else:
                or_query = or_query | q
        if query is None:
            query = or_query
        else:
            query = query & or_query
    return query

def indexView(request):
    genre_list = Genre.objects.order_by('pub_date')[:4]
    context = {'genre_list': genre_list}

    if (request.POST):
        mail = request.POST['mail']
        dir = request.POST['dir']
        id = mail + "," + dir

        item_list = Item.objects.filter(inCart = True)

        totalPrice = 0
        for item in item_list:
            totalPrice += item.price

        Order.objects.create(ordererMail = mail, ordererDir = dir, orderPrice = totalPrice, orderId = id)

        for item in item_list:
            item.inCart = False
            item.save()

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

def cartView(request, item_id=None):
    if (item_id):
        addedItem = Item.objects.get(id = item_id)
        addedItem.inCart = not addedItem.inCart
        addedItem.save()

    genre_list = Genre.objects.order_by('pub_date')[:4]
    item_list = Item.objects.filter(inCart = True).order_by('pub_date')
    totalPrice = 0
    for item in item_list:
        totalPrice += item.price
    context = {'genre_list': genre_list, 'item_list': item_list, 'total': totalPrice}

    return render(request, 'shop/cart.html', context)

def search(request):
    genre_list = Genre.objects.order_by('pub_date')[:4]

    item_list = None

    if ('searchbox' in request.GET) and request.GET['searchbox'].strip():
        query_string = request.GET['searchbox']
        search_fields = ['text', 'id', 'genre__text', 'genre__id']

        entry_query = get_query(query_string, search_fields)

        item_list = Item.objects.filter(entry_query).order_by('pub_date')

    context = {'genre_list': genre_list, 'item_list': item_list}
    return render(request, 'shop/search.html', context)