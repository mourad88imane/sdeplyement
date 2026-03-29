from django.db import models
from django.conf import settings
from django.utils.text import slugify


class CourseCategory(models.Model):
    """Catégories de cours"""
    name_fr = models.CharField(max_length=100, verbose_name="Nom (Français)")
    name_ar = models.CharField(max_length=100, verbose_name="Nom (Arabe)")
    description_fr = models.TextField(blank=True, verbose_name="Description (Français)")
    description_ar = models.TextField(blank=True, verbose_name="Description (Arabe)")
    icon = models.CharField(max_length=50, blank=True, help_text="Nom de l'icône (ex: network, cpu, radio)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Catégorie de cours"
        verbose_name_plural = "Catégories de cours"
        ordering = ['name_fr']

    def __str__(self):
        return self.name_fr


class Course(models.Model):
    """Modèle pour les cours OHB"""
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

    TYPE_CHOICES = [
        ('ohb', 'OHB'),
        ('school', 'École'),
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
    course_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='school', verbose_name="Type de cours")
    slug = models.SlugField(max_length=250, unique=True)

    # Descriptions
    description_fr = models.TextField(verbose_name="Description courte (Français)")
    description_ar = models.TextField(verbose_name="Description courte (Arabe)")
    content_fr = models.TextField(verbose_name="Contenu détaillé (Français)")
    content_ar = models.TextField(verbose_name="Contenu détaillé (Arabe)")

    # Métadonnées du cours
    category = models.ForeignKey(CourseCategory, on_delete=models.CASCADE, verbose_name="Catégorie")
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, verbose_name="Niveau")
    duration_weeks = models.PositiveIntegerField(verbose_name="Durée (semaines)")
    duration_hours = models.PositiveIntegerField(verbose_name="Durée (heures)", blank=True, null=True)
    max_students = models.PositiveIntegerField(verbose_name="Nombre max d'étudiants", default=30)

    # Médias
    image = models.ImageField(upload_to='courses/images/', verbose_name="Image du cours")
    video_url = models.URLField(blank=True, verbose_name="URL de la vidéo de présentation")
    pdf_file = models.FileField(upload_to='courses/pdfs/', blank=True, verbose_name="Fichier PDF du cours")
    brochure_pdf = models.FileField(upload_to='courses/brochures/', blank=True, verbose_name="Brochure PDF du cours")

    # Prérequis et objectifs
    prerequisites_fr = models.TextField(blank=True, verbose_name="Prérequis (Français)")
    prerequisites_ar = models.TextField(blank=True, verbose_name="Prérequis (Arabe)")
    objectives_fr = models.TextField(blank=True, verbose_name="Objectifs (Français)")
    objectives_ar = models.TextField(blank=True, verbose_name="Objectifs (Arabe)")

    # Prix et inscription
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix")
    is_free = models.BooleanField(default=True, verbose_name="Gratuit")
    registration_open = models.BooleanField(default=True, verbose_name="Inscription ouverte")
    registration_deadline = models.DateTimeField(blank=True, null=True, verbose_name="Date limite d'inscription")

    # Dates
    start_date = models.DateTimeField(blank=True, null=True, verbose_name="Date de début")
    end_date = models.DateTimeField(blank=True, null=True, verbose_name="Date de fin")

    # Statut et métadonnées
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")
    featured = models.BooleanField(default=False, verbose_name="Cours mis en avant")
    views_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de vues")

    # Grade cible / public cible
    grade = models.CharField(max_length=50, choices=GRADE_CHOICES, blank=True, null=True, verbose_name="Grade cible")

    # Audit
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_courses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Cours OHB"
        verbose_name_plural = "Cours OHB"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        from django.utils.text import slugify
        from django.utils import timezone
        
        # If slug is empty or not unique (excluding current instance), generate a unique slug
        if not self.slug or Course.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
            if self.title_fr:
                slug_base = slugify(self.title_fr)
                if slug_base:
                    self.slug = slug_base
                else:
                    # Generate a slug based on current time if title is empty or slugify fails
                    self.slug = f"course-{timezone.now().strftime('%Y%m%d%H%M%S%f')}"
            else:
                # Generate a slug based on current time if title is empty
                self.slug = f"course-{timezone.now().strftime('%Y%m%d%H%M%S%f')}"
            
            # Ensure the slug is unique by appending a number if necessary
            original_slug = self.slug
            counter = 1
            while Course.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title_fr

    def get_level_display_fr(self):
        level_map = {
            'beginner': 'Débutant',
            'intermediate': 'Intermédiaire',
            'advanced': 'Avancé',
            'expert': 'Expert',
        }
        return level_map.get(self.level, self.level)

    def get_level_display_ar(self):
        level_map = {
            'beginner': 'مبتدئ',
            'intermediate': 'متوسط',
            'advanced': 'متقدم',
            'expert': 'خبير',
        }
        return level_map.get(self.level, self.level)


class CourseModule(models.Model):
    """Modules d'un cours"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title_fr = models.CharField(max_length=200, verbose_name="Titre (Français)")
    title_ar = models.CharField(max_length=200, verbose_name="Titre (Arabe)")
    description_fr = models.TextField(blank=True, verbose_name="Description (Français)")
    description_ar = models.TextField(blank=True, verbose_name="Description (Arabe)")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")
    duration_hours = models.PositiveIntegerField(verbose_name="Durée (heures)")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Module de cours"
        verbose_name_plural = "Modules de cours"
        ordering = ['course', 'order']

    def __str__(self):
        return f"{self.course.title_fr} - {self.title_fr}"


class CourseInstructor(models.Model):
    """Instructeurs des cours"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='instructors')
    name = models.CharField(max_length=100, verbose_name="Nom complet")
    title_fr = models.CharField(max_length=100, verbose_name="Titre/Poste (Français)")
    title_ar = models.CharField(max_length=100, verbose_name="Titre/Poste (Arabe)")
    bio_fr = models.TextField(blank=True, verbose_name="Biographie (Français)")
    bio_ar = models.TextField(blank=True, verbose_name="Biographie (Arabe)")
    photo = models.ImageField(upload_to='instructors/', blank=True, verbose_name="Photo")
    email = models.EmailField(blank=True, verbose_name="Email")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Instructeur"
        verbose_name_plural = "Instructeurs"

    def __str__(self):
        return self.name


class CourseEnrollment(models.Model):
    """Inscriptions aux cours"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
        ('completed', 'Terminé'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    student_name = models.CharField(max_length=100, verbose_name="Nom de l'étudiant")
    student_email = models.EmailField(verbose_name="Email de l'étudiant")
    student_phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    motivation = models.TextField(blank=True, verbose_name="Lettre de motivation")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")

    enrolled_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'inscription")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Inscription"
        verbose_name_plural = "Inscriptions"
        unique_together = ['course', 'student_email']
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.student_name} - {self.course.title_fr}"
