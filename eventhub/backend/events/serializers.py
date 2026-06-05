from rest_framework import serializers
from .models import Category, Event


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color']


class EventSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)
    banner_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'date', 'location', 'organizer',
            'banner', 'banner_url', 'category', 'category_detail',
            'status', 'is_featured', 'max_participants', 'created_at',
        ]

    def get_banner_url(self, obj):
        if not obj.banner:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.banner.url)
        return obj.banner.url
