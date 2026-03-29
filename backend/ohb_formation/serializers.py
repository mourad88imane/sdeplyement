from rest_framework import serializers
from .models import FormationCategory, Formation, FormationEnrollment


class FormationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FormationCategory
        fields = ['id', 'name_fr', 'name_ar', 'description_fr', 'description_ar', 'icon']


class FormationListSerializer(serializers.ModelSerializer):
    category_name_fr = serializers.CharField(source='category.name_fr', read_only=True)
    category_name_ar = serializers.CharField(source='category.name_ar', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    level_display_fr = serializers.SerializerMethodField()
    level_display_ar = serializers.SerializerMethodField()
    enrollment_count = serializers.SerializerMethodField()

    class Meta:
        model = Formation
        fields = [
            'id', 'title_fr', 'title_ar', 'slug', 'label',
            'description_fr', 'description_ar',
            'category', 'category_name_fr', 'category_name_ar', 'category_icon',
            'level', 'level_display_fr', 'level_display_ar',
            'duration_weeks', 'duration_hours', 'max_students',
            'image', 'registration_open',
            'start_date', 'end_date',
            'status', 'featured', 'views_count',
            'enrollment_count',
            'created_at', 'updated_at'
        ]

    def get_level_display_fr(self, obj):
        return obj.get_level_display()

    def get_level_display_ar(self, obj):
        level_map = {
            'beginner': 'مبتدئ',
            'intermediate': 'متوسط',
            'advanced': 'متقدم',
            'expert': 'خبير'
        }
        return level_map.get(obj.level, obj.level)

    def get_enrollment_count(self, obj):
        return obj.enrollments.count()


class FormationDetailSerializer(serializers.ModelSerializer):
    category = FormationCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=FormationCategory.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )
    level_display_fr = serializers.SerializerMethodField()
    level_display_ar = serializers.SerializerMethodField()
    enrollment_count = serializers.SerializerMethodField()

    class Meta:
        model = Formation
        fields = [
            'id', 'title_fr', 'title_ar', 'slug', 'label',
            'description_fr', 'description_ar',
            'content_fr', 'content_ar',
            'objectives_fr', 'objectives_ar',
            'prerequisites_fr', 'prerequisites_ar',
            'target_audience_fr', 'target_audience_ar',
            'location_fr', 'location_ar',
            'teaching_methods_fr', 'teaching_methods_ar',
            'daily_organization_fr', 'daily_organization_ar',
            'daily_program_fr', 'daily_program_ar',
            'category', 'category_id',
            'level', 'level_display_fr', 'level_display_ar',
            'duration_weeks', 'duration_hours', 'max_students',
            'image', 'pdf_file', 'brochure_pdf',
            'registration_open',
            'start_date', 'end_date',
            'status', 'featured', 'views_count',
            'enrollment_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['views_count', 'created_at', 'updated_at']

    def get_level_display_fr(self, obj):
        return obj.get_level_display()

    def get_level_display_ar(self, obj):
        level_map = {
            'beginner': 'مبتدئ',
            'intermediate': 'متوسط',
            'advanced': 'متقدم',
            'expert': 'خبير'
        }
        return level_map.get(obj.level, obj.level)

    def get_enrollment_count(self, obj):
        return obj.enrollments.count()


class FormationEnrollmentSerializer(serializers.ModelSerializer):
    formation_title_fr = serializers.CharField(source='formation.title_fr', read_only=True)

    class Meta:
        model = FormationEnrollment
        fields = [
            'id', 'formation', 'formation_title_fr',
            'student_name', 'student_email', 'student_phone',
            'notes', 'enrolled_at', 'status'
        ]
        read_only_fields = ['enrolled_at', 'status']


class FormationEnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormationEnrollment
        fields = ['formation', 'student_name', 'student_email', 'student_phone', 'notes']
        extra_kwargs = {
            'formation': {'required': False, 'allow_null': True}
        }
