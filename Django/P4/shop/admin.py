from django.contrib import admin

from .models import Genre, Item, Order

# Register your models here.

class ItemInline(admin.StackedInline):
    model = Item
    extra = 0
    fieldsets = [
        ('Info', {'fields': ['id', 'text', 'price']}),
        ('Media', {'fields': ['imgsrc', 'detailImgsrc', 'videosrc', 'audiosrc'], 'classes': ['collapse']}),
        ('Date_Information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]

class GenreAdmin(admin.ModelAdmin):
    inlines = [ItemInline]

class ItemAdmin(admin.ModelAdmin):
    list_filter = ['pub_date']
    search_fields = ['text', 'id', 'genre__text', 'genre__id']
    fieldsets = [
        ('Info', {'fields': ['id', 'text', 'price']}),
        ('Media', {'fields': ['imgsrc', 'detailImgsrc', 'videosrc', 'audiosrc'], 'classes': ['collapse']}),
        ('Date_Information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]

admin.site.register(Genre, GenreAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(Order)