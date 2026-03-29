from django.db import models
from django.utils.translation import gettext_lazy as _

class Banner(models.Model):
    text1_fr = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Texte 1 (français)'))
    text1_en = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Texte 1 (anglais)'))
    text1_ar = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Texte 1 (arabe)'))
    text2_fr = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Texte 2 (français)'))
    text2_en = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Texte 2 (anglais)'))
    text2_ar = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Texte 2 (arabe)'))
    text3_fr = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Texte 3 (français)'))
    text3_en = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Texte 3 (anglais)'))
    text3_ar = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Texte 3 (arabe)'))
    image_left = models.ImageField(upload_to='banner/', blank=True, null=True, verbose_name=_('Image gauche'))
    image_right = models.ImageField(upload_to='banner/', blank=True, null=True, verbose_name=_('Image droite'))
    is_active = models.BooleanField(default=True, verbose_name=_('Actif'))

    class Meta:
        verbose_name = _('Bandeau')
        verbose_name_plural = _('Bandeaux')

    def __str__(self):
        return self.text1_fr or "Bandeau"
