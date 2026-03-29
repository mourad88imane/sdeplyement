from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Review(models.Model):
    VISITOR = 'visitor'
    STUDENT = 'student'
    SPONSOR = 'sponsor'
    REVIEWER_TYPE_CHOICES = [
        (VISITOR, _('Visiteur / زائر')),
        (STUDENT, _('Étudiant / طالب')),
        (SPONSOR, _('Sponsor / راعي')),
    ]
    reviewer_name_fr = models.CharField(max_length=100, verbose_name=_('Nom du rédacteur (FR)'), blank=True, null=True)
    reviewer_name_ar = models.CharField(max_length=100, verbose_name=_('اسم المراجع (AR)'), blank=True, null=True)
    reviewer_name_en = models.CharField(max_length=100, verbose_name=_('Reviewer Name (EN)'), blank=True, null=True)
    content_fr = models.TextField(verbose_name=_('Contenu (FR)'), blank=True, null=True)
    content_ar = models.TextField(verbose_name=_('المحتوى (AR)'), blank=True, null=True)
    content_en = models.TextField(verbose_name=_('Content (EN)'), blank=True, null=True)
    rating = models.PositiveSmallIntegerField(default=5, verbose_name=_('Note / تقييم'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le / أنشئ في'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Mis à jour le / تم التحديث في'))
    photo = models.ImageField(upload_to='reviews/photos/', blank=True, null=True, verbose_name=_('Photo'))
    reviewer_type = models.CharField(max_length=20, choices=REVIEWER_TYPE_CHOICES, verbose_name=_('Type de rédacteur / نوع المراجع'))

    def __str__(self):
        return f"{self.reviewer_name_fr} ({self.get_reviewer_type_display()})"
