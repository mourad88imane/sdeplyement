from django.db import models
from django.conf import settings
from django.utils.text import slugify


class NewsCategory(models.Model):
    """Catégories d'actualités"""
    name_fr = models.CharField(max_length=100, verbose_name="Nom (Français)")
    name_ar = models.CharField(max_length=100, verbose_name="Nom (Arabe)")
    description_fr = models.TextField(blank=True, verbose_name="Description (Français)")
    description_ar = models.TextField(blank=True, verbose_name="Description (Arabe)")
    color = models.CharField(max_length=7, default='#3B82F6', help_text="Couleur hexadécimale")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Catégorie d'actualité"
        verbose_name_plural = "Catégories d'actualités"
        ordering = ['name_fr']

    def __str__(self):
        return self.name_fr


class News(models.Model):
    """Modèle pour les actualités"""
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('archived', 'Archivé'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Faible'),
        ('normal', 'Normal'),
        ('high', 'Élevé'),
        ('urgent', 'Urgent'),
    ]

    # Informations de base
    title_fr = models.CharField(max_length=200, verbose_name="Titre (Français)")
    title_ar = models.CharField(max_length=200, verbose_name="Titre (Arabe)")
    slug = models.SlugField(max_length=250, unique=True)

    # Contenu
    summary_fr = models.TextField(max_length=500, verbose_name="Résumé (Français)")
    summary_ar = models.TextField(max_length=500, verbose_name="Résumé (Arabe)")
    content_fr = models.TextField(verbose_name="Contenu (Français)")
    content_ar = models.TextField(verbose_name="Contenu (Arabe)")

    # Métadonnées
    category = models.ForeignKey(NewsCategory, on_delete=models.CASCADE, verbose_name="Catégorie")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal', verbose_name="Priorité")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")

    # Médias
    featured_image = models.ImageField(upload_to='news/images/', verbose_name="Image à la une")
    image_alt_fr = models.CharField(max_length=200, blank=True, verbose_name="Texte alternatif image (Français)")
    image_alt_ar = models.CharField(max_length=200, blank=True, verbose_name="Texte alternatif image (Arabe)")

    # Dates
    published_at = models.DateTimeField(blank=True, null=True, verbose_name="Date de publication")
    event_date = models.DateTimeField(blank=True, null=True, verbose_name="Date de l'événement")

    # Paramètres d'affichage
    featured = models.BooleanField(default=False, verbose_name="Article mis en avant")
    allow_comments = models.BooleanField(default=True, verbose_name="Autoriser les commentaires")
    views_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de vues")

    # SEO
    meta_description_fr = models.CharField(max_length=160, blank=True, verbose_name="Meta description (Français)")
    meta_description_ar = models.CharField(max_length=160, blank=True, verbose_name="Meta description (Arabe)")

    # Audit
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='news_articles', verbose_name="Auteur")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Actualité"
        verbose_name_plural = "Actualités"
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title_fr

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title_fr)
        super().save(*args, **kwargs)

    def get_priority_display_fr(self):
        priority_map = {
            'low': 'Faible',
            'normal': 'Normal',
            'high': 'Élevé',
            'urgent': 'Urgent',
        }
        return priority_map.get(self.priority, self.priority)

    def get_priority_display_ar(self):
        priority_map = {
            'low': 'منخفض',
            'normal': 'عادي',
            'high': 'عالي',
            'urgent': 'عاجل',
        }
        return priority_map.get(self.priority, self.priority)


class NewsComment(models.Model):
    """Commentaires sur les actualités"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]

    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='comments')
    author_name = models.CharField(max_length=100, verbose_name="Nom de l'auteur")
    author_email = models.EmailField(verbose_name="Email de l'auteur")
    content = models.TextField(verbose_name="Commentaire")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Commentaire"
        verbose_name_plural = "Commentaires"
        ordering = ['-created_at']

    def __str__(self):
        return f"Commentaire de {self.author_name} sur {self.news.title_fr}"


class NewsTag(models.Model):
    """Tags pour les actualités"""
    name_fr = models.CharField(max_length=50, unique=True, verbose_name="Nom (Français)")
    name_ar = models.CharField(max_length=50, verbose_name="Nom (Arabe)")
    slug = models.SlugField(max_length=60, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ['name_fr']

    def __str__(self):
        return self.name_fr

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_fr)
        super().save(*args, **kwargs)


class NewsTagRelation(models.Model):
    """Relation many-to-many entre News et Tags"""
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='news_tags')
    tag = models.ForeignKey(NewsTag, on_delete=models.CASCADE, related_name='tagged_news')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['news', 'tag']
        verbose_name = "Tag d'actualité"
        verbose_name_plural = "Tags d'actualités"

    def __str__(self):
        return f"{self.news.title_fr} - {self.tag.name_fr}"


class Newsletter(models.Model):
    """Abonnements à la newsletter"""
    email = models.EmailField(unique=True, verbose_name="Email")
    name = models.CharField(max_length=100, blank=True, verbose_name="Nom")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    subscribed_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'abonnement")
    unsubscribed_at = models.DateTimeField(blank=True, null=True, verbose_name="Date de désabonnement")

    class Meta:
        verbose_name = "Abonnement newsletter"
        verbose_name_plural = "Abonnements newsletter"
        ordering = ['-subscribed_at']

    def __str__(self):
        return f"{self.email} ({'Actif' if self.is_active else 'Inactif'})"


class AlumniSuccess(models.Model):
    """Succès des anciens diplômés"""
    title_fr = models.CharField(max_length=200, verbose_name="Titre (Français)")
    title_ar = models.CharField(max_length=200, verbose_name="Titre (Arabe)")
    slug = models.SlugField(max_length=250, unique=True)

    year = models.PositiveIntegerField(verbose_name="Année", help_text="Année du succès")

    summary_fr = models.TextField(max_length=500, verbose_name="Résumé (Français)")
    summary_ar = models.TextField(max_length=500, verbose_name="Résumé (Arabe)")
    content_fr = models.TextField(verbose_name="Contenu (Français)")
    content_ar = models.TextField(verbose_name="Contenu (Arabe)")

    featured_image = models.ImageField(upload_to='alumni/images/', blank=True, null=True, verbose_name="Image")
    image_alt_fr = models.CharField(max_length=200, blank=True, verbose_name="Texte alternatif image (Français)")
    image_alt_ar = models.CharField(max_length=200, blank=True, verbose_name="Texte alternatif image (Arabe)")

    featured = models.BooleanField(default=False, verbose_name="Mis en avant")
    published_at = models.DateTimeField(blank=True, null=True, verbose_name="Date de publication")

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='alumni_successes', verbose_name="Auteur")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Succès d'ancien"
        verbose_name_plural = "Succès des anciens"
        ordering = ['-year', '-published_at']

    def __str__(self):
        return self.title_fr

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title_fr)
        super().save(*args, **kwargs)


class AlumniPhoto(models.Model):
    """Photos supplémentaires liées à un succès d'ancien"""
    # maximum photos allowed per AlumniSuccess
    MAX_PER_ALUMNI = 10

    alumni = models.ForeignKey(AlumniSuccess, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='alumni/photos/', verbose_name="Photo")
    caption_fr = models.CharField(max_length=200, blank=True, verbose_name="Légende (Français)")
    caption_ar = models.CharField(max_length=200, blank=True, verbose_name="العنوان (العربية)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Photo d'ancien"
        verbose_name_plural = "Photos des anciens"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.alumni.title_fr} - {self.id}"

    def clean(self):
        # Prevent adding more photos than allowed
        from django.core.exceptions import ValidationError
        if not self.pk and self.alumni.photos.count() >= self.MAX_PER_ALUMNI:
            raise ValidationError({'non_field_errors': [f'Maximum {self.MAX_PER_ALUMNI} photos are allowed for an alumni success.']})

    def save(self, *args, **kwargs):
        # Run model validation on save to ensure limit enforcement in all creation paths
        self.full_clean()
        super().save(*args, **kwargs)
