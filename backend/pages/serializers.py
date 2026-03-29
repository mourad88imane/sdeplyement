from rest_framework import serializers
from .models import Page


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'slug', 'title_fr', 'title_en', 'title_ar', 'content_fr', 'content_en', 'content_ar', 'featured_image', 'created_at', 'updated_at']
