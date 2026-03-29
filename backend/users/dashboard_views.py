"""
Vues pour le dashboard administrateur
"""
from django.shortcuts import render, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required, user_passes_test
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta
from django.contrib.auth import get_user_model
from .models import UserProfile, UserNotification, AdminUserMessage, TeamMember

User = get_user_model()

from courses.models import Course, CourseEnrollment
from news.models import News
from library.models import Book, BookBorrow, BookReservation
from events.models import Event, EventRegistration


@staff_member_required
def dashboard(request):
    """Dashboard principal de l'administration"""
    
    # Statistiques des utilisateurs
    users_stats = {
        'total': User.objects.count(),
        'active': User.objects.filter(is_active=True).count(),
        'new_this_week': User.objects.filter(
            date_joined__gte=timezone.now() - timedelta(days=7)
        ).count(),
        'students': UserProfile.objects.filter(user_type='student').count(),
        'teachers': UserProfile.objects.filter(user_type='teacher').count(),
        'staff': UserProfile.objects.filter(user_type='staff').count(),
    }
    
    # Statistiques des cours
    courses_stats = {
        'total': Course.objects.count(),
        'published': Course.objects.filter(status='published').count(),
        'enrollments_this_week': CourseEnrollment.objects.filter(
            enrolled_at__gte=timezone.now() - timedelta(days=7)
        ).count(),
    }
    
    # Statistiques de la bibliothèque
    library_stats = {
        'total_books': Book.objects.count(),
        'available_books': Book.objects.filter(status='available').count(),
        'borrowed_books': BookBorrow.objects.filter(
            status='borrowed',
            return_date__isnull=True
        ).count(),
        'overdue_books': BookBorrow.objects.filter(
            status='borrowed',
            due_date__lt=timezone.now(),
            return_date__isnull=True
        ).count(),
    }
    
    # Statistiques des événements
    events_stats = {
        'total': Event.objects.count(),
        'upcoming': Event.objects.filter(
            status='published',
            start_date__gt=timezone.now()
        ).count(),
        'registrations_this_week': EventRegistration.objects.filter(
            registered_at__gte=timezone.now() - timedelta(days=7)
        ).count(),
    }
    
    # Statistiques des notifications
    notifications_stats = {
        'unread_notifications': UserNotification.objects.filter(is_read=False).count(),
        'important_notifications': UserNotification.objects.filter(
            is_important=True,
            is_read=False
        ).count(),
    }
    
    # Messages urgents
    urgent_messages = AdminUserMessage.objects.filter(
        is_urgent=True,
        status='pending'
    ).select_related('user').order_by('-created_at')[:5]
    
    # Utilisateurs récents
    recent_users = User.objects.filter(
        date_joined__gte=timezone.now() - timedelta(days=7)
    ).order_by('-date_joined')[:5]
    
    # Cours populaires
    popular_courses = Course.objects.filter(
        status='published'
    ).annotate(
        enrollment_count=Count('enrollments')
    ).order_by('-enrollment_count')[:5]
    
    # Événements à venir
    upcoming_events = Event.objects.filter(
        status='published',
        start_date__gt=timezone.now()
    ).order_by('start_date')[:5]
    
    # Messages récents
    recent_messages = AdminUserMessage.objects.filter(
        status='pending'
    ).select_related('user').order_by('-created_at')[:10]
    
    context = {
        'stats': {
            'users': users_stats,
            'courses': courses_stats,
            'library': library_stats,
            'events': events_stats,
            'notifications': notifications_stats,
        },
        'urgent_messages': urgent_messages,
        'recent_users': recent_users,
        'popular_courses': popular_courses,
        'upcoming_events': upcoming_events,
        'recent_messages': recent_messages,
    }
    
    return render(request, 'dashboard/dashboard.html', context)


@staff_member_required
def users_management(request):
    """Vue pour la gestion des utilisateurs"""
    from django.core.paginator import Paginator
    
    # Filtres
    user_type_filter = request.GET.get('user_type')
    is_active_filter = request.GET.get('is_active')
    search_query = request.GET.get('search')
    
    # Requête de base
    users = User.objects.select_related('profile')
    
    # Appliquer les filtres
    if user_type_filter:
        users = users.filter(user_profile_extended__user_type=user_type_filter)
    
    if is_active_filter:
        is_active = is_active_filter.lower() == 'true'
        users = users.filter(is_active=is_active)
    
    if search_query:
        users = users.filter(
            Q(username__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(users, 20)
    page_number = request.GET.get('page')
    users_page = paginator.get_page(page_number)
    
    # Statistiques
    stats = {
        'total': User.objects.count(),
        'active': User.objects.filter(is_active=True).count(),
        'students': UserProfile.objects.filter(user_type='student').count(),
        'teachers': UserProfile.objects.filter(user_type='teacher').count(),
        'staff': UserProfile.objects.filter(user_type='staff').count(),
        'new_this_month': User.objects.filter(
            date_joined__gte=timezone.now() - timedelta(days=30)
        ).count(),
    }
    
    # Types d'utilisateurs pour le filtre
    user_types = UserProfile.USER_TYPE_CHOICES
    
    # Filtres actuels
    current_filters = {
        'user_type': user_type_filter,
        'is_active': is_active_filter,
        'search': search_query,
    }
    
    context = {
        'users': users_page,
        'user_types': user_types,
        'current_filters': current_filters,
        'stats': stats,
    }
    
    return render(request, 'dashboard/users_management.html', context)


@staff_member_required
def user_detail(request, user_id):
    """Vue détaillée d'un utilisateur"""
    from django.shortcuts import get_object_or_404
    
    user = get_object_or_404(User, id=user_id)
    profile = user.profile
    
    # Activités récentes
    from .models import UserActivity
    recent_activities = UserActivity.objects.filter(
        user=user
    ).order_by('-created_at')[:10]
    
    # Types d'utilisateurs
    user_types = UserProfile.USER_TYPE_CHOICES
    
    if request.method == 'POST':
        # Mettre à jour les informations utilisateur
        user.first_name = request.POST.get('first_name', '')
        user.last_name = request.POST.get('last_name', '')
        user.email = request.POST.get('email', '')
        user.is_active = 'is_active' in request.POST
        user.save()
        
        # Mettre à jour le profil
        profile.user_type = request.POST.get('user_type', profile.user_type)
        profile.phone = request.POST.get('phone', '')
        profile.address = request.POST.get('address', '')
        profile.city = request.POST.get('city', '')
        profile.department = request.POST.get('department', '')
        profile.specialization = request.POST.get('specialization', '')
        profile.save()
        
        from django.contrib import messages
        messages.success(request, 'Informations utilisateur mises à jour avec succès.')
    
    context = {
        'user': user,
        'profile': profile,
        'user_types': user_types,
        'recent_activities': recent_activities,
    }
    
    return render(request, 'dashboard/user_detail.html', context)


@staff_member_required
def advanced_statistics(request):
    """Statistiques avancées avec graphiques"""
    
    # Période d'analyse
    days = int(request.GET.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    # Inscriptions utilisateurs par jour
    from django.db.models.functions import TruncDate
    user_registrations = list(
        User.objects.filter(
            date_joined__gte=start_date
        ).annotate(
            date=TruncDate('date_joined')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
    )
    
    # Cours par catégorie
    from courses.models import CourseCategory
    course_by_category = list(
        CourseCategory.objects.annotate(
            courses=Count('course')
        ).values('name_fr', 'courses')
    )
    
    # Statistiques de la bibliothèque
    library_stats = {
        'books_by_status': list(
            Book.objects.values('status').annotate(
                count=Count('id')
            )
        ),
        'borrows_by_month': list(
            BookBorrow.objects.filter(
                borrow_date__gte=timezone.now() - timedelta(days=180)
            ).extra(
                select={'month': "strftime('%%Y-%%m', borrow_date)"}
            ).values('month').annotate(
                count=Count('id')
            ).order_by('month')
        ),
        'popular_books': Book.objects.annotate(
            borrow_count=Count('borrows'),
            view_count=Count('id')  # Placeholder pour les vues
        ).order_by('-borrow_count')[:10]
    }
    
    # Activités des utilisateurs
    from .models import UserActivity
    activity_stats = list(
        UserActivity.objects.filter(
            created_at__gte=start_date
        ).values('action').annotate(
            count=Count('id')
        ).order_by('-count')
    )
    
    context = {
        'days': days,
        'user_registrations': user_registrations,
        'course_by_category': course_by_category,
        'library_stats': library_stats,
        'activity_stats': activity_stats,
    }
    
    return render(request, 'dashboard/advanced_statistics.html', context)


@login_required
@user_passes_test(lambda u: u.is_staff)
def notifications_management(request):
    """Vue pour la gestion des notifications et messages"""

    # Statistiques des notifications
    stats = {
        'total_notifications': UserNotification.objects.count(),
        'unread_notifications': UserNotification.objects.filter(is_read=False).count(),
        'important_notifications': UserNotification.objects.filter(is_important=True).count(),
        'total_messages': AdminUserMessage.objects.count(),
    }

    # Notifications récentes
    recent_notifications = UserNotification.objects.select_related('user').order_by('-created_at')[:10]

    # Messages récents
    recent_messages = AdminUserMessage.objects.select_related('user', 'admin_user').order_by('-created_at')[:10]

    # Réservations récentes
    recent_reservations = BookReservation.objects.select_related('book').order_by('-reservation_date')[:10]

    context = {
        'stats': stats,
        'recent_notifications': recent_notifications,
        'recent_messages': recent_messages,
        'recent_reservations': recent_reservations,
    }

    return render(request, 'dashboard/notifications_management.html', context)


@staff_member_required
def team_management(request):
    """Vue pour la gestion de l'équipe"""
    from django.core.paginator import Paginator
    
    # Filtres
    is_director_filter = request.GET.get('is_director')
    search_query = request.GET.get('search')
    
    # Requête de base
    members = TeamMember.objects.all().order_by('order', 'created_at')
    
    # Appliquer les filtres
    if is_director_filter:
        is_director = is_director_filter.lower() == 'true'
        members = members.filter(is_director=is_director)
    
    if search_query:
        members = members.filter(
            Q(full_name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(role_fr__icontains=search_query) |
            Q(role_ar__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(members, 20)
    page_number = request.GET.get('page')
    members_page = paginator.get_page(page_number)
    
    # Statistiques
    stats = {
        'total': TeamMember.objects.count(),
        'directors': TeamMember.objects.filter(is_director=True).count(),
        'with_courses': TeamMember.objects.exclude(courses_taught='').count(),
        'new_this_month': TeamMember.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).count(),
    }
    
    # Filtres actuels
    current_filters = {
        'is_director': is_director_filter,
        'search': search_query,
    }
    
    context = {
        'members': members_page,
        'stats': stats,
        'current_filters': current_filters,
    }
    
    return render(request, 'dashboard/team_management.html', context)

