"""
Service d'envoi d'emails avec templates et logging
"""
import logging
from typing import Dict, Any, Optional, List
from django.core.mail import EmailMultiAlternatives
from django.template import Template, Context
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import EmailTemplate, EmailLog

User = get_user_model()

logger = logging.getLogger(__name__)


class EmailService:
    """Service pour l'envoi d'emails avec templates"""
    
    @staticmethod
    def get_template(template_type: str) -> Optional[EmailTemplate]:
        """Récupérer un template d'email par type"""
        try:
            return EmailTemplate.objects.get(
                template_type=template_type,
                is_active=True
            )
        except EmailTemplate.DoesNotExist:
            logger.warning(f"Template email non trouvé: {template_type}")
            return None
    
    @staticmethod
    def render_template(template_content: str, context_data: Dict[str, Any]) -> str:
        """Rendre un template avec les données de contexte"""
        try:
            template = Template(template_content)
            context = Context(context_data)
            return template.render(context)
        except Exception as e:
            logger.error(f"Erreur lors du rendu du template: {e}")
            return template_content
    
    @staticmethod
    def get_default_context(user: Optional[User] = None) -> Dict[str, Any]:
        """Obtenir le contexte par défaut pour les templates"""
        context = {
            'site_name': getattr(settings, 'SITE_NAME', 'ENT École'),
            'site_url': getattr(settings, 'SITE_URL', 'http://localhost:8000'),
            'current_year': timezone.now().year,
            'support_email': getattr(settings, 'SUPPORT_EMAIL', 'support@ent-ecole.com'),
        }
        
        if user:
            context.update({
                'user_name': user.get_full_name() or user.username,
                'user_email': user.email,
                'user_first_name': user.first_name,
                'user_last_name': user.last_name,
                'user_username': user.username,
            })
        
        return context
    
    @classmethod
    def send_email(
        cls,
        template_type: str,
        recipient_email: str,
        context_data: Optional[Dict[str, Any]] = None,
        recipient_user: Optional[User] = None,
        custom_subject: Optional[str] = None,
        custom_html_content: Optional[str] = None,
        custom_text_content: Optional[str] = None
    ) -> bool:
        """
        Envoyer un email avec template
        
        Args:
            template_type: Type de template à utiliser
            recipient_email: Email du destinataire
            context_data: Données pour le rendu du template
            recipient_user: Utilisateur destinataire (optionnel)
            custom_subject: Sujet personnalisé (optionnel)
            custom_html_content: Contenu HTML personnalisé (optionnel)
            custom_text_content: Contenu texte personnalisé (optionnel)
        
        Returns:
            bool: True si l'email a été envoyé avec succès
        """
        
        # Créer le log d'email
        email_log = EmailLog.objects.create(
            recipient_email=recipient_email,
            recipient_user=recipient_user,
            status='pending'
        )
        
        try:
            # Récupérer le template si pas de contenu personnalisé
            template = None
            if not (custom_subject and custom_html_content):
                template = cls.get_template(template_type)
                if not template:
                    email_log.status = 'failed'
                    email_log.error_message = f"Template non trouvé: {template_type}"
                    email_log.save()
                    return False
                
                email_log.template = template
            
            # Préparer le contexte
            context = cls.get_default_context(recipient_user)
            if context_data:
                context.update(context_data)
            
            # Rendre le contenu
            if custom_subject:
                subject = custom_subject
            else:
                subject = cls.render_template(template.subject, context)
            
            if custom_html_content:
                html_content = custom_html_content
            else:
                html_content = cls.render_template(template.html_content, context)
            
            if custom_text_content:
                text_content = custom_text_content
            elif template and template.text_content:
                text_content = cls.render_template(template.text_content, context)
            else:
                # Générer du texte simple à partir du HTML
                import re
                text_content = re.sub('<[^<]+?>', '', html_content)
            
            # Mettre à jour le log avec le contenu
            email_log.subject = subject
            email_log.html_content = html_content
            email_log.text_content = text_content
            email_log.save()
            
            # Créer et envoyer l'email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ent-ecole.com'),
                to=[recipient_email]
            )
            
            if html_content:
                email.attach_alternative(html_content, "text/html")
            
            email.send()
            
            # Marquer comme envoyé
            email_log.status = 'sent'
            email_log.sent_at = timezone.now()
            email_log.save()
            
            logger.info(f"Email envoyé avec succès à {recipient_email}: {subject}")
            return True
            
        except Exception as e:
            # Marquer comme échoué
            email_log.status = 'failed'
            email_log.error_message = str(e)
            email_log.save()
            
            logger.error(f"Erreur lors de l'envoi d'email à {recipient_email}: {e}")
            return False
    
    @classmethod
    def send_bulk_email(
        cls,
        template_type: str,
        recipients: List[Dict[str, Any]],
        context_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, int]:
        """
        Envoyer un email en masse
        
        Args:
            template_type: Type de template à utiliser
            recipients: Liste de dictionnaires avec 'email' et optionnellement 'user' et 'context'
            context_data: Données de contexte communes
        
        Returns:
            Dict avec le nombre d'emails envoyés et échoués
        """
        results = {'sent': 0, 'failed': 0}
        
        for recipient_data in recipients:
            email = recipient_data.get('email')
            user = recipient_data.get('user')
            recipient_context = recipient_data.get('context', {})
            
            # Fusionner les contextes
            final_context = {}
            if context_data:
                final_context.update(context_data)
            final_context.update(recipient_context)
            
            success = cls.send_email(
                template_type=template_type,
                recipient_email=email,
                context_data=final_context,
                recipient_user=user
            )
            
            if success:
                results['sent'] += 1
            else:
                results['failed'] += 1
        
        logger.info(f"Envoi en masse terminé: {results['sent']} envoyés, {results['failed']} échoués")
        return results
    
    @classmethod
    def send_welcome_email(cls, user: User) -> bool:
        """Envoyer un email de bienvenue à un nouvel utilisateur"""
        return cls.send_email(
            template_type='welcome',
            recipient_email=user.email,
            recipient_user=user,
            context_data={
                'login_url': f"{getattr(settings, 'SITE_URL', 'http://localhost:8000')}/login/",
            }
        )
    
    @classmethod
    def send_course_enrollment_email(cls, user: User, course) -> bool:
        """Envoyer un email de confirmation d'inscription à un cours"""
        return cls.send_email(
            template_type='course_enrollment',
            recipient_email=user.email,
            recipient_user=user,
            context_data={
                'course_title': course.title_fr,
                'course_description': course.description_fr,
                'course_url': f"{getattr(settings, 'SITE_URL', 'http://localhost:8000')}/courses/{course.id}/",
            }
        )
    
    @classmethod
    def send_book_reservation_email(cls, user: User, book) -> bool:
        """Envoyer un email de confirmation de réservation de livre"""
        return cls.send_email(
            template_type='book_reservation',
            recipient_email=user.email,
            recipient_user=user,
            context_data={
                'book_title': book.title,
                'book_author': book.author,
                'library_url': f"{getattr(settings, 'SITE_URL', 'http://localhost:8000')}/library/",
            }
        )
    
    @classmethod
    def send_event_registration_email(cls, user: User, event) -> bool:
        """Envoyer un email de confirmation d'inscription à un événement"""
        return cls.send_email(
            template_type='event_registration',
            recipient_email=user.email,
            recipient_user=user,
            context_data={
                'event_title': event.title_fr,
                'event_description': event.description_fr,
                'event_date': event.start_date.strftime('%d/%m/%Y à %H:%M'),
                'event_location': event.location,
                'event_url': f"{getattr(settings, 'SITE_URL', 'http://localhost:8000')}/events/{event.slug}/",
            }
        )
    
    @classmethod
    def send_admin_notification_email(cls, admin_email: str, subject: str, message: str) -> bool:
        """Envoyer une notification à un administrateur"""
        return cls.send_email(
            template_type='admin_notification',
            recipient_email=admin_email,
            context_data={
                'notification_subject': subject,
                'notification_message': message,
                'admin_url': f"{getattr(settings, 'SITE_URL', 'http://localhost:8000')}/admin/",
            }
        )
