from rest_framework import serializers
from .models import Banner

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = [
            'id',
            'text1_fr', 'text1_en', 'text1_ar',
            'text2_fr', 'text2_en', 'text2_ar',
            'text3_fr', 'text3_en', 'text3_ar',
            'image_left', 'image_right', 'is_active'
        ]
