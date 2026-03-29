from django.conf import settings
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserProfile(models.Model):
    """Profil utilisateur étendu"""
    USER_TYPE_CHOICES = [
        ('student', 'Étudiant'),
        ('teacher', 'Enseignant'),
        ('staff', 'Personnel'),
        ('admin', 'Administrateur'),
        ('visitor', 'Visiteur'),
    ]

    GENDER_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_profile_extended')

    # Informations personnelles
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='visitor')
    student_id = models.CharField(max_length=50, blank=True, unique=True, null=True, verbose_name="Numéro étudiant")
    employee_id = models.CharField(max_length=50, blank=True, unique=True, null=True, verbose_name="Numéro employé")

    # Informations de contact
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Le numéro de téléphone doit être au format: '+999999999'. Jusqu'à 15 chiffres autorisés."
    )
    phone = models.CharField(validators=[phone_regex], max_length=17, blank=True, verbose_name="Téléphone")
    address = models.TextField(blank=True, verbose_name="Adresse")
    city = models.CharField(max_length=100, blank=True, verbose_name="Ville")
    postal_code = models.CharField(max_length=10, blank=True, verbose_name="Code postal")
    country = models.CharField(max_length=100, default='Algérie', verbose_name="Pays")

    # Informations personnelles supplémentaires
    birth_date = models.DateField(blank=True, null=True, verbose_name="Date de naissance")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, verbose_name="Genre")
    nationality = models.CharField(max_length=100, blank=True, verbose_name="Nationalité")

    # Informations académiques/professionnelles
    department = models.CharField(max_length=100, blank=True, verbose_name="Département")
    specialization = models.CharField(max_length=100, blank=True, verbose_name="Spécialisation")
    academic_year = models.CharField(max_length=20, blank=True, verbose_name="Année académique")
    enrollment_date = models.DateField(blank=True, null=True, verbose_name="Date d'inscription")

    # Médias
    avatar = models.ImageField(upload_to='avatars/', blank=True, verbose_name="Photo de profil")

    # Préférences
    preferred_language = models.CharField(
        max_length=10,
        choices=[('fr', 'Français'), ('ar', 'Arabe'), ('en', 'Anglais')],
        default='fr',
        verbose_name="Langue préférée"
    )
    receive_notifications = models.BooleanField(default=True, verbose_name="Recevoir les notifications")
    receive_newsletter = models.BooleanField(default=False, verbose_name="Recevoir la newsletter")

    # Statut
    is_verified = models.BooleanField(default=False, verbose_name="Compte vérifié")
    is_active_student = models.BooleanField(default=True, verbose_name="Étudiant actif")

    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil utilisateur"
        verbose_name_plural = "Profils utilisateurs"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.get_user_type_display()})"

    @property
    def full_name(self):
        return self.user.get_full_name() or self.user.username

    @property
    def is_student(self):
        return self.user_type == 'student'

    @property
    def is_teacher(self):
        return self.user_type == 'teacher'

    @property
    def is_staff_member(self):
        return self.user_type in ['staff', 'admin']


class UserActivity(models.Model):
    """Activité des utilisateurs"""
    ACTION_CHOICES = [
        ('login', 'Connexion'),
        ('logout', 'Déconnexion'),
        ('view_course', 'Consultation cours'),
        ('enroll_course', 'Inscription cours'),
        ('view_news', 'Consultation actualité'),
        ('borrow_book', 'Emprunt livre'),
        ('download_book', 'Téléchargement livre'),
        ('add_review', 'Ajout avis'),
        ('profile_update', 'Mise à jour profil'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES, verbose_name="Action")
    description = models.TextField(blank=True, verbose_name="Description")
    ip_address = models.GenericIPAddressField(blank=True, null=True, verbose_name="Adresse IP")
    user_agent = models.TextField(blank=True, verbose_name="User Agent")

    # Références optionnelles
    content_type = models.CharField(max_length=50, blank=True, verbose_name="Type de contenu")
    object_id = models.PositiveIntegerField(blank=True, null=True, verbose_name="ID de l'objet")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Activité utilisateur"
        verbose_name_plural = "Activités utilisateurs"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.get_action_display()} - {self.created_at}"


class UserNotification(models.Model):
    """Notifications utilisateur"""
    NOTIFICATION_TYPES = [
        ('info', 'Information'),
        ('success', 'Succès'),
        ('warning', 'Avertissement'),
        ('error', 'Erreur'),
        ('course', 'Cours'),
        ('news', 'Actualité'),
        ('library', 'Bibliothèque'),
        ('system', 'Système'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200, verbose_name="Titre")
    message = models.TextField(verbose_name="Message")
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='info', verbose_name="Type")

    # Liens optionnels
    link_url = models.URLField(blank=True, verbose_name="Lien")
    link_text = models.CharField(max_length=100, blank=True, verbose_name="Texte du lien")

    # Statut
    is_read = models.BooleanField(default=False, verbose_name="Lu")
    is_important = models.BooleanField(default=False, verbose_name="Important")

    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(blank=True, null=True, verbose_name="Lu le")
    expires_at = models.DateTimeField(blank=True, null=True, verbose_name="Expire le")

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"

    def mark_as_read(self):
        from django.utils import timezone
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])


class UserSession(models.Model):
    """Sessions utilisateur"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField(verbose_name="Adresse IP")
    user_agent = models.TextField(verbose_name="User Agent")
    device_info = models.CharField(max_length=200, blank=True, verbose_name="Informations appareil")
    location = models.CharField(max_length=100, blank=True, verbose_name="Localisation")

    is_active = models.BooleanField(default=True, verbose_name="Session active")
    last_activity = models.DateTimeField(auto_now=True, verbose_name="Dernière activité")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Session utilisateur"
        verbose_name_plural = "Sessions utilisateurs"
        ordering = ['-last_activity']

    def __str__(self):
        return f"{self.user.username} - {self.ip_address} - {self.created_at}"


class AdminUserMessage(models.Model):
    """Messages entre administrateur et utilisateur"""
    MESSAGE_TYPES = [
        ('login_notification', 'Notification de connexion'),
        ('admin_response', 'Réponse administrateur'),
        ('user_message', 'Message utilisateur'),
        ('system_alert', 'Alerte système'),
    ]

    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('responded', 'Répondu'),
        ('closed', 'Fermé'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='admin_messages')
    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_admin_messages',
        verbose_name="Administrateur"
    )

    message_type = models.CharField(max_length=30, choices=MESSAGE_TYPES, default='user_message')
    subject = models.CharField(max_length=200, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    admin_response = models.TextField(blank=True, verbose_name="Réponse administrateur")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_urgent = models.BooleanField(default=False, verbose_name="Urgent")

    # Métadonnées de connexion (pour les notifications de login)
    login_ip = models.GenericIPAddressField(null=True, blank=True, verbose_name="IP de connexion")
    login_device = models.CharField(max_length=200, blank=True, verbose_name="Appareil de connexion")
    login_location = models.CharField(max_length=100, blank=True, verbose_name="Localisation")

    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True, verbose_name="Répondu le")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Message Administrateur-Utilisateur"
        verbose_name_plural = "Messages Administrateur-Utilisateur"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.subject} ({self.get_status_display()})"

    def respond(self, admin_user, response_message):
        """Répondre au message et créer une notification pour l'utilisateur"""
        from django.utils import timezone

        self.admin = admin_user
        self.admin_response = response_message
        self.status = 'responded'
        self.responded_at = timezone.now()
        self.save()

        # Créer une notification pour l'utilisateur
        UserNotification.objects.create(
            user=self.user,
            title=f"Réponse de l'administration: {self.subject}",
            message=response_message,
            notification_type='system',
            is_important=True,
            link_url=f"/profile/messages/{self.id}/",
            link_text="Voir le message"
        )


class EmailTemplate(models.Model):
    """Templates d'emails pour les notifications automatiques"""

    TYPE_CHOICES = [
        ('welcome', 'Email de bienvenue'),
        ('course_enrollment', 'Inscription à un cours'),
        ('book_reservation', 'Réservation de livre'),
        ('event_registration', 'Inscription à un événement'),
        ('event_reminder', 'Rappel d\'événement'),
        ('password_reset', 'Réinitialisation de mot de passe'),
        ('admin_notification', 'Notification admin'),
        ('custom', 'Personnalisé'),
    ]

    name = models.CharField(max_length=100, verbose_name="Nom du template")
    template_type = models.CharField(max_length=50, choices=TYPE_CHOICES, unique=True, verbose_name="Type")

    subject = models.CharField(max_length=200, verbose_name="Sujet")
    html_content = models.TextField(verbose_name="Contenu HTML")
    text_content = models.TextField(verbose_name="Contenu texte", blank=True)

    # Variables disponibles
    available_variables = models.TextField(
        verbose_name="Variables disponibles",
        help_text="Variables disponibles: {{user_name}}, {{user_email}}, {{site_name}}, etc.",
        blank=True
    )

    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Template d'email"
        verbose_name_plural = "Templates d'emails"
        ordering = ['name']

    def __str__(self):
        return self.name


class EmailLog(models.Model):
    """Log des emails envoyés"""

    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('sent', 'Envoyé'),
        ('failed', 'Échec'),
        ('bounced', 'Rejeté'),
    ]

    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Template")

    # Destinataire
    recipient_email = models.EmailField(verbose_name="Email destinataire")
    recipient_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Utilisateur destinataire")

    # Contenu
    subject = models.CharField(max_length=200, verbose_name="Sujet")
    html_content = models.TextField(verbose_name="Contenu HTML", blank=True)
    text_content = models.TextField(verbose_name="Contenu texte", blank=True)

    # Statut
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")
    error_message = models.TextField(verbose_name="Message d'erreur", blank=True)

    # Métadonnées
    sent_at = models.DateTimeField(null=True, blank=True, verbose_name="Envoyé le")
    created_at = models.DateTimeField(auto_now_add=True)

    # Tracking
    opened_at = models.DateTimeField(null=True, blank=True, verbose_name="Ouvert le")
    clicked_at = models.DateTimeField(null=True, blank=True, verbose_name="Cliqué le")

    class Meta:
        verbose_name = "Log d'email"
        verbose_name_plural = "Logs d'emails"
        ordering = ['-created_at']

    def __str__(self):
        return f"Email à {self.recipient_email} - {self.subject}"


class TeamMember(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='team_member_profile', help_text="Optionnel: lier à un utilisateur existant")
    full_name = models.CharField(max_length=200, verbose_name="Nom complet")
    role_fr = models.CharField(max_length=100, verbose_name="Rôle (Français)")
    role_ar = models.CharField(max_length=100, verbose_name="Rôle (Arabe)")
    description_fr = models.TextField(verbose_name="Description (Français)", blank=True)
    description_ar = models.TextField(verbose_name="Description (Arabe)", blank=True)
    photo = models.ImageField(upload_to='team/', verbose_name="Photo", blank=True, null=True)
    email = models.EmailField(verbose_name="Email", blank=True)
    phone = models.CharField(max_length=20, verbose_name="Téléphone", blank=True)
    linkedin = models.URLField(verbose_name="LinkedIn", blank=True)
    is_director = models.BooleanField(default=False, verbose_name="Est le Directeur")
    courses_taught = models.TextField(verbose_name="Cours enseignés", blank=True, help_text="Liste des cours (ex: Math, Physique)")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Membre de l'équipe"
        verbose_name_plural = "Membres de l'équipe"
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.full_name

