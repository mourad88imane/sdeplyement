from django.db import models
from django.utils.translation import gettext_lazy as _

class AlumniSuccess(models.Model):
    name_fr = models.CharField(max_length=100, verbose_name=_('Nom (FR)'))
    name_ar = models.CharField(max_length=100, verbose_name=_('الاسم (AR)'))
    name_en = models.CharField(max_length=100, verbose_name=_('Name (EN)'))
    title_fr = models.CharField(max_length=200, verbose_name=_('Titre (FR)'))
    title_ar = models.CharField(max_length=200, verbose_name=_('اللقب (AR)'))
    title_en = models.CharField(max_length=200, verbose_name=_('Title (EN)'))
    story_fr = models.TextField(verbose_name=_('Parcours / Succès (FR)'))
    story_ar = models.TextField(verbose_name=_('قصة النجاح (AR)'))
    story_en = models.TextField(verbose_name=_('Success Story (EN)'))
    photo = models.ImageField(upload_to='alumni/photos/', blank=True, null=True, verbose_name=_('Photo'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name_fr or self.name_en or self.name_ar

class AlumniPhoto(models.Model):
    alumni = models.ForeignKey('AlumniSuccess', on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to='alumni/gallery/')
    legend_fr = models.CharField(max_length=200, blank=True, null=True)
    legend_ar = models.CharField(max_length=200, blank=True, null=True)
    legend_en = models.CharField(max_length=200, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.legend_fr or self.legend_en or str(self.image)
