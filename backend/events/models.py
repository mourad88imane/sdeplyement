from django.db import models
from django.conf import settings
from django.utils import timezone
from django.urls import reverse


class EventCategory(models.Model):
    """Catégories d'événements"""
    name_fr = models.CharField(max_length=100, verbose_name="Nom (Français)")
    name_ar = models.CharField(max_length=100, verbose_name="Nom (Arabe)", blank=True)
    description_fr = models.TextField(verbose_name="Description (Français)", blank=True)
    description_ar = models.TextField(verbose_name="Description (Arabe)", blank=True)
    color = models.CharField(max_length=7, default="#007bff", verbose_name="Couleur")
    icon = models.CharField(max_length=50, default="fas fa-calendar", verbose_name="Icône")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Catégorie d'événement"
        verbose_name_plural = "Catégories d'événements"
        ordering = ['name_fr']

    def __str__(self):
        return self.name_fr


class Event(models.Model):
    """Événements de l'école"""

    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Faible'),
        ('normal', 'Normale'),
        ('high', 'Élevée'),
        ('urgent', 'Urgente'),
    ]

    title_fr = models.CharField(max_length=200, verbose_name="Titre (Français)")
    title_ar = models.CharField(max_length=200, verbose_name="Titre (Arabe)", blank=True)
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")

    description_fr = models.TextField(verbose_name="Description (Français)")
    description_ar = models.TextField(verbose_name="Description (Arabe)", blank=True)

    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE, verbose_name="Catégorie")

    # Dates et heures
    start_date = models.DateTimeField(verbose_name="Date de début")
    end_date = models.DateTimeField(verbose_name="Date de fin")
    registration_deadline = models.DateTimeField(verbose_name="Date limite d'inscription", null=True, blank=True)

    # Lieu
    location = models.CharField(max_length=200, verbose_name="Lieu")
    address = models.TextField(verbose_name="Adresse complète", blank=True)
    room = models.CharField(max_length=100, verbose_name="Salle", blank=True)

    # Capacité et inscription
    max_participants = models.PositiveIntegerField(verbose_name="Nombre maximum de participants", null=True, blank=True)
    registration_required = models.BooleanField(default=False, verbose_name="Inscription requise")
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Frais d'inscription")

    # Statut et priorité
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal', verbose_name="Priorité")

    # Médias
    image = models.ImageField(upload_to='events/images/', verbose_name="Image", blank=True, null=True)
    attachment = models.FileField(upload_to='events/attachments/', verbose_name="Pièce jointe", blank=True, null=True)

    # Métadonnées
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_events', verbose_name="Organisateur")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events', verbose_name="Créé par")

    # Visibilité
    is_featured = models.BooleanField(default=False, verbose_name="Mis en avant")
    is_public = models.BooleanField(default=True, verbose_name="Public")

    # Statistiques
    views_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de vues")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Événement"
        verbose_name_plural = "Événements"
        ordering = ['-start_date']

    def __str__(self):
        return self.title_fr

    def get_absolute_url(self):
        return reverse('event_detail', kwargs={'slug': self.slug})

    @property
    def is_upcoming(self):
        return self.start_date > timezone.now()

    @property
    def is_ongoing(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date

    @property
    def is_past(self):
        return self.end_date < timezone.now()

    @property
    def registration_open(self):
        if not self.registration_required:
            return False
        if self.registration_deadline:
            return timezone.now() < self.registration_deadline
        return self.is_upcoming

    @property
    def available_spots(self):
        if not self.max_participants:
            return None
        return self.max_participants - self.registrations.filter(status='confirmed').count()

    @property
    def is_full(self):
        if not self.max_participants:
            return False
        return self.available_spots <= 0

    def save(self, *args, **kwargs):
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class EventRegistration(models.Model):
    """Inscriptions aux événements"""

    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmée'),
        ('cancelled', 'Annulée'),
        ('attended', 'Présent'),
        ('absent', 'Absent'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations', verbose_name="Événement")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_registrations', verbose_name="Utilisateur")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")

    # Informations supplémentaires
    notes = models.TextField(verbose_name="Notes", blank=True)
    special_requirements = models.TextField(verbose_name="Besoins spéciaux", blank=True)

    # Paiement
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'En attente'),
        ('paid', 'Payé'),
        ('refunded', 'Remboursé'),
    ], default='pending', verbose_name="Statut du paiement")
    payment_date = models.DateTimeField(null=True, blank=True, verbose_name="Date de paiement")

    # Timestamps
    registered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Inscription à un événement"
        verbose_name_plural = "Inscriptions aux événements"
        unique_together = ['event', 'user']
        ordering = ['-registered_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.event.title_fr}"


class EventReminder(models.Model):
    """Rappels d'événements"""

    TYPE_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('notification', 'Notification'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reminders', verbose_name="Événement")
    reminder_type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name="Type de rappel")

    # Timing
    send_before_hours = models.PositiveIntegerField(verbose_name="Envoyer X heures avant")

    # Contenu
    subject = models.CharField(max_length=200, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")

    # Statut
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    sent_at = models.DateTimeField(null=True, blank=True, verbose_name="Envoyé le")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Rappel d'événement"
        verbose_name_plural = "Rappels d'événements"
        ordering = ['send_before_hours']

    def __str__(self):
        return f"Rappel {self.reminder_type} - {self.event.title_fr}"
