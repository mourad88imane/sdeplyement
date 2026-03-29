from django.db import models
from django.conf import settings
from django.utils.text import slugify


class MuseumEquipmentCategory(models.Model):
    """Catégories d'équipements du musée"""
    name_fr = models.CharField(max_length=100, verbose_name="Nom (Français)")
    name_ar = models.CharField(max_length=100, verbose_name="Nom (Arabe)")
    description_fr = models.TextField(blank=True, verbose_name="Description (Français)")
    description_ar = models.TextField(blank=True, verbose_name="Description (Arabe)")
    color = models.CharField(max_length=7, default='#3B82F6', help_text="Couleur hexadécimale")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Catégorie d'équipement"
        verbose_name_plural = "Catégories d'équipements"
        ordering = ['name_fr']

    def __str__(self):
        return self.name_fr


class MuseumEquipment(models.Model):
    """Modèle pour les équipements du musée"""
    CONDITION_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Bon état'),
        ('fair', 'État moyen'),
        ('poor', 'Mauvais état'),
        ('restoring', 'En restauration'),
    ]

    STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('on_display', 'En exposition'),
        ('on_loan', 'En prêt'),
        ('stored', 'En stockage'),
    ]

    # Informations de base
    name_fr = models.CharField(max_length=200, verbose_name="Nom (Français)")
    name_ar = models.CharField(max_length=200, verbose_name="Nom (Arabe)")
    slug = models.SlugField(max_length=250, unique=True)

    # Description
    description_fr = models.TextField(verbose_name="Description (Français)")
    description_ar = models.TextField(verbose_name="Description (Arabe)")
    historical_context_fr = models.TextField(blank=True, verbose_name="Contexte historique (Français)")
    historical_context_ar = models.TextField(blank=True, verbose_name="Contexte historique (Arabe)")

    # Catégorisation
    category = models.ForeignKey(
        MuseumEquipmentCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Catégorie"
    )

    # État et statut
    condition = models.CharField(
        max_length=20, 
        choices=CONDITION_CHOICES, 
        default='good', 
        verbose_name="État de conservation"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='available', 
        verbose_name="Statut"
    )

    # Informations détaillées
    inventory_number = models.CharField(
        max_length=50, 
        unique=True, 
        verbose_name="Numéro d'inventaire"
    )
    acquisition_date = models.DateField(
        blank=True, 
        null=True, 
        verbose_name="Date d'acquisition"
    )
    acquisition_method = models.CharField(
        max_length=100, 
        blank=True, 
        verbose_name="Mode d'acquisition"
    )
    origin = models.CharField(
        max_length=200, 
        blank=True, 
        verbose_name="Origine/Pays d'origine"
    )

    # Dimensions
    dimensions = models.CharField(
        max_length=100, 
        blank=True, 
        verbose_name="Dimensions"
    )
    weight = models.CharField(
        max_length=50, 
        blank=True, 
        verbose_name="Poids"
    )

    # Médias
    image = models.ImageField(
        upload_to='museum/equipment/', 
        blank=True, 
        null=True, 
        verbose_name="Image"
    )
    image_alt_fr = models.CharField(
        max_length=200, 
        blank=True, 
        verbose_name="Texte alternatif image (Français)"
    )
    image_alt_ar = models.CharField(
        max_length=200, 
        blank=True, 
        verbose_name="Texte alternatif image (Arabe)"
    )

    # Métadonnées
    featured = models.BooleanField(default=False, verbose_name="Mis en avant")
    featured_image = models.BooleanField(default=False, verbose_name="Image en héros")

    # Dates
    period = models.CharField(
        max_length=100, 
        blank=True, 
        verbose_name="Période"
    )
    production_date = models.CharField(
        max_length=100, 
        blank=True, 
        verbose_name="Date de production"
    )

    # Audit
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='museum_equipment',
        verbose_name="Créateur"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Équipement"
        verbose_name_plural = "Équipements"
        ordering = ['-created_at']

    def __str__(self):
        return self.name_fr

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_fr)
        super().save(*args, **kwargs)

    def get_condition_display_fr(self):
        condition_map = {
            'excellent': 'Excellent',
            'good': 'Bon état',
            'fair': 'État moyen',
            'poor': 'Mauvais état',
            'restoring': 'En restauration',
        }
        return condition_map.get(self.condition, self.condition)

    def get_condition_display_ar(self):
        condition_map = {
            'excellent': 'ممتاز',
            'good': 'حالة جيدة',
            'fair': 'حالة متوسطة',
            'poor': 'حالة سيئة',
            'restoring': 'قيد الترميم',
        }
        return condition_map.get(self.condition, self.condition)

    def get_status_display_fr(self):
        status_map = {
            'available': 'Disponible',
            'on_display': 'En exposition',
            'on_loan': 'En prêt',
            'stored': 'En stockage',
        }
        return status_map.get(self.status, self.status)

    def get_status_display_ar(self):
        status_map = {
            'available': 'متاح',
            'on_display': 'معروض',
            'on_loan': 'معار',
            'stored': 'مخزن',
        }
        return status_map.get(self.status, self.status)


class MuseumPersonality(models.Model):
    """Modèle pour les personnalités du musée"""
    ROLE_CHOICES = [
        ('scientist', 'Scientifique'),
        ('engineer', 'Ingénieur'),
        ('inventor', 'Inventeur'),
        ('researcher', 'Chercheur'),
        ('teacher', 'Enseignant'),
        ('director', 'Directeur'),
        ('military', 'Militaire'),
        ('politician', 'Homme politique'),
        ('artist', 'Artiste'),
        ('other', 'Autre'),
    ]

    # Informations de base
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(max_length=250, unique=True)
    full_name = models.CharField(max_length=200, blank=True, verbose_name="Nom complet")

    # Rôle/Domaine
    role = models.CharField(
        max_length=50, 
        choices=ROLE_CHOICES, 
        default='other', 
        verbose_name="Rôle"
    )
    role_custom_fr = models.CharField(
        max_length=100, 
        blank=True, 
        verbose_name="Rôle personnalisé (Français)"
    )
    role_custom_ar = models.CharField(
        max_length=100, 
        blank=True, 
        verbose_name="Rôle personnalisé (Arabe)"
    )

    # Biographie
    biography_fr = models.TextField(verbose_name="Biographie (Français)")
    biography_ar = models.TextField(verbose_name="Biographie (Arabe)")
    achievements_fr = models.TextField(
        blank=True, 
        verbose_name="Réalisations (Français)"
    )
    achievements_ar = models.TextField(
        blank=True, 
        verbose_name="Réalisations (Arabe)"
    )

    # Dates
    birth_date = models.DateField(blank=True, null=True, verbose_name="Date de naissance")
    death_date = models.DateField(blank=True, null=True, verbose_name="Date de décès")
    birth_place = models.CharField(max_length=200, blank=True, verbose_name="Lieu de naissance")
    death_place = models.CharField(max_length=200, blank=True, verbose_name="Lieu de décès")

    # Nationalité
    nationality = models.CharField(max_length=100, blank=True, verbose_name="Nationalité")

    # Médias
    photo = models.ImageField(
        upload_to='museum/personality/', 
        blank=True, 
        null=True, 
        verbose_name="Photo"
    )
    photo_alt_fr = models.CharField(
        max_length=200, 
        blank=True, 
        verbose_name="Texte alternatif photo (Français)"
    )
    photo_alt_ar = models.CharField(
        max_length=200, 
        blank=True, 
        verbose_name="Texte alternatif photo (Arabe)"
    )

    # Métadonnées
    featured = models.BooleanField(default=False, verbose_name="Mis en avant")

    # Équipements associés (many-to-many)
    equipment = models.ManyToManyField(
        MuseumEquipment, 
        blank=True, 
        related_name='personalities',
        verbose_name="Équipements associés"
    )

    # Audit
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='museum_personalities',
        verbose_name="Créateur"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Personnalité"
        verbose_name_plural = "Personnalités"
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.first_name}-{self.last_name}")
        if not self.full_name:
            self.full_name = f"{self.first_name} {self.last_name}"
        super().save(*args, **kwargs)

    def get_role_display_fr(self):
        if self.role_custom_fr:
            return self.role_custom_fr
        role_map = {
            'scientist': 'Scientifique',
            'engineer': 'Ingénieur',
            'inventor': 'Inventeur',
            'researcher': 'Chercheur',
            'teacher': 'Enseignant',
            'director': 'Directeur',
            'military': 'Militaire',
            'politician': 'Homme politique',
            'artist': 'Artiste',
            'other': 'Autre',
        }
        return role_map.get(self.role, self.role)

    def get_role_display_ar(self):
        if self.role_custom_ar:
            return self.role_custom_ar
        role_map = {
            'scientist': 'عالم',
            'engineer': 'مهندس',
            'inventor': 'مخترع',
            'researcher': 'باحث',
            'teacher': 'معلم',
            'director': 'مدير',
            'military': 'عسكري',
            'politician': 'رجل سياسة',
            'artist': 'فنان',
            'other': 'أخرى',
        }
        return role_map.get(self.role, self.role)
