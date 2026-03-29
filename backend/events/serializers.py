from rest_framework import serializers
from .models import Event, EventCategory, EventRegistration


class EventCategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories d'événements"""
    
    class Meta:
        model = EventCategory
        fields = [
            'id', 'name_fr', 'name_ar', 'description_fr', 'description_ar',
            'color', 'icon', 'created_at'
        ]


class EventSerializer(serializers.ModelSerializer):
    """Serializer pour les événements"""
    
    category = EventCategorySerializer(read_only=True)
    organizer_name = serializers.CharField(source='organizer.get_full_name', read_only=True)
    organizer_email = serializers.CharField(source='organizer.email', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    # Propriétés calculées
    is_upcoming = serializers.ReadOnlyField()
    is_ongoing = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    registration_open = serializers.ReadOnlyField()
    available_spots = serializers.ReadOnlyField()
    
    # Compteurs
    registrations_count = serializers.SerializerMethodField()
    confirmed_registrations_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title_fr', 'title_ar', 'slug',
            'description_fr', 'description_ar',
            'category',
            'start_date', 'end_date', 'registration_deadline',
            'location', 'address', 'room',
            'max_participants', 'registration_required', 'registration_fee',
            'status', 'priority',
            'image', 'attachment',
            'organizer_name', 'organizer_email', 'created_by_name',
            'is_featured', 'is_public',
            'views_count',
            'is_upcoming', 'is_ongoing', 'is_past',
            'registration_open', 'available_spots',
            'registrations_count', 'confirmed_registrations_count',
            'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = [
            'id', 'slug', 'views_count', 'created_at', 'updated_at', 'published_at'
        ]
    
    def get_registrations_count(self, obj):
        """Retourne le nombre total d'inscriptions"""
        return obj.registrations.count()
    
    def get_confirmed_registrations_count(self, obj):
        """Retourne le nombre d'inscriptions confirmées"""
        return obj.registrations.filter(status='confirmed').count()


class EventListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des événements"""
    
    category_name = serializers.CharField(source='category.name_fr', read_only=True)
    organizer_name = serializers.CharField(source='organizer.get_full_name', read_only=True)
    
    # Propriétés calculées
    is_upcoming = serializers.ReadOnlyField()
    is_ongoing = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title_fr', 'title_ar', 'slug',
            'description_fr', 'description_ar',
            'category_name',
            'start_date', 'end_date',
            'location', 'address', 'room',
            'max_participants', 'registration_required', 'registration_fee',
            'status', 'priority',
            'organizer_name',
            'is_featured', 'is_public',
            'is_upcoming', 'is_ongoing', 'is_past',
            'views_count',
            'created_at'
        ]


class ConferenceSerializer(serializers.ModelSerializer):
    """Serializer spécifique pour les conférences"""
    
    category_name = serializers.CharField(source='category.name_fr', read_only=True)
    organizer = serializers.SerializerMethodField()
    status_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title_fr', 'title_ar', 'slug',
            'description_fr', 'description_ar',
            'category_name',
            'start_date', 'end_date', 'registration_deadline',
            'location', 'address', 'room',
            'max_participants', 'registration_required', 'registration_fee',
            'priority', 'is_featured',
            'organizer', 'status_info',
            'views_count', 'created_at'
        ]
    
    def get_organizer(self, obj):
        """Retourne les informations de l'organisateur"""
        return {
            'name': obj.organizer.get_full_name() or obj.organizer.username,
            'email': obj.organizer.email
        }
    
    def get_status_info(self, obj):
        """Retourne les informations de statut"""
        return {
            'is_upcoming': obj.is_upcoming,
            'is_ongoing': obj.is_ongoing,
            'is_past': obj.is_past,
            'registration_open': obj.registration_open if hasattr(obj, 'registration_open') else False
        }


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer pour les inscriptions aux événements"""
    
    event_title = serializers.CharField(source='event.title_fr', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = [
            'id', 'event', 'event_title', 'user', 'user_name',
            'status', 'notes', 'registered_at', 'updated_at'
        ]
        read_only_fields = ['id', 'registered_at', 'updated_at']
