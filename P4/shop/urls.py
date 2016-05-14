from django.conf.urls import url

from . import views

app_name = 'shop'
urlpatterns = [
    # ex: /shop/
    url(r'^$', views.indexView, name='index'),
    # ex: /shop/bikes/
    url(r'^(?P<genre_id>\w+)/$', views.genreView, name='genre'),
    # ex: /shop/bikes/results/
    url(r'^(?P<genre_id>\w+)/(?P<item_id>\w+)/$', views.itemView, name='item'),
]