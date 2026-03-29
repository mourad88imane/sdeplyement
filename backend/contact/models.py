from django.db import models
from django.core.validators import EmailValidator


class ContactMessage(models.Model):
    """Model for storing contact form submissions from visitors."""
    
    name = models.CharField(max_length=200, verbose_name="Nom")
    email = models.EmailField(verbose_name="Email", validators=[EmailValidator()])
    subject = models.CharField(max_length=300, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'envoi")
    is_read = models.BooleanField(default=False, verbose_name="Lu")
    is_replied = models.BooleanField(default=False, verbose_name="Répondu")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
    
    def __str__(self):
        return f"{self.name} - {self.subject} ({self.created_at.strftime('%d/%m/%Y')})"
