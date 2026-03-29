from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import NewsCategory, News, NewsComment, NewsTag, NewsTagRelation, Newsletter, AlumniSuccess, AlumniPhoto


class AlumniPhotoInline(admin.TabularInline):
    model = AlumniPhoto
    extra = 1
    readonly_fields = ['created_at']
    # Prevent admin from adding more than the maximum allowed photos inline
    max_num = AlumniPhoto.MAX_PER_ALUMNI
    # Optionally show a note in the inline
    verbose_name = 'Photo d\'ancien'
    verbose_name_plural = 'Photos des anciens'





@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_ar', 'color_display', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name_fr', 'name_ar']
    fields = ['name_fr', 'name_ar', 'description_fr', 'description_ar', 'color']

    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 5px 10px; border-radius: 3px; color: white;">{}</span>',
            obj.color,
            obj.color
        )
    color_display.short_description = 'Couleur'


class NewsTagRelationInline(admin.TabularInline):
    model = NewsTagRelation
    extra = 1


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = [
        'title_fr',
        'category',
        'priority',
        'status',
        'featured',
        'views_count',
        'published_at',
        'author'
    ]
    list_filter = [
        'status',
        'priority',
        'category',
        'featured',
        'published_at',
        'created_at'
    ]
    search_fields = ['title_fr', 'title_ar', 'summary_fr', 'summary_ar']
    prepopulated_fields = {'slug': ('title_fr',)}
    readonly_fields = ['views_count', 'created_at', 'updated_at']
    date_hierarchy = 'published_at'
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title_fr', 'title_ar', 'slug', 'category', 'priority', 'status', 'featured')
        }),
        ('Contenu', {
            'fields': ('summary_fr', 'summary_ar', 'content_fr', 'content_ar')
        }),
        ('Image à la une', {
            'fields': ('featured_image', 'image_alt_fr', 'image_alt_ar')
        }),
        ('Dates', {
            'fields': ('published_at', 'event_date')
        }),
        ('Paramètres', {
            'fields': ('allow_comments',)
        }),
        ('SEO', {
            'fields': ('meta_description_fr', 'meta_description_ar'),
            'classes': ('collapse',)
        }),
        ('Statistiques', {
            'fields': ('views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [NewsTagRelationInline]
    
    actions = ['publish_news', 'unpublish_news', 'feature_news', 'unfeature_news']
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si c'est un nouvel article
            obj.author = request.user
        
        # Auto-définir la date de publication si le statut passe à "published"
        if obj.status == 'published' and not obj.published_at:
            obj.published_at = timezone.now()
        
        super().save_model(request, obj, form, change)
    
    def publish_news(self, request, queryset):
        updated = queryset.update(status='published', published_at=timezone.now())
        self.message_user(request, f'{updated} articles publiés.')
    publish_news.short_description = "Publier les articles sélectionnés"
    
    def unpublish_news(self, request, queryset):
        updated = queryset.update(status='draft')
        self.message_user(request, f'{updated} articles dépubliés.')
    unpublish_news.short_description = "Dépublier les articles sélectionnés"
    
    def feature_news(self, request, queryset):
        updated = queryset.update(featured=True)
        self.message_user(request, f'{updated} articles mis en avant.')
    feature_news.short_description = "Mettre en avant les articles sélectionnés"
    
    def unfeature_news(self, request, queryset):
        updated = queryset.update(featured=False)
        self.message_user(request, f'{updated} articles retirés de la mise en avant.')
    unfeature_news.short_description = "Retirer de la mise en avant"


@admin.register(NewsComment)
class NewsCommentAdmin(admin.ModelAdmin):
    list_display = ['author_name', 'news', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['author_name', 'author_email', 'content', 'news__title_fr']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Commentaire', {
            'fields': ('news', 'author_name', 'author_email', 'content', 'status')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_comments', 'reject_comments']
    
    def approve_comments(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} commentaires approuvés.')
    approve_comments.short_description = "Approuver les commentaires sélectionnés"
    
    def reject_comments(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} commentaires rejetés.')
    reject_comments.short_description = "Rejeter les commentaires sélectionnés"


@admin.register(NewsTag)
class NewsTagAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_ar', 'slug', 'created_at']
    search_fields = ['name_fr', 'name_ar']
    prepopulated_fields = {'slug': ('name_fr',)}


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'is_active', 'subscribed_at']
    list_filter = ['is_active', 'subscribed_at']
    search_fields = ['email', 'name']
    readonly_fields = ['subscribed_at', 'unsubscribed_at']
    
    actions = ['activate_subscriptions', 'deactivate_subscriptions']
    
    def activate_subscriptions(self, request, queryset):
        updated = queryset.update(is_active=True, unsubscribed_at=None)
        self.message_user(request, f'{updated} abonnements activés.')
    activate_subscriptions.short_description = "Activer les abonnements sélectionnés"
    
    def deactivate_subscriptions(self, request, queryset):
        updated = queryset.update(is_active=False, unsubscribed_at=timezone.now())
        self.message_user(request, f'{updated} abonnements désactivés.')
    deactivate_subscriptions.short_description = "Désactiver les abonnements sélectionnés"


@admin.register(AlumniSuccess)
class AlumniSuccessAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'year', 'featured', 'published_at', 'author']
    list_filter = ['year', 'featured', 'published_at']
    search_fields = ['title_fr', 'title_ar', 'summary_fr', 'summary_ar']
    prepopulated_fields = {'slug': ('title_fr',)}
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Informations de base', {
            'fields': ('title_fr', 'title_ar', 'slug', 'year', 'featured')
        }),
        ('Contenu', {
            'fields': ('summary_fr', 'summary_ar', 'content_fr', 'content_ar')
        }),
        ('Image', {
            'fields': ('featured_image', 'image_alt_fr', 'image_alt_ar')
        }),
        ('Dates', {
            'fields': ('published_at',)
        }),
        ('Audit', {
            'fields': ('author', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    inlines = [AlumniPhotoInline]

    def save_model(self, request, obj, form, change):
        if not change:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(AlumniPhoto)
class AlumniPhotoAdmin(admin.ModelAdmin):
    """Manage Alumni photos directly from the admin dashboard under News."""
    list_display = ['id', 'thumbnail', 'alumni_link', 'caption_fr', 'caption_ar', 'created_at']
    list_filter = ['created_at', 'alumni__year']
    search_fields = ['caption_fr', 'caption_ar', 'alumni__title_fr', 'alumni__title_ar']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

    def alumni_link(self, obj):
        return format_html('<a href="/admin/news/alumnisuccess/{}/change/">{}</a>', obj.alumni.id, obj.alumni.title_fr)
    alumni_link.short_description = 'Alumni'

    def thumbnail(self, obj):
        if obj.image:
            try:
                return format_html('<img src="{}" style="height:48px; width:auto; object-fit:cover; border-radius:4px;" />', obj.image.url)
            except Exception:
                return '-'
        return '-'
    thumbnail.short_description = 'Preview'
