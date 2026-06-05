from django.contrib import admin
from .models import Category, Event


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'color']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'category', 'status', 'is_featured', 'date']
    list_filter = ['status', 'is_featured', 'category']
    search_fields = ['title', 'description', 'location']
