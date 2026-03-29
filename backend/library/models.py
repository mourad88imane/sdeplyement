from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class BookCategory(models.Model):
    """Catégories de livres"""
    name_fr = models.CharField(max_length=100, verbose_name="Nom (Français)")
    name_ar = models.CharField(max_length=100, verbose_name="Nom (Arabe)")
    description_fr = models.TextField(blank=True, verbose_name="Description (Français)")
    description_ar = models.TextField(blank=True, verbose_name="Description (Arabe)")
    icon = models.CharField(max_length=50, blank=True, help_text="Nom de l'icône")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Catégorie de livre"
        verbose_name_plural = "Catégories de livres"
        ordering = ['name_fr']

    def __str__(self):
        return self.name_fr


class Author(models.Model):
    """Auteurs des livres"""
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    bio_fr = models.TextField(blank=True, verbose_name="Biographie (Français)")
    bio_ar = models.TextField(blank=True, verbose_name="Biographie (Arabe)")
    birth_date = models.DateField(blank=True, null=True, verbose_name="Date de naissance")
    death_date = models.DateField(blank=True, null=True, verbose_name="Date de décès")
    nationality = models.CharField(max_length=100, blank=True, verbose_name="Nationalité")
    photo = models.ImageField(upload_to='authors/', blank=True, verbose_name="Photo")
    website = models.URLField(blank=True, verbose_name="Site web")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Auteur"
        verbose_name_plural = "Auteurs"
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Publisher(models.Model):
    """Éditeurs"""
    name = models.CharField(max_length=200, verbose_name="Nom de l'éditeur")
    address = models.TextField(blank=True, verbose_name="Adresse")
    website = models.URLField(blank=True, verbose_name="Site web")
    email = models.EmailField(blank=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Éditeur"
        verbose_name_plural = "Éditeurs"
        ordering = ['name']

    def __str__(self):
        return self.name


class Book(models.Model):
    """Modèle pour les livres"""
    STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('borrowed', 'Emprunté'),
        ('reserved', 'Réservé'),
        ('maintenance', 'En maintenance'),
        ('lost', 'Perdu'),
    ]

    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('ar', 'Arabe'),
        ('en', 'Anglais'),
        ('es', 'Espagnol'),
        ('de', 'Allemand'),
        ('other', 'Autre'),
    ]

    FORMAT_CHOICES = [
        ('physical', 'Physique'),
        ('digital', 'Numérique'),
        ('both', 'Les deux'),
    ]

    # Informations de base
    title = models.CharField(max_length=300, verbose_name="Titre")
    subtitle = models.CharField(max_length=300, blank=True, verbose_name="Sous-titre")
    authors = models.ManyToManyField(Author, verbose_name="Auteurs")
    category = models.ForeignKey(BookCategory, on_delete=models.CASCADE, verbose_name="Catégorie")
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE, verbose_name="Éditeur")

    # Détails de publication
    isbn = models.CharField(max_length=17, unique=True, verbose_name="ISBN")
    publication_date = models.DateField(verbose_name="Date de publication")
    edition = models.CharField(max_length=50, blank=True, verbose_name="Édition")
    pages = models.PositiveIntegerField(verbose_name="Nombre de pages")
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, verbose_name="Langue")

    # Description et contenu
    description_fr = models.TextField(verbose_name="Description (Français)")
    description_ar = models.TextField(blank=True, verbose_name="Description (Arabe)")
    summary_fr = models.TextField(blank=True, verbose_name="Résumé (Français)")
    summary_ar = models.TextField(blank=True, verbose_name="Résumé (Arabe)")
    table_of_contents = models.TextField(blank=True, verbose_name="Table des matières")

    # Médias
    cover_image = models.ImageField(upload_to='books/covers/', verbose_name="Couverture")
    pdf_file = models.FileField(upload_to='books/pdfs/', blank=True, verbose_name="Fichier PDF")

    # Informations physiques
    format_type = models.CharField(max_length=20, choices=FORMAT_CHOICES, default='physical', verbose_name="Format")
    dimensions = models.CharField(max_length=50, blank=True, verbose_name="Dimensions (cm)")
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name="Poids (g)")

    # Gestion de la bibliothèque
    call_number = models.CharField(max_length=50, unique=True, verbose_name="Cote")
    location = models.CharField(max_length=100, verbose_name="Emplacement")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', verbose_name="Statut")
    copies_total = models.PositiveIntegerField(default=1, verbose_name="Nombre total d'exemplaires")
    copies_available = models.PositiveIntegerField(default=1, verbose_name="Exemplaires disponibles")

    # Métadonnées
    keywords = models.TextField(blank=True, help_text="Mots-clés séparés par des virgules")
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0.00), MaxValueValidator(5.00)],
        verbose_name="Note moyenne"
    )
    views_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de vues")
    download_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de téléchargements")

    # Paramètres d'accès
    is_featured = models.BooleanField(default=False, verbose_name="Livre mis en avant")
    is_new_arrival = models.BooleanField(default=False, verbose_name="Nouvelle acquisition")
    allow_download = models.BooleanField(default=False, verbose_name="Autoriser le téléchargement")
    require_permission = models.BooleanField(default=False, verbose_name="Nécessite une autorisation")

    # Audit
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='added_books')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Livre"
        verbose_name_plural = "Livres"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def is_available(self):
        return self.status == 'available' and self.copies_available > 0

    @property
    def authors_list(self):
        return ", ".join([author.full_name for author in self.authors.all()])


class BookReview(models.Model):
    """Avis sur les livres"""
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    reviewer_name = models.CharField(max_length=100, verbose_name="Nom du critique")
    reviewer_email = models.EmailField(verbose_name="Email du critique")
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Note (1-5)"
    )
    title = models.CharField(max_length=200, verbose_name="Titre de l'avis")
    content = models.TextField(verbose_name="Contenu de l'avis")
    is_approved = models.BooleanField(default=False, verbose_name="Approuvé")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Avis sur livre"
        verbose_name_plural = "Avis sur livres"
        ordering = ['-created_at']
        unique_together = ['book', 'reviewer_email']

    def __str__(self):
        return f"Avis de {self.reviewer_name} sur {self.book.title}"


class BookBorrow(models.Model):
    """Emprunts de livres"""
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('returned', 'Retourné'),
        ('overdue', 'En retard'),
        ('lost', 'Perdu'),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='borrows')
    borrower_name = models.CharField(max_length=100, verbose_name="Nom de l'emprunteur")
    borrower_email = models.EmailField(verbose_name="Email de l'emprunteur")
    borrower_phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    student_id = models.CharField(max_length=50, blank=True, verbose_name="Numéro étudiant")

    borrow_date = models.DateTimeField(auto_now_add=True, verbose_name="Date d'emprunt")
    due_date = models.DateTimeField(verbose_name="Date de retour prévue")
    return_date = models.DateTimeField(blank=True, null=True, verbose_name="Date de retour effective")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="Statut")
    notes = models.TextField(blank=True, verbose_name="Notes")

    processed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Traité par")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Emprunt"
        verbose_name_plural = "Emprunts"
        ordering = ['-borrow_date']

    def __str__(self):
        return f"{self.borrower_name} - {self.book.title}"

    @property
    def is_overdue(self):
        from django.utils import timezone
        return self.status == 'active' and self.due_date < timezone.now()


class BookReservation(models.Model):
    """Réservations de livres"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('ready', 'Prêt'),
        ('fulfilled', 'Satisfait'),
        ('cancelled', 'Annulé'),
        ('expired', 'Expiré'),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reservations')
    reserver_name = models.CharField(max_length=100, verbose_name="Nom du réservant")
    reserver_email = models.EmailField(verbose_name="Email du réservant")
    reserver_phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")

    reservation_date = models.DateTimeField(auto_now_add=True, verbose_name="Date de réservation")
    expiry_date = models.DateTimeField(verbose_name="Date d'expiration")
    pickup_date = models.DateTimeField(blank=True, null=True, verbose_name="Date de retrait")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")
    notes = models.TextField(blank=True, verbose_name="Notes")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Réservation"
        verbose_name_plural = "Réservations"
        ordering = ['-reservation_date']

    def __str__(self):
        return f"{self.reserver_name} - {self.book.title}"
