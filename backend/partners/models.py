from django.db import models
from django.utils.translation import gettext_lazy as _

class Partnership(models.Model):
    name = models.CharField(_("Nom du partenaire"), max_length=255)
    logo = models.ImageField(_("Logo"), upload_to="partners/")
    website = models.URLField(_("Site web"), blank=True, null=True)
    description = models.TextField(_("Description"), blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Partenariat")
        verbose_name_plural = _("Partenariats")
        ordering = ['-created_at']

    def __str__(self):
        return self.name
