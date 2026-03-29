from django.urls import path
from . import views, dashboard_views

urlpatterns = [
    # Authentification
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.user_login, name='user-login'),
    path('logout/', views.user_logout, name='user-logout'),
    
    # Profil utilisateur
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('change-password/', views.change_password, name='change-password'),
    path('dashboard/', views.user_dashboard_data, name='user-dashboard'),
    
    # Notifications
    path('notifications/', views.UserNotificationListView.as_view(), name='user-notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark-notification-read'),
    path('notifications/mark-all-read/', views.mark_all_notifications_read, name='mark-all-notifications-read'),
    
    # Activités
    path('activities/', views.UserActivityListView.as_view(), name='user-activities'),
    
    # Messages utilisateur-administrateur
    path('messages/', views.UserMessageListView.as_view(), name='user-messages'),
    path('messages/send/', views.send_message_to_admin, name='send-message-to-admin'),
    path('messages/<int:message_id>/', views.user_conversation, name='user-conversation'),
    path('messages/<int:message_id>/reply/', views.reply_to_admin_response, name='reply-to-admin'),
    path('messages/count/', views.user_messages_count, name='user-messages-count'),

    # Administration (staff seulement)
    path('stats/', views.user_stats, name='user-stats'),
    path('list/', views.user_list, name='user-list'),
    path('team/', views.PublicTeamListView.as_view(), name='public-team-list'),
    path('admin/messages/', views.AdminUserMessageListView.as_view(), name='admin-messages'),
    path('admin/messages/<int:message_id>/respond/', views.respond_to_message, name='respond-to-message'),
    path('admin/messages/stats/', views.admin_messages_stats, name='admin-messages-stats'),

    # Dashboard views
    path('dashboard/users/', dashboard_views.users_management, name='users_management'),
    path('dashboard/users/<int:user_id>/', dashboard_views.user_detail, name='user_detail'),
    path('dashboard/statistics/', dashboard_views.advanced_statistics, name='advanced_statistics'),
    path('dashboard/notifications/', dashboard_views.notifications_management, name='notifications_management'),
    path('dashboard/team/', dashboard_views.team_management, name='team_management'),

    # Chatbot OpenAI
    path('chat/', views.chat_with_ai, name='chat-with-ai'),
    path('chat/history/', views.get_chat_history, name='chat-history'),
    path('chat/clear/', views.clear_chat_history, name='clear-chat-history'),
]

