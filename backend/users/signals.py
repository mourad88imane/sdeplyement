from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()
from .models import UserProfile, UserActivity, UserNotification, AdminUserMessage


@receiver(user_logged_in)
def user_login_handler(sender, request, user, **kwargs):
    """Signal déclenché lors de la connexion d'un utilisateur"""
    
    # Obtenir l'adresse IP
    def get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    # Obtenir les informations de l'appareil
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    ip_address = get_client_ip(request)
    
    # Déterminer le type d'appareil
    device_info = "Ordinateur"
    if 'Mobile' in user_agent:
        device_info = "Mobile"
    elif 'Tablet' in user_agent:
        device_info = "Tablette"
    
    # Enregistrer l'activité de connexion
    UserActivity.objects.create(
        user=user,
        action='login',
        description=f"Connexion depuis {device_info}",
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    # Créer une notification de connexion pour les administrateurs
    admin_users = User.objects.filter(is_staff=True, is_active=True)
    
    # Obtenir le nom complet ou username
    user_display_name = user.get_full_name() or user.username
    
    # Créer un message pour les administrateurs
    login_message = AdminUserMessage.objects.create(
        user=user,
        message_type='login_notification',
        subject=f"Nouvelle connexion: {user_display_name}",
        message=f"""
Nouvel utilisateur connecté:

👤 Utilisateur: {user_display_name} ({user.username})
📧 Email: {user.email}
🌐 Adresse IP: {ip_address}
📱 Appareil: {device_info}
🕒 Heure: {timezone.now().strftime('%d/%m/%Y à %H:%M')}

Type d'utilisateur: {getattr(user, 'user_profile_extended', None) and user.user_profile_extended.get_user_type_display() or 'Non défini'}
        """.strip(),
        login_ip=ip_address,
        login_device=device_info,
        status='pending'
    )
    
    # Créer des notifications pour tous les administrateurs
    for admin in admin_users:
        UserNotification.objects.create(
            user=admin,
            title=f"🔔 Nouvelle connexion: {user_display_name}",
            message=f"L'utilisateur {user_display_name} vient de se connecter depuis {device_info} (IP: {ip_address})",
            notification_type='system',
            is_important=False,
            link_url=f"/admin/users/adminusermessage/{login_message.id}/change/",
            link_text="Voir les détails et répondre"
        )
    
    # Créer une notification de bienvenue pour l'utilisateur (si c'est sa première connexion)
    if user.last_login is None or (timezone.now() - user.date_joined).days < 1:
        UserNotification.objects.create(
            user=user,
            title="🎉 Bienvenue sur l'ENT !",
            message="""
Bienvenue sur la plateforme de l'École Nationale des Transmissions !

Vous pouvez maintenant:
• Consulter les cours et formations
• Accéder à la bibliothèque numérique  
• Suivre les actualités de l'école
• Gérer votre profil

Si vous avez des questions, n'hésitez pas à contacter l'administration.
            """.strip(),
            notification_type='success',
            is_important=True,
            link_url="/profile/",
            link_text="Compléter mon profil"
        )


@receiver(user_logged_out)
def user_logout_handler(sender, request, user, **kwargs):
    """Signal déclenché lors de la déconnexion d'un utilisateur"""
    if user:
        # Obtenir l'adresse IP
        def get_client_ip(request):
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            return ip
        
        ip_address = get_client_ip(request)
        
        # Enregistrer l'activité de déconnexion
        UserActivity.objects.create(
            user=user,
            action='logout',
            description="Déconnexion",
            ip_address=ip_address
        )


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Créer automatiquement un profil utilisateur lors de la création d'un compte"""

    if kwargs.get('raw', False):  
        return
    if created:
        UserProfile.objects.get_or_create(user=instance)

        # Créer une notification d'inscription pour les administrateurs
        user_display_name = instance.get_full_name() or instance.username
        admin_users = User.objects.filter(is_staff=True, is_active=True)

        # Créer un message d'inscription pour les administrateurs
        registration_message = AdminUserMessage.objects.create(
            user=instance,
            message_type='user_message',
            subject=f"Nouvelle inscription: {user_display_name}",
            message=f"""
Nouvel utilisateur inscrit sur la plateforme:

👤 Nom complet: {user_display_name}
📧 Email: {instance.email}
👤 Nom d'utilisateur: {instance.username}
📅 Date d'inscription: {instance.date_joined.strftime('%d/%m/%Y à %H:%M')}

Profil utilisateur créé automatiquement.
Vous pouvez envoyer un message de bienvenue à ce nouvel utilisateur.
            """.strip(),
            status='pending'
        )

        # Créer des notifications pour tous les administrateurs
        for admin in admin_users:
            UserNotification.objects.create(
                user=admin,
                title=f"👋 Nouvelle inscription: {user_display_name}",
                message=f"L'utilisateur {user_display_name} ({instance.email}) vient de s'inscrire sur la plateforme.",
                notification_type='info',
                is_important=True,
                link_url=f"/admin/users/adminusermessage/{registration_message.id}/change/",
                link_text="Envoyer un message de bienvenue"
            )


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Sauvegarder le profil utilisateur"""
    if kwargs.get('raw', False):
        return 
    if hasattr(instance, 'user_profile_extended'):
        instance.user_profile_extended.save()


def create_admin_notification(title, message, notification_type='info', is_important=False, link_url='', link_text=''):
    """Fonction utilitaire pour créer des notifications pour tous les administrateurs"""
    admin_users = User.objects.filter(is_staff=True, is_active=True)
    
    for admin in admin_users:
        UserNotification.objects.create(
            user=admin,
            title=title,
            message=message,
            notification_type=notification_type,
            is_important=is_important,
            link_url=link_url,
            link_text=link_text
        )


def create_user_notification(user, title, message, notification_type='info', is_important=False, link_url='', link_text=''):
    """Fonction utilitaire pour créer une notification pour un utilisateur spécifique"""
    UserNotification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        is_important=is_important,
        link_url=link_url,
        link_text=link_text
    )
