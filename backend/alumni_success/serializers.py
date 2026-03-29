from rest_framework import serializers
from .models import AlumniSuccess, AlumniPhoto

class AlumniPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniPhoto
        fields = ['id', 'image', 'legend_fr', 'legend_ar', 'legend_en', 'uploaded_at']

class AlumniSuccessSerializer(serializers.ModelSerializer):
    gallery = AlumniPhotoSerializer(many=True, read_only=True)
    class Meta:
        model = AlumniSuccess
        fields = '__all__'
