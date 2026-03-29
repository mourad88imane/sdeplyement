from rest_framework import serializers
from .models import NewsCategory, News, NewsComment, NewsTag, Newsletter


class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = '__all__'


class NewsTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsTag
        fields = '__all__'


class NewsListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des actualités (données minimales)"""
    category_name_fr = serializers.CharField(source='category.name_fr', read_only=True)
    category_name_ar = serializers.CharField(source='category.name_ar', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    priority_display_fr = serializers.CharField(source='get_priority_display_fr', read_only=True)
    priority_display_ar = serializers.CharField(source='get_priority_display_ar', read_only=True)
    comment_count = serializers.SerializerMethodField()
    reading_time = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = [
            'id', 'title_fr', 'title_ar', 'slug', 'summary_fr', 'summary_ar',
            'category_name_fr', 'category_name_ar', 'category_color',
            'priority', 'priority_display_fr', 'priority_display_ar',
            'featured_image', 'image_alt_fr', 'image_alt_ar',
            'featured', 'views_count', 'comment_count', 'reading_time',
            'published_at', 'event_date', 'author_name', 'created_at'
        ]

    def get_comment_count(self, obj):
        return obj.comments.filter(status='approved').count()

    def get_reading_time(self, obj):
        """Estimation du temps de lecture en minutes"""
        import re
        # Compter les mots dans le contenu français
        text = re.sub(r'<[^>]+>', '', obj.content_fr)  # Supprimer les balises HTML
        word_count = len(text.split())
        # Estimation: 200 mots par minute
        reading_time = max(1, round(word_count / 200))
        return reading_time


class NewsDetailSerializer(serializers.ModelSerializer):
    """Serializer pour les détails complets d'une actualité"""
    category = NewsCategorySerializer(read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    priority_display_fr = serializers.CharField(source='get_priority_display_fr', read_only=True)
    priority_display_ar = serializers.CharField(source='get_priority_display_ar', read_only=True)
    tags = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    reading_time = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = '__all__'

    def get_tags(self, obj):
        tags = NewsTag.objects.filter(tagged_news__news=obj)
        return NewsTagSerializer(tags, many=True).data

    def get_comments(self, obj):
        if obj.allow_comments:
            comments = obj.comments.filter(status='approved').order_by('-created_at')
            return NewsCommentSerializer(comments, many=True).data
        return []

    def get_comment_count(self, obj):
        return obj.comments.filter(status='approved').count()

    def get_reading_time(self, obj):
        import re
        text = re.sub(r'<[^>]+>', '', obj.content_fr)
        word_count = len(text.split())
        reading_time = max(1, round(word_count / 200))
        return reading_time


class NewsCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsComment
        fields = ['id', 'author_name', 'content', 'created_at']


class NewsCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsComment
        fields = ['news', 'author_name', 'author_email', 'content']
        
    def validate(self, data):
        news = data.get('news')
        if not news.allow_comments:
            raise serializers.ValidationError("Les commentaires ne sont pas autorisés pour cet article.")
        return data


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['email', 'name']
        
    def validate_email(self, value):
        if Newsletter.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError("Cette adresse email est déjà abonnée à la newsletter.")
        return value


class NewsCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création d'actualités"""
    class Meta:
        model = News
        exclude = ['author', 'views_count', 'created_at', 'updated_at']

    def create(self, validated_data):
        # L'auteur sera défini dans la vue
        return super().create(validated_data)


# --- Alumni Success Serializers ---
from .models import AlumniSuccess, AlumniPhoto


class AlumniPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniPhoto
        fields = ['id', 'image', 'caption_fr', 'caption_ar', 'created_at']


class AlumniSuccessListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    photos = AlumniPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = AlumniSuccess
        fields = ['id', 'title_fr', 'title_ar', 'slug', 'summary_fr', 'summary_ar', 'featured_image', 'photos', 'featured', 'published_at', 'year', 'author_name']


class AlumniSuccessDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    photos = AlumniPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = AlumniSuccess
        fields = '__all__'


class AlumniSuccessCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniSuccess
        exclude = ['author', 'created_at', 'updated_at']

    def create(self, validated_data):
        return super().create(validated_data)
