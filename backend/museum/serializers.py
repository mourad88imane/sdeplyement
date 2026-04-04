from rest_framework import serializers
from .models import MuseumEquipmentCategory, MuseumEquipment, MuseumPersonality


class MuseumEquipmentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MuseumEquipmentCategory
        fields = '__all__'


class MuseumEquipmentListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des équipements (données minimales)"""
    category_name_fr = serializers.CharField(source='category.name_fr', read_only=True)
    category_name_ar = serializers.CharField(source='category.name_ar', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    condition_display_fr = serializers.CharField(source='get_condition_display_fr', read_only=True)
    condition_display_ar = serializers.CharField(source='get_condition_display_ar', read_only=True)
    status_display_fr = serializers.CharField(source='get_status_display_fr', read_only=True)
    status_display_ar = serializers.CharField(source='get_status_display_ar', read_only=True)

    class Meta:
        model = MuseumEquipment
        fields = [
            'id', 'name_fr', 'name_ar', 'slug',
            'inventory_number', 'category_name_fr', 'category_name_ar', 'category_color',
            'condition', 'condition_display_fr', 'condition_display_ar',
            'status', 'status_display_fr', 'status_display_ar',
            'image', 'image_alt_fr', 'image_alt_ar',
            'origin', 'period', 'featured', 'author_name', 'created_at',
            'description_fr', 'description_ar', 'historical_context_fr', 'historical_context_ar',
            'dimensions', 'weight'
        ]


class MuseumEquipmentDetailSerializer(serializers.ModelSerializer):
    """Serializer pour les détails complets d'un équipement"""
    category = MuseumEquipmentCategorySerializer(read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    condition_display_fr = serializers.CharField(source='get_condition_display_fr', read_only=True)
    condition_display_ar = serializers.CharField(source='get_condition_display_ar', read_only=True)
    status_display_fr = serializers.CharField(source='get_status_display_fr', read_only=True)
    status_display_ar = serializers.CharField(source='get_status_display_ar', read_only=True)

    class Meta:
        model = MuseumEquipment
        fields = '__all__'


class MuseumEquipmentCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création d'équipements"""
    class Meta:
        model = MuseumEquipment
        exclude = ['author', 'created_at', 'updated_at']


# --- Personality Serializers ---

class MuseumPersonalityListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des personnalités (données minimales)"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    role_display_fr = serializers.CharField(source='get_role_display_fr', read_only=True)
    role_display_ar = serializers.CharField(source='get_role_display_ar', read_only=True)
    equipment_count = serializers.SerializerMethodField()

    class Meta:
        model = MuseumPersonality
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'slug',
            'role', 'role_display_fr', 'role_display_ar',
            'photo', 'photo_alt_fr', 'photo_alt_ar',
            'birth_date', 'death_date', 'birth_place', 'nationality',
            'featured', 'equipment_count', 'author_name', 'created_at'
        ]

    def get_equipment_count(self, obj):
        return obj.equipment.count()


class MuseumPersonalityDetailSerializer(serializers.ModelSerializer):
    """Serializer pour les détails complets d'une personnalité"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    role_display_fr = serializers.CharField(source='get_role_display_fr', read_only=True)
    role_display_ar = serializers.CharField(source='get_role_display_ar', read_only=True)
    equipment = MuseumEquipmentListSerializer(many=True, read_only=True)

    class Meta:
        model = MuseumPersonality
        fields = '__all__'


class MuseumPersonalityCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création de personnalités"""
    class Meta:
        model = MuseumPersonality
        exclude = ['author', 'created_at', 'updated_at']


class MuseumPersonalitySimpleSerializer(serializers.ModelSerializer):
    """Serializer simple pour les personnalités (utilisé dans les équipements)"""
    role_display_fr = serializers.CharField(source='get_role_display_fr', read_only=True)

    class Meta:
        model = MuseumPersonality
        fields = ['id', 'first_name', 'last_name', 'full_name', 'slug', 'role', 'role_display_fr', 'photo']
