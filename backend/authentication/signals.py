from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out
from .models import User, UserProfile
import logging

logger = logging.getLogger(__name__)




@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Crée ou met à jour le profil utilisateur automatiquement
    """
    # Skip during loaddata/fixtures to avoid duplicate key errors
    if kwargs.get('raw', False):
        return

    if created:
        UserProfile.objects.get_or_create(user=instance)
        logger.info(f"Profil créé pour l'utilisateur: {instance.username}")
    else:
        if not hasattr(instance, 'profile'):
            UserProfile.objects.get_or_create(user=instance)
            logger.info(f"Profil créé pour l'utilisateur existant: {instance.username}")


@receiver(pre_delete, sender=User)
def delete_user_avatar(sender, instance, **kwargs):
    """
    Supprime l'avatar de l'utilisateur avant de supprimer l'utilisateur
    """
    try:
        if hasattr(instance, 'profile') and instance.profile.avatar:
            instance.profile.delete_avatar()
            logger.info(f"Avatar supprimé pour l'utilisateur: {instance.username}")
    except Exception as e:
        logger.error(f"Erreur lors de la suppression de l'avatar pour {instance.username}: {str(e)}")


@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    """
    Log les connexions utilisateur
    """
    logger.info(f"Utilisateur connecté: {user.username} depuis {request.META.get('REMOTE_ADDR', 'IP inconnue')}")


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    """
    Log les déconnexions utilisateur
    """
    if user:
        logger.info(f"Utilisateur déconnecté: {user.username}")
    else:
        logger.info("Déconnexion d'un utilisateur anonyme")
