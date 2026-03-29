from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import BookCategory, Author, Publisher, Book, BookReview, BookBorrow, BookReservation


@admin.register(BookCategory)
class BookCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_ar', 'icon', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name_fr', 'name_ar']
    fields = ['name_fr', 'name_ar', 'description_fr', 'description_ar', 'icon']


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'nationality', 'birth_date', 'created_at']
    list_filter = ['nationality', 'birth_date', 'created_at']
    search_fields = ['first_name', 'last_name', 'nationality']
    fields = [
        'first_name', 'last_name', 'bio_fr', 'bio_ar', 
        'birth_date', 'death_date', 'nationality', 'photo', 'website'
    ]


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'created_at']
    search_fields = ['name', 'email']
    fields = ['name', 'address', 'website', 'email', 'phone']


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'authors_list',
        'category',
        'publisher',
        'status',
        'copies_available',
        'copies_total',
        'is_featured',
        'created_at'
    ]
    list_filter = [
        'status',
        'category',
        'publisher',
        'language',
        'format_type',
        'is_featured',
        'is_new_arrival',
        'created_at'
    ]
    search_fields = ['title', 'subtitle', 'isbn', 'description_fr', 'description_ar']
    readonly_fields = ['views_count', 'download_count', 'rating', 'created_at', 'updated_at']
    filter_horizontal = ['authors']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'subtitle', 'authors', 'category', 'publisher')
        }),
        ('Détails de publication', {
            'fields': ('isbn', 'publication_date', 'edition', 'pages', 'language')
        }),
        ('Description', {
            'fields': ('description_fr', 'description_ar', 'summary_fr', 'summary_ar', 'table_of_contents')
        }),
        ('Médias', {
            'fields': ('cover_image', 'pdf_file')
        }),
        ('Informations physiques', {
            'fields': ('format_type', 'dimensions', 'weight')
        }),
        ('Gestion bibliothèque', {
            'fields': ('call_number', 'location', 'status', 'copies_total', 'copies_available')
        }),
        ('Métadonnées', {
            'fields': ('keywords', 'rating', 'views_count', 'download_count'),
            'classes': ('collapse',)
        }),
        ('Paramètres d\'accès', {
            'fields': ('is_featured', 'is_new_arrival', 'allow_download', 'require_permission')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_featured', 'mark_as_available', 'mark_as_maintenance']
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si c'est un nouveau livre
            obj.added_by = request.user
        super().save_model(request, obj, form, change)
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} livres marqués comme mis en avant.')
    mark_as_featured.short_description = "Marquer comme mis en avant"
    
    def mark_as_available(self, request, queryset):
        updated = queryset.update(status='available')
        self.message_user(request, f'{updated} livres marqués comme disponibles.')
    mark_as_available.short_description = "Marquer comme disponible"
    
    def mark_as_maintenance(self, request, queryset):
        updated = queryset.update(status='maintenance')
        self.message_user(request, f'{updated} livres marqués en maintenance.')
    mark_as_maintenance.short_description = "Marquer en maintenance"


@admin.register(BookReview)
class BookReviewAdmin(admin.ModelAdmin):
    list_display = ['reviewer_name', 'book', 'rating', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = ['reviewer_name', 'reviewer_email', 'book__title', 'title']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Avis', {
            'fields': ('book', 'reviewer_name', 'reviewer_email', 'rating', 'title', 'content', 'is_approved')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_reviews', 'reject_reviews']
    
    def approve_reviews(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} avis approuvés.')
    approve_reviews.short_description = "Approuver les avis sélectionnés"
    
    def reject_reviews(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} avis rejetés.')
    reject_reviews.short_description = "Rejeter les avis sélectionnés"


@admin.register(BookBorrow)
class BookBorrowAdmin(admin.ModelAdmin):
    list_display = [
        'borrower_name',
        'book',
        'borrow_date',
        'due_date',
        'return_date',
        'status',
        'is_overdue_display'
    ]
    list_filter = ['status', 'borrow_date', 'due_date']
    search_fields = ['borrower_name', 'borrower_email', 'book__title', 'student_id']
    readonly_fields = ['borrow_date', 'created_at', 'updated_at', 'is_overdue_display']
    
    fieldsets = (
        ('Emprunteur', {
            'fields': ('borrower_name', 'borrower_email', 'borrower_phone', 'student_id')
        }),
        ('Livre et dates', {
            'fields': ('book', 'borrow_date', 'due_date', 'return_date', 'status')
        }),
        ('Informations supplémentaires', {
            'fields': ('notes', 'processed_by')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_returned', 'mark_as_overdue']
    
    def is_overdue_display(self, obj):
        if obj.is_overdue:
            return format_html('<span style="color: red;">En retard</span>')
        return 'Non'
    is_overdue_display.short_description = 'En retard'
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si c'est un nouvel emprunt
            obj.processed_by = request.user
        super().save_model(request, obj, form, change)
    
    def mark_as_returned(self, request, queryset):
        updated = queryset.update(status='returned', return_date=timezone.now())
        self.message_user(request, f'{updated} emprunts marqués comme retournés.')
    mark_as_returned.short_description = "Marquer comme retourné"
    
    def mark_as_overdue(self, request, queryset):
        updated = queryset.update(status='overdue')
        self.message_user(request, f'{updated} emprunts marqués en retard.')
    mark_as_overdue.short_description = "Marquer en retard"


@admin.register(BookReservation)
class BookReservationAdmin(admin.ModelAdmin):
    list_display = [
        'reserver_name',
        'book',
        'reservation_date',
        'expiry_date',
        'status'
    ]
    list_filter = ['status', 'reservation_date', 'expiry_date']
    search_fields = ['reserver_name', 'reserver_email', 'book__title']
    readonly_fields = ['reservation_date', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Réservant', {
            'fields': ('reserver_name', 'reserver_email', 'reserver_phone')
        }),
        ('Réservation', {
            'fields': ('book', 'reservation_date', 'expiry_date', 'pickup_date', 'status')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_ready', 'mark_as_fulfilled', 'mark_as_cancelled']
    
    def mark_as_ready(self, request, queryset):
        updated = queryset.update(status='ready')
        self.message_user(request, f'{updated} réservations marquées comme prêtes.')
    mark_as_ready.short_description = "Marquer comme prêt"
    
    def mark_as_fulfilled(self, request, queryset):
        updated = queryset.update(status='fulfilled', pickup_date=timezone.now())
        self.message_user(request, f'{updated} réservations marquées comme satisfaites.')
    mark_as_fulfilled.short_description = "Marquer comme satisfait"
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} réservations annulées.')
    mark_as_cancelled.short_description = "Annuler les réservations"
