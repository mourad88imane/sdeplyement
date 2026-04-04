from rest_framework import serializers
from .models import CourseCategory, Course, CourseModule, CourseInstructor, CourseEnrollment


class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = '__all__'


class CourseModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseModule
        fields = '__all__'


class CourseInstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseInstructor
        fields = '__all__'


class CourseListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des cours (données minimales)"""
    category_name_fr = serializers.CharField(source='category.name_fr', read_only=True)
    category_name_ar = serializers.CharField(source='category.name_ar', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    level_display_fr = serializers.CharField(source='get_level_display_fr', read_only=True)
    level_display_ar = serializers.CharField(source='get_level_display_ar', read_only=True)
    grade_display_fr = serializers.SerializerMethodField()
    grade_display_ar = serializers.SerializerMethodField()
    grade_display_en = serializers.SerializerMethodField()
    instructor_count = serializers.SerializerMethodField()
    module_count = serializers.SerializerMethodField()
    enrollment_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title_fr', 'title_ar', 'title_en', 'label', 'course_type', 'slug',
            'description_fr', 'description_ar', 'description_en',
            'category_name_fr', 'category_name_ar', 'category_icon',
            'level', 'level_display_fr', 'level_display_ar',
            'grade', 'grade_display_fr', 'grade_display_ar', 'grade_display_en',
            'image', 'pdf_file', 'registration_open',
            'start_date', 'end_date', 'featured', 'views_count',
            'instructor_count', 'module_count', 'enrollment_count',
            'created_at', 'updated_at'
        ]

    def get_instructor_count(self, obj):
        return obj.instructors.count()

    def get_module_count(self, obj):
        return obj.modules.count()

    def get_enrollment_count(self, obj):
        return obj.enrollments.filter(status='approved').count()

    def get_grade_display_fr(self, obj):
        grade_map = {
            'inspecteur_technique_specialise': 'Inspecteur Technique Spécialisé',
            'assistant_technique_specialise': 'Assistant Technique Spécialisé',
            'agent_exploitation': "Agent d'Exploitation",
        }
        return grade_map.get(obj.grade, obj.grade)

    def get_grade_display_ar(self, obj):
        grade_map = {
            'inspecteur_technique_specialise': 'المفتش التقني المتخصص',
            'assistant_technique_specialise': 'المساعد التقني المتخصص',
            'agent_exploitation': 'عون الاستغلال',
        }
        return grade_map.get(obj.grade, obj.grade)

    def get_grade_display_en(self, obj):
        grade_map = {
            'inspecteur_technique_specialise': 'Specialized Technical Inspector',
            'assistant_technique_specialise': 'Specialized Technical Assistant',
            'agent_exploitation': 'Exploitation Agent',
        }
        return grade_map.get(obj.grade, obj.grade)


class CourseDetailSerializer(serializers.ModelSerializer):
    """Serializer pour les détails complets d'un cours"""
    category = CourseCategorySerializer(read_only=True)
    modules = CourseModuleSerializer(many=True, read_only=True)
    instructors = CourseInstructorSerializer(many=True, read_only=True)
    level_display_fr = serializers.CharField(source='get_level_display_fr', read_only=True)
    level_display_ar = serializers.CharField(source='get_level_display_ar', read_only=True)
    enrollment_count = serializers.SerializerMethodField()
    is_enrollment_open = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_enrollment_count(self, obj):
        return obj.enrollments.filter(status='approved').count()

    def get_is_enrollment_open(self, obj):
        from django.utils import timezone
        if not obj.registration_open:
            return False
        if obj.registration_deadline and obj.registration_deadline < timezone.now():
            return False
        return True


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    course_title_fr = serializers.CharField(source='course.title_fr', read_only=True)
    course_title_ar = serializers.CharField(source='course.title_ar', read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = '__all__'
        read_only_fields = ['enrolled_at', 'updated_at']

    def validate(self, data):
        """Validation personnalisée pour les inscriptions"""
        course = data.get('course')
        student_email = data.get('student_email')

        # Vérifier si l'inscription est ouverte
        if not course.registration_open:
            raise serializers.ValidationError("Les inscriptions pour ce cours sont fermées.")

        # Vérifier la date limite d'inscription
        from django.utils import timezone
        if course.registration_deadline and course.registration_deadline < timezone.now():
            raise serializers.ValidationError("La date limite d'inscription est dépassée.")

        # Vérifier si l'étudiant n'est pas déjà inscrit
        if CourseEnrollment.objects.filter(course=course, student_email=student_email).exists():
            raise serializers.ValidationError("Vous êtes déjà inscrit à ce cours.")

        # Vérifier le nombre maximum d'étudiants
        approved_enrollments = CourseEnrollment.objects.filter(
            course=course,
            status='approved'
        ).count()
        if approved_enrollments >= course.max_students:
            raise serializers.ValidationError("Le nombre maximum d'étudiants pour ce cours est atteint.")

        return data


class CourseCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création de cours"""
    slug = serializers.SlugField(required=False)
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Course
        exclude = ['created_by', 'views_count', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Le created_by sera défini dans la vue
        return super().create(validated_data)
