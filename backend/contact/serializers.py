from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for ContactMessage model."""
    
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'phone', 'created_at', 'is_read', 'is_replied']
        read_only_fields = ['id', 'created_at', 'is_read', 'is_replied']
    
    def create(self, validated_data):
        """Create a new contact message."""
        return ContactMessage.objects.create(**validated_data)


class ContactMessageCreateSerializer(serializers.Serializer):
    """Serializer for creating a new contact message (used in API)."""
    
    name = serializers.CharField(max_length=200, required=True)
    email = serializers.EmailField(required=True)
    subject = serializers.CharField(max_length=300, required=True)
    message = serializers.CharField(required=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Le nom doit contenir au moins 2 caractères.")
        return value.strip()
    
    def validate_message(self, value):
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Le message doit contenir au moins 10 caractères.")
        return value.strip()
