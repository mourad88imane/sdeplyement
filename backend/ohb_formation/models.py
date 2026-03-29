from django.db import models
from django.conf import settings
from django.utils.text import slugify


class FormationCategory(models.Model):
    """Catégories de formations OHB"""
    name_fr = models.CharField(max_length=100, verbose_name="Nom (Français)")
    name_ar = models.CharField(max_length=100, verbose_name="Nom (Arabe)")
    description_fr = models.TextField(blank=True, verbose_name="Description (Français)")
    description_ar = models.TextField(blank=True, verbose_name="Description (Arabe)")
    icon = models.CharField(max_length=50, blank=True, help_text="Nom de l'icône (ex: network, cpu, radio)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Catégorie de formation"
        verbose_name_plural = "Catégories de formations"
        ordering = ['name_fr']

    def __str__(self):
        return self.name_fr


class Formation(models.Model):
    """Modèle pour les formations OHB - Séparé des cours de l'école"""
    
    LEVEL_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
        ('expert', 'Expert'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('archived', 'Archivé'),
    ]

    GRADE_CHOICES = [
        ('inspecteur_technique_specialise', 'Inspecteur technique spécialisé'),
        ('assistant_technique_specialise', 'Assistant technique spécialisé'),
        ('agent_exploitation', "Agent d'exploitation"),
    ]

    # Informations de base
    title_fr = models.CharField(max_length=200, verbose_name="Titre (Français)")
    title_ar = models.CharField(max_length=200, verbose_name="Titre (Arabe)")
    label = models.CharField(max_length=50, blank=True, verbose_name="Label (ex: Bootcamp, Introduction)")
    slug = models.SlugField(max_length=250, unique=True)

    # Descriptions
    description_fr = models.TextField(verbose_name="Description courte (Français)")
    description_ar = models.TextField(verbose_name="Description courte (Arabe)")
    content_fr = models.TextField(blank=True, verbose_name="Contenu complet (Français)")
    content_ar = models.TextField(blank=True, verbose_name="Contenu complet (Arabe)")

    # Objectifs et prérequis
    objectives_fr = models.TextField(blank=True, verbose_name="Objectifs (Français)")
    objectives_ar = models.TextField(blank=True, verbose_name="Objectifs (Arabe)")
    prerequisites_fr = models.TextField(blank=True, verbose_name="Prérequis (Français)")
    prerequisites_ar = models.TextField(blank=True, verbose_name="Prérequis (Arabe)")
    target_audience_fr = models.TextField(blank=True, verbose_name="Public cible (Français)")
    target_audience_ar = models.TextField(blank=True, verbose_name="Public cible (Arabe)")

    # Lieu et organisation
    location_fr = models.CharField(max_length=200, blank=True, verbose_name="Lieu (Français)")
    location_ar = models.CharField(max_length=200, blank=True, verbose_name="Lieu (Arabe)")
    teaching_methods_fr = models.TextField(blank=True, verbose_name="Méthodes pédagogiques (Français)")
    teaching_methods_ar = models.TextField(blank=True, verbose_name="Méthodes pédagogiques (Arabe)")
    daily_organization_fr = models.TextField(blank=True, verbose_name="Organisation journalière (Français)")
    daily_organization_ar = models.TextField(blank=True, verbose_name="Organisation journalière (Arabe)")
    daily_program_fr = models.TextField(blank=True, verbose_name="Programme par jour (Français)")
    daily_program_ar = models.TextField(blank=True, verbose_name="Programme par jour (Arabe)")

    # Catégorisation
    category = models.ForeignKey(
        FormationCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='formations',
        verbose_name="Catégorie"
    )

    # Niveau et durée
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner', verbose_name="Niveau")
    duration_weeks = models.PositiveIntegerField(default=1, verbose_name="Durée (semaines)")
    duration_hours = models.PositiveIntegerField(blank=True, null=True, verbose_name="Durée (heures)")
    max_students = models.PositiveIntegerField(default=20, verbose_name="Nombre maximum d'étudiants")

    # Médias
    image = models.ImageField(upload_to='ohb_formations/images/', blank=True, null=True, verbose_name="Image")
    pdf_file = models.FileField(upload_to='ohb_formations/pdfs/', blank=True, null=True, verbose_name="PDF du cours")
    brochure_pdf = models.FileField(upload_to='ohb_formations/brochures/', blank=True, null=True, verbose_name="Brochure PDF")

    # Inscription
    is_free = models.BooleanField(default=False, verbose_name="Gratuit")
    registration_open = models.BooleanField(default=True, verbose_name="Inscription ouverte")
    start_date = models.DateField(blank=True, null=True, verbose_name="Date de début")
    end_date = models.DateField(blank=True, null=True, verbose_name="Date de fin")

    # Statut et mise en avant
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")
    featured = models.BooleanField(default=False, verbose_name="Mis en avant")

    # Métadonnées
    views_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de vues")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ohb_formations',
        verbose_name="Créé par"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Formation OHB"
        verbose_name_plural = "Formations OHB"

    def __str__(self):
        return self.title_fr

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title_fr)
            # Ensure unique slug
            original_slug = self.slug
            counter = 1
            while Formation.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)


class FormationEnrollment(models.Model):
    """Inscriptions aux formations OHB"""
    formation = models.ForeignKey(Formation, on_delete=models.CASCADE, related_name='enrollments')
    student_name = models.CharField(max_length=200, verbose_name="Nom de l'étudiant")
    student_email = models.EmailField(verbose_name="Email de l'étudiant")
    student_phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    notes = models.TextField(blank=True, verbose_name="Notes")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'En attente'),
            ('confirmed', 'Confirmé'),
            ('cancelled', 'Annulé'),
        ],
        default='pending',
        verbose_name="Statut"
    )

    class Meta:
        ordering = ['-enrolled_at']
        verbose_name = "Inscription formation"
        verbose_name_plural = "Inscriptions formations"

    def __str__(self):
        return f"{self.student_name} - {self.formation.title_fr}"
