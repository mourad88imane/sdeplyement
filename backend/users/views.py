from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Count, Q
from .models import UserProfile, UserActivity, UserNotification, UserSession, AdminUserMessage

User = get_user_model()
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    UserProfileUpdateSerializer, ChangePasswordSerializer,
    UserActivitySerializer, UserNotificationSerializer, UserStatsSerializer,
    AdminUserMessageSerializer, AdminUserMessageCreateSerializer, AdminResponseSerializer,
    TeamMemberSerializer
)
from .email_service import EmailService
from .models import UserProfile, UserActivity, UserNotification, UserSession, AdminUserMessage, TeamMember



class UserRegistrationView(generics.CreateAPIView):
    """Inscription d'un nouvel utilisateur"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Créer un token pour l'utilisateur
        token, created = Token.objects.get_or_create(user=user)
        
        # Enregistrer l'activité
        UserActivity.objects.create(
            user=user,
            action='login',
            description='Inscription et première connexion',
            ip_address=self.get_client_ip(request)
        )

        # Envoyer l'email de bienvenue
        try:
            EmailService.send_welcome_email(user)
        except Exception as e:
            # Log l'erreur mais ne pas faire échouer l'inscription
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erreur lors de l'envoi de l'email de bienvenue à {user.email}: {e}")

        # Créer une notification de bienvenue pour l'admin
        try:
            admin_users = User.objects.filter(is_staff=True, is_superuser=True)
            for admin in admin_users:
                AdminUserMessage.objects.create(
                    user=user,
                    message_type='login_notification',
                    subject=f'Nouvel utilisateur inscrit: {user.get_full_name() or user.username}',
                    message=f'Un nouvel utilisateur s\'est inscrit:\n\nNom: {user.get_full_name() or user.username}\nEmail: {user.email}\nType: {user.userprofile.get_user_type_display()}\n\nDate d\'inscription: {user.date_joined.strftime("%d/%m/%Y à %H:%M")}',
                    login_ip=self.get_client_ip(request),
                    login_device=request.META.get('HTTP_USER_AGENT', 'Inconnu')[:200],
                    login_location='Non déterminée'
                )
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erreur lors de la création de la notification admin: {e}")
        
        return Response({
            'message': 'Inscription réussie!',
            'user': UserSerializer(user).data,
            'access': token.key,  # Utiliser le token comme access token pour compatibilité frontend
            'refresh': token.key,  # Même token pour refresh (simplifié)
            'token': token.key  # Garder pour compatibilité
        }, status=status.HTTP_201_CREATED)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_login(request):
    """Connexion utilisateur"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Créer ou récupérer le token
        token, created = Token.objects.get_or_create(user=user)
        
        # Enregistrer l'activité
        UserActivity.objects.create(
            user=user,
            action='login',
            description='Connexion utilisateur',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Créer une session utilisateur
        UserSession.objects.update_or_create(
            user=user,
            session_key=request.session.session_key or 'api_session',
            defaults={
                'ip_address': get_client_ip(request),
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'is_active': True,
                'last_activity': timezone.now()
            }
        )
        
        return Response({
            'message': 'Connexion réussie!',
            'user': UserSerializer(user).data,
            'access': token.key,  # Utiliser le token comme access token pour compatibilité frontend
            'refresh': token.key,  # Même token pour refresh (simplifié)
            'token': token.key  # Garder pour compatibilité
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def user_logout(request):
    """Déconnexion utilisateur"""
    # Enregistrer l'activité
    UserActivity.objects.create(
        user=request.user,
        action='logout',
        description='Déconnexion utilisateur',
        ip_address=get_client_ip(request)
    )
    
    # Désactiver la session
    UserSession.objects.filter(
        user=request.user,
        session_key=request.session.session_key or 'api_session'
    ).update(is_active=False)
    
    # Supprimer le token
    try:
        request.user.auth_token.delete()
    except:
        pass
    
    return Response({'message': 'Déconnexion réussie!'})


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Profil utilisateur"""
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        
        # Enregistrer l'activité
        UserActivity.objects.create(
            user=request.user,
            action='profile_update',
            description='Mise à jour du profil utilisateur',
            ip_address=get_client_ip(request)
        )
        
        return response


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """Changer le mot de passe"""
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Enregistrer l'activité
        UserActivity.objects.create(
            user=user,
            action='profile_update',
            description='Changement de mot de passe',
            ip_address=get_client_ip(request)
        )
        
        return Response({'message': 'Mot de passe changé avec succès!'})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserNotificationListView(generics.ListAPIView):
    """Liste des notifications utilisateur"""
    serializer_class = UserNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserNotification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, notification_id):
    """Marquer une notification comme lue"""
    try:
        notification = UserNotification.objects.get(
            id=notification_id,
            user=request.user
        )
        notification.mark_as_read()
        return Response({'message': 'Notification marquée comme lue'})
    except UserNotification.DoesNotExist:
        return Response(
            {'error': 'Notification non trouvée'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_notifications_read(request):
    """Marquer toutes les notifications comme lues"""
    notifications = UserNotification.objects.filter(
        user=request.user,
        is_read=False
    )
    
    updated_count = 0
    for notification in notifications:
        notification.mark_as_read()
        updated_count += 1
    
    return Response({
        'message': f'{updated_count} notifications marquées comme lues'
    })


class UserActivityListView(generics.ListAPIView):
    """Liste des activités utilisateur"""
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return UserActivity.objects.all().select_related('user')
        return UserActivity.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def user_stats(request):
    """Statistiques des utilisateurs"""
    from datetime import datetime, timedelta
    
    now = timezone.now()
    this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    stats = {
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'students': UserProfile.objects.filter(user_type='student').count(),
        'teachers': UserProfile.objects.filter(user_type='teacher').count(),
        'staff': UserProfile.objects.filter(user_type__in=['staff', 'admin']).count(),
        'verified_users': UserProfile.objects.filter(is_verified=True).count(),
        'new_users_this_month': User.objects.filter(date_joined__gte=this_month).count(),
        'active_sessions': UserSession.objects.filter(is_active=True).count(),
    }
    
    serializer = UserStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def user_list(request):
    """Liste des utilisateurs (admin seulement)"""
    users = User.objects.all().select_related('profile').order_by('-date_joined')
    
    # Filtres optionnels
    user_type = request.GET.get('user_type')
    if user_type:
        users = users.filter(user_profile_extended__user_type=user_type)
    
    is_active = request.GET.get('is_active')
    if is_active is not None:
        users = users.filter(is_active=is_active.lower() == 'true')
    
    is_verified = request.GET.get('is_verified')
    if is_verified is not None:
        users = users.filter(user_profile_extended__is_verified=is_verified.lower() == 'true')
    
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


def get_client_ip(request):
    """Obtenir l'adresse IP du client"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_dashboard_data(request):
    """Données pour le tableau de bord utilisateur"""
    user = request.user
    
    # Statistiques personnelles
    data = {
        'user': UserSerializer(user).data,
        'unread_notifications': UserNotification.objects.filter(
            user=user, is_read=False
        ).count(),
        'recent_activities': UserActivitySerializer(
            UserActivity.objects.filter(user=user).order_by('-created_at')[:5],
            many=True
        ).data,
    }
    
    # Données spécifiques selon le type d'utilisateur
    if hasattr(user, 'user_profile_extended'):
        if user.user_profile_extended.is_student:
            # Données pour les étudiants
            from courses.models import CourseEnrollment
            from library.models import BookBorrow
            
            data.update({
                'enrolled_courses': CourseEnrollment.objects.filter(
                    student_email=user.email
                ).count(),
                'borrowed_books': BookBorrow.objects.filter(
                    borrower_email=user.email,
                    status='active'
                ).count(),
            })
    
    return Response(data)


# ===== VUES POUR LES MESSAGES ADMINISTRATEUR-UTILISATEUR =====

class AdminUserMessageListView(generics.ListAPIView):
    """Liste des messages pour les administrateurs"""
    serializer_class = AdminUserMessageSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = AdminUserMessage.objects.all().select_related('user', 'admin')

        # Filtres optionnels
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)

        message_type = self.request.query_params.get('message_type')
        if message_type:
            queryset = queryset.filter(message_type=message_type)

        is_urgent = self.request.query_params.get('is_urgent')
        if is_urgent is not None:
            queryset = queryset.filter(is_urgent=is_urgent.lower() == 'true')

        return queryset.order_by('-created_at')


class UserMessageListView(generics.ListCreateAPIView):
    """Liste et création de messages pour l'utilisateur connecté"""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AdminUserMessageCreateSerializer
        return AdminUserMessageSerializer

    def get_queryset(self):
        return AdminUserMessage.objects.filter(
            user=self.request.user
        ).select_related('admin').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            message_type='user_message'
        )


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def respond_to_message(request, message_id):
    """Répondre à un message utilisateur"""
    try:
        message = AdminUserMessage.objects.get(id=message_id)
    except AdminUserMessage.DoesNotExist:
        return Response(
            {'error': 'Message non trouvé'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = AdminResponseSerializer(data=request.data)
    if serializer.is_valid():
        response_text = serializer.validated_data['admin_response']
        message.respond(request.user, response_text)

        return Response({
            'message': 'Réponse envoyée avec succès',
            'data': AdminUserMessageSerializer(message).data
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_messages_count(request):
    """Compter les messages non lus pour l'utilisateur"""
    unread_responses = AdminUserMessage.objects.filter(
        user=request.user,
        status='responded',
        admin_response__isnull=False
    ).exclude(
        # Exclure les messages dont la notification de réponse a été lue
        notifications__user=request.user,
        notifications__is_read=True
    ).count()

    return Response({
        'unread_responses': unread_responses,
        'total_messages': AdminUserMessage.objects.filter(user=request.user).count()
    })


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_messages_stats(request):
    """Statistiques des messages pour les administrateurs"""
    stats = {
        'total_messages': AdminUserMessage.objects.count(),
        'pending_messages': AdminUserMessage.objects.filter(status='pending').count(),
        'urgent_messages': AdminUserMessage.objects.filter(is_urgent=True, status='pending').count(),
        'login_notifications': AdminUserMessage.objects.filter(message_type='login_notification').count(),
        'user_messages': AdminUserMessage.objects.filter(message_type='user_message').count(),
        'responded_today': AdminUserMessage.objects.filter(
            responded_at__date=timezone.now().date()
        ).count(),
    }

    return Response(stats)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_message_to_admin(request):
    """Envoyer un message aux administrateurs"""
    subject = request.data.get('subject', '')
    message = request.data.get('message', '')
    is_urgent = request.data.get('is_urgent', False)

    if not subject or not message:
        return Response({
            'error': 'Le sujet et le message sont requis'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Créer le message
    admin_message = AdminUserMessage.objects.create(
        user=request.user,
        message_type='user_message',
        subject=subject,
        message=message,
        is_urgent=is_urgent,
        status='pending'
    )

    # Créer des notifications pour tous les administrateurs
    admin_users = User.objects.filter(is_staff=True, is_active=True)
    user_display_name = request.user.get_full_name() or request.user.username

    for admin in admin_users:
        UserNotification.objects.create(
            user=admin,
            title=f"💬 Nouveau message: {subject}" + (" 🚨" if is_urgent else ""),
            message=f"Message de {user_display_name}: {message[:100]}{'...' if len(message) > 100 else ''}",
            notification_type='warning' if is_urgent else 'info',
            is_important=is_urgent,
            link_url=f"/admin/users/adminusermessage/{admin_message.id}/change/",
            link_text="Répondre au message"
        )

    # Créer une notification de confirmation pour l'utilisateur
    UserNotification.objects.create(
        user=request.user,
        title="✅ Message envoyé",
        message=f"Votre message '{subject}' a été envoyé aux administrateurs. Vous recevrez une réponse prochainement.",
        notification_type='success',
        is_important=False,
        link_url="/profile/messages/",
        link_text="Voir mes messages"
    )

    return Response({
        'success': True,
        'message': 'Message envoyé avec succès',
        'message_id': admin_message.id
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_conversation(request, message_id):
    """Obtenir une conversation spécifique"""
    try:
        message = AdminUserMessage.objects.get(
            id=message_id,
            user=request.user
        )
        return Response(AdminUserMessageSerializer(message).data)
    except AdminUserMessage.DoesNotExist:
        return Response({
            'error': 'Message non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reply_to_admin_response(request, message_id):
    """Répondre à une réponse d'administrateur"""
    try:
        original_message = AdminUserMessage.objects.get(
            id=message_id,
            user=request.user
        )
    except AdminUserMessage.DoesNotExist:
        return Response({
            'error': 'Message non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

    if original_message.status != 'responded':
        return Response({
            'error': 'Ce message n\'a pas encore reçu de réponse'
        }, status=status.HTTP_400_BAD_REQUEST)

    reply_message = request.data.get('message', '')
    if not reply_message:
        return Response({
            'error': 'Le message de réponse est requis'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Créer un nouveau message de réponse
    user_reply = AdminUserMessage.objects.create(
        user=request.user,
        message_type='user_message',
        subject=f"Re: {original_message.subject}",
        message=reply_message,
        status='pending'
    )

    # Notifier les administrateurs de la réponse
    admin_users = User.objects.filter(is_staff=True, is_active=True)
    user_display_name = request.user.get_full_name() or request.user.username

    for admin in admin_users:
        UserNotification.objects.create(
            user=admin,
            title=f"↩️ Réponse de {user_display_name}",
            message=f"Réponse à '{original_message.subject}': {reply_message[:100]}{'...' if len(reply_message) > 100 else ''}",
            notification_type='info',
            is_important=True,
            link_url=f"/admin/users/adminusermessage/{user_reply.id}/change/",
            link_text="Voir la réponse"
        )

    return Response({
        'success': True,
        'message': 'Réponse envoyée avec succès',
        'reply_id': user_reply.id
    })


class PublicTeamListView(generics.ListAPIView):
    """Liste publique de l'équipe (enseignants et staff)"""
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return TeamMember.objects.all().order_by('order', 'created_at')


# ===== CHATBOT OPENAI =====
import os
import json

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')

SYSTEM_PROMPT = """Tu es un assistant virtuel pour l'École Nationale des Transmissions (ENT).
Tu aides les visiteurs et étudiants avec des informations sur:
- Les formations proposées (technicien, assistant, inspecteur)
- Les conditions d'inscription
- Les programmes de formation
- Les événements et activités
- La bibliothèque
- Le musée
- Les contacts et местоположение

Sois poli, professionnel et답 en français. Utilise un ton conversationnel mais professionnel."""


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def chat_with_ai(request):
    """Chat avec l'IA OpenAI"""
    user_message = request.data.get('message', '')
    
    if not user_message:
        return Response({'error': 'Le message est requis'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not OPENAI_API_KEY:
        return Response({
            'error': 'API key OpenAI non configurée. Veuillez configurer OPENAI_API_KEY.',
            'response': 'Désolé, le chatbot n\'est pas disponible pour le moment. Veuillez réessayer plus tard.'
        }, status=503)
    
    try:
        import openai
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        # Get conversation history from session
        chat_history = request.session.get('chat_history', [])
        
        # Build messages for API
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(chat_history)
        messages.append({"role": "user", "content": user_message})
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        assistant_response = response.choices[0].message.content
        
        # Save to session
        chat_history.append({"role": "user", "content": user_message})
        chat_history.append({"role": "assistant", "content": assistant_response})
        
        # Keep only last 20 messages to avoid session bloat
        if len(chat_history) > 20:
            chat_history = chat_history[-20:]
        
        request.session['chat_history'] = chat_history
        request.session.modified = True
        
        return Response({
            'response': assistant_response,
            'chat_history': chat_history
        })
        
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Erreur OpenAI: {str(e)}")
        
        return Response({
            'response': 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.',
            'error': str(e)
        })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_chat_history(request):
    """Récupérer l'historique du chat"""
    chat_history = request.session.get('chat_history', [])
    return Response({'chat_history': chat_history})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def clear_chat_history(request):
    """Effacer l'historique du chat"""
    request.session['chat_history'] = []
    request.session.modified = True
    return Response({'message': 'Historique effacé'})

