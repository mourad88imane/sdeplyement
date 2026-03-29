from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from PIL import Image
import os


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé étendant AbstractUser
    """
    email = models.EmailField(
        _('email address'),
        unique=True,
        help_text=_('Required. Enter a valid email address.')
    )
    first_name = models.CharField(
        _('first name'),
        max_length=150,
        help_text=_('Required. 150 characters or fewer.')
    )
    last_name = models.CharField(
        _('last name'),
        max_length=150,
        help_text=_('Required. 150 characters or fewer.')
    )
    is_verified = models.BooleanField(
        _('verified'),
        default=False,
        help_text=_('Designates whether this user has verified their email address.')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Permettre la connexion avec email ou username
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        db_table = 'auth_user'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"

    @property
    def full_name(self):
        """Retourne le nom complet de l'utilisateur"""
        return f"{self.first_name} {self.last_name}".strip()

    def save(self, *args, **kwargs):
        # Normaliser l'email en minuscules
        if self.email:
            self.email = self.email.lower()
        super().save(*args, **kwargs)


class UserProfile(models.Model):
    """
    Profil utilisateur avec informations supplémentaires
    """
    GENDER_CHOICES = [
        ('M', _('Male')),
        ('F', _('Female')),
        ('O', _('Other')),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name=_('User')
    )
    phone = models.CharField(
        _('phone number'),
        max_length=20,
        blank=True,
        null=True,
        help_text=_('Phone number with country code (e.g., +213 123 456 789)')
    )
    address = models.TextField(
        _('address'),
        blank=True,
        null=True,
        help_text=_('Complete address')
    )
    birth_date = models.DateField(
        _('birth date'),
        blank=True,
        null=True
    )
    gender = models.CharField(
        _('gender'),
        max_length=1,
        choices=GENDER_CHOICES,
        blank=True,
        null=True
    )
    bio = models.TextField(
        _('biography'),
        max_length=500,
        blank=True,
        null=True,
        help_text=_('Brief description about yourself')
    )
    avatar = models.ImageField(
        _('avatar'),
        upload_to='avatars/%Y/%m/',
        blank=True,
        null=True,
        help_text=_('Profile picture')
    )
    website = models.URLField(
        _('website'),
        blank=True,
        null=True,
        help_text=_('Personal website or social media profile')
    )
    occupation = models.CharField(
        _('occupation'),
        max_length=100,
        blank=True,
        null=True
    )
    organization = models.CharField(
        _('organization'),
        max_length=100,
        blank=True,
        null=True,
        help_text=_('Company, school, or organization')
    )
    student_id = models.CharField(
        _('student ID'),
        max_length=50,
        blank=True,
        null=True,
        help_text=_('Student identification number')
    )
    employee_id = models.CharField(
        _('employee ID'),
        max_length=50,
        blank=True,
        null=True,
        help_text=_('Employee identification number')
    )

    # Préférences
    language_preference = models.CharField(
        _('language preference'),
        max_length=10,
        choices=[
            ('fr', _('French')),
            ('ar', _('Arabic')),
            ('en', _('English')),
        ],
        default='fr'
    )
    timezone = models.CharField(
        _('timezone'),
        max_length=50,
        default='Africa/Algiers'
    )
    receive_notifications = models.BooleanField(
        _('receive notifications'),
        default=True,
        help_text=_('Receive email notifications about library activities')
    )
    receive_newsletter = models.BooleanField(
        _('receive newsletter'),
        default=False,
        help_text=_('Receive newsletter and updates')
    )

    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('User Profile')
        verbose_name_plural = _('User Profiles')
        db_table = 'user_profiles'

    def __str__(self):
        return f"Profile of {self.user.full_name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Redimensionner l'avatar si nécessaire
        if self.avatar:
            self.resize_avatar()

    def resize_avatar(self):
        """Redimensionne l'avatar à une taille maximale de 300x300"""
        try:
            img = Image.open(self.avatar.path)
            if img.height > 300 or img.width > 300:
                output_size = (300, 300)
                img.thumbnail(output_size, Image.Resampling.LANCZOS)
                img.save(self.avatar.path, quality=85, optimize=True)
        except Exception as e:
            print(f"Erreur lors du redimensionnement de l'avatar: {e}")

    @property
    def age(self):
        """Calcule l'âge de l'utilisateur"""
        if self.birth_date:
            from datetime import date
            today = date.today()
            return today.year - self.birth_date.year - (
                (today.month, today.day) < (self.birth_date.month, self.birth_date.day)
            )
        return None

    def delete_avatar(self):
        """Supprime le fichier avatar du système de fichiers"""
        if self.avatar:
            if os.path.isfile(self.avatar.path):
                os.remove(self.avatar.path)


# Les signaux sont définis dans signals.py
