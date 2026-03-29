from django.db import models

class TeamMember(models.Model):
    name_fr = models.CharField("Nom (fr)", max_length=100)
    name_ar = models.CharField("Nom (ar)", max_length=100, blank=True, null=True)
    name_en = models.CharField("Nom (en)", max_length=100, blank=True, null=True)
    role_fr = models.CharField("Rôle (fr)", max_length=100)
    role_ar = models.CharField("Rôle (ar)", max_length=100, blank=True, null=True)
    role_en = models.CharField("Rôle (en)", max_length=100, blank=True, null=True)
    bio_fr = models.TextField("Bio (fr)", blank=True)
    bio_ar = models.TextField("Bio (ar)", blank=True, null=True)
    bio_en = models.TextField("Bio (en)", blank=True, null=True)
    photo = models.ImageField(upload_to='team_photos/', blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name_fr


class Director(models.Model):
    """Modèle pour le Directeur de l'école"""
    name_fr = models.CharField("Nom (fr)", max_length=100)
    name_ar = models.CharField("Nom (ar)", max_length=100, blank=True, null=True)
    name_en = models.CharField("Nom (en)", max_length=100, blank=True, null=True)
    
    # Message du directeur
    message_fr = models.TextField("Message (fr)", blank=True)
    message_ar = models.TextField("Message (ar)", blank=True, null=True)
    message_en = models.TextField("Message (en)", blank=True, null=True)
    
    # Période
    start_year = models.PositiveIntegerField("Année de début")
    end_year = models.PositiveIntegerField("Année de fin", blank=True, null=True)
    
    # Photo
    photo = models.ImageField(upload_to='directors/', blank=True, null=True)
    
    # Directeur actuel
    is_current = models.BooleanField("Directeur actuel", default=False)
    
    # Ordre d'affichage
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-is_current', '-start_year']
        verbose_name = "Directeur"
        verbose_name_plural = "Directeurs"

    def __str__(self):
        return self.name_fr
