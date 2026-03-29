from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.urls import reverse
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User
from django.db.models import Count, Q, Avg, Sum
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib import messages
from django.utils.text import slugify
from django.core.paginator import Paginator
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt

# Imports des modèles
from news.models import News, NewsCategory
from library.models import Book, BookReservation
from users.models import UserNotification as Notification
from events.models import Event, EventCategory


@api_view(['GET'])
def api_root(request):
    """
    Point d'entrée de l'API - Liste tous les endpoints disponibles
    """
    return Response({
        'message': 'Bienvenue sur l\'API de l\'École Nationale des Transmissions',
        'version': '1.0',
        'endpoints': {
            'courses': {
                'description': 'Gestion des cours OHB',
                'urls': {
                    'list': request.build_absolute_uri('/api/courses/'),
                    'categories': request.build_absolute_uri('/api/courses/categories/'),
                    'featured': request.build_absolute_uri('/api/courses/featured/'),
                    'popular': request.build_absolute_uri('/api/courses/popular/'),
                    'stats': request.build_absolute_uri('/api/courses/stats/'),
                }
            },
            'news': {
                'description': 'Gestion des actualités',
                'urls': {
                    'list': request.build_absolute_uri('/api/news/'),
                    'categories': request.build_absolute_uri('/api/news/categories/'),
                    'featured': request.build_absolute_uri('/api/news/featured/'),
                    'latest': request.build_absolute_uri('/api/news/latest/'),
                    'popular': request.build_absolute_uri('/api/news/popular/'),
                    'search': request.build_absolute_uri('/api/news/search/'),
                    'newsletter_subscribe': request.build_absolute_uri('/api/news/newsletter/subscribe/'),
                }
            },
            'library': {
                'description': 'Gestion de la bibliothèque',
                'urls': {
                    'books': request.build_absolute_uri('/api/library/books/'),
                    'categories': request.build_absolute_uri('/api/library/categories/'),
                    'authors': request.build_absolute_uri('/api/library/authors/'),
                    'publishers': request.build_absolute_uri('/api/library/publishers/'),
                    'featured': request.build_absolute_uri('/api/library/books/featured/'),
                    'new_arrivals': request.build_absolute_uri('/api/library/books/new-arrivals/'),
                    'popular': request.build_absolute_uri('/api/library/books/popular/'),
                    'search': request.build_absolute_uri('/api/library/books/search/'),
                }
            },
            'users': {
                'description': 'Gestion des utilisateurs',
                'urls': {
                    'register': request.build_absolute_uri('/api/users/register/'),
                    'login': request.build_absolute_uri('/api/users/login/'),
                    'logout': request.build_absolute_uri('/api/users/logout/'),
                    'profile': request.build_absolute_uri('/api/users/profile/'),
                    'dashboard': request.build_absolute_uri('/api/users/dashboard/'),
                    'notifications': request.build_absolute_uri('/api/users/notifications/'),
                }
            }
        },
        'admin': {
            'description': 'Interface d\'administration',
            'url': request.build_absolute_uri('/admin/')
        },
        'documentation': {
            'description': 'Documentation de l\'API',
            'endpoints_info': {
                'GET /api/': 'Cette page - Liste des endpoints',
                'GET /api/courses/': 'Liste des cours',
                'POST /api/courses/': 'Créer un cours (admin)',
                'GET /api/courses/{slug}/': 'Détails d\'un cours',
                'POST /api/courses/{slug}/enroll/': 'S\'inscrire à un cours',
                'GET /api/news/': 'Liste des actualités',
                'POST /api/news/': 'Créer une actualité (admin)',
                'GET /api/news/{slug}/': 'Détails d\'une actualité',
                'POST /api/news/{slug}/comment/': 'Ajouter un commentaire',
                'GET /api/library/books/': 'Liste des livres',
                'POST /api/library/books/': 'Ajouter un livre (admin)',
                'GET /api/library/books/{id}/': 'Détails d\'un livre',
                'POST /api/library/books/{id}/borrow/': 'Emprunter un livre',
                'POST /api/users/register/': 'Inscription',
                'POST /api/users/login/': 'Connexion',
                'GET /api/users/profile/': 'Profil utilisateur',
            }
        }
    })


def home_view(request):
    """
    Page d'accueil du site
    """
    return JsonResponse({
        'message': 'Bienvenue sur le site de l École Nationale des Transmissions',
        'description': 'Système de gestion scolaire avec API REST',
        'links': {
            'api': request.build_absolute_uri('/api/'),
            'admin': request.build_absolute_uri('/admin/'),
            'dashboard': request.build_absolute_uri('/dashboard/'),
        },
        'status': 'Backend Django opérationnel',
        'version': '1.0',
        'auth_endpoints': {
            'register': request.build_absolute_uri('/api/auth/register/'),
            'login': request.build_absolute_uri('/api/auth/login/'),
            'check_auth': request.build_absolute_uri('/api/auth/check/'),
            'test_cors': request.build_absolute_uri('/api/test-cors/'),
        },
        'debug_tools': {
            'debug_page': request.build_absolute_uri('/debug-api/'),
            'cors_test': request.build_absolute_uri('/api/test-cors/'),
        }
    })


def debug_api_view(request):
    """Vue pour la page de debug API"""
    return render(request, 'debug_api.html')

def api_docs_view(request):
    """Vue pour la documentation de l'API"""
    return render(request, 'api_docs.html')

@csrf_exempt
def debug_requests(request):
    """Vue de debug pour capturer toutes les requêtes"""
    import json
    from django.http import JsonResponse

    # Log de la requête
    print(f"🔍 DEBUG REQUEST:")
    print(f"   Method: {request.method}")
    print(f"   Path: {request.path}")
    print(f"   Full URL: {request.build_absolute_uri()}")
    print(f"   Headers: {dict(request.headers)}")
    print(f"   GET params: {dict(request.GET)}")

    # Réponse avec format de pagination vide
    response_data = {
        'count': 0,
        'next': None,
        'previous': None,
        'results': [],
        'debug_info': {
            'method': request.method,
            'path': request.path,
            'url': request.build_absolute_uri(),
            'message': 'Cette URL n\'est pas configurée pour les événements'
        }
    }

    response = JsonResponse(response_data)
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'

    return response

@csrf_exempt
def api_events_main(request):
    """API principale pour les événements sous /api/events/"""
    from events.models import Event
    from django.utils import timezone

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        response = JsonResponse({'status': 'ok'})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        return response

    try:
        # Récupérer tous les événements publiés et publics
        events = Event.objects.filter(
            status='published',
            is_public=True
        ).select_related('category', 'organizer').order_by('start_date')

        # Préparer les données
        events_data = []
        for event in events:
            event_data = {
                'id': event.id,
                'title_fr': event.title_fr,
                'title_ar': event.title_ar,
                'slug': event.slug,
                'description_fr': event.description_fr,
                'description_ar': event.description_ar,
                'category_name_fr': event.category.name_fr,
                'category_name_ar': event.category.name_ar or event.category.name_fr,
                'category_color': event.category.color,
                'event_type': event.category.name_fr.lower(),
                'event_type_display_fr': event.category.name_fr,
                'event_type_display_ar': event.category.name_ar or event.category.name_fr,
                'start_date': event.start_date.isoformat(),
                'end_date': event.end_date.isoformat(),
                'location': event.location,
                'address': event.address,
                'room': event.room,
                'max_participants': event.max_participants,
                'registration_required': event.registration_required,
                'registration_fee': float(event.registration_fee),
                'priority': event.priority,
                'priority_display_fr': event.get_priority_display(),
                'priority_display_ar': event.get_priority_display(),
                'is_featured': event.is_featured,
                'is_public': event.is_public,
                'status': {
                    'is_upcoming': event.is_upcoming,
                    'is_ongoing': event.is_ongoing,
                    'is_past': event.is_past,
                },
                'organizer_name': f"{event.organizer.first_name} {event.organizer.last_name}".strip() or event.organizer.username,
                'organizer_email': event.organizer.email,
                'featured_image': event.image.url if event.image else None,
                'image_alt_fr': f"Image de {event.title_fr}",
                'image_alt_ar': f"صورة {event.title_ar or event.title_fr}",
                'views_count': event.views_count,
                'created_at': event.created_at.isoformat(),
            }

            events_data.append(event_data)

        # Format de réponse compatible DRF
        response_data = {
            'count': len(events_data),
            'next': None,
            'previous': None,
            'results': events_data
        }

        response = JsonResponse(response_data)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'

        return response

    except Exception as e:
        response_data = {
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
            'error': str(e)
        }

        response = JsonResponse(response_data, status=500)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'

        return response

@csrf_exempt
def api_conferences_main(request):
    """API principale pour les conférences sous /api/conferences/"""
    from events.models import Event

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        response = JsonResponse({'status': 'ok'})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        return response

    try:
        # Récupérer les conférences
        conferences = Event.objects.filter(
            status='published',
            is_public=True,
            category__name_fr__icontains='Conférence'
        ).select_related('category', 'organizer').order_by('start_date')

        conferences_data = []
        for conf in conferences:
            conf_data = {
                'id': conf.id,
                'title': conf.title_fr,
                'title_ar': conf.title_ar,
                'slug': conf.slug,
                'description': conf.description_fr,
                'description_ar': conf.description_ar,
                'start_date': conf.start_date.isoformat(),
                'end_date': conf.end_date.isoformat(),
                'location': conf.location,
                'address': conf.address,
                'room': conf.room,
                'max_participants': conf.max_participants,
                'registration_required': conf.registration_required,
                'registration_fee': float(conf.registration_fee),
                'priority': conf.priority,
                'is_featured': conf.is_featured,
                'status': {
                    'is_upcoming': conf.is_upcoming,
                    'is_ongoing': conf.is_ongoing,
                    'is_past': conf.is_past,
                },
                'organizer': {
                    'name': conf.organizer.get_full_name() or conf.organizer.username,
                    'email': conf.organizer.email,
                },
                'category': conf.category.name_fr,
                'views_count': conf.views_count,
                'created_at': conf.created_at.isoformat(),
            }

            # Ajouter l'URL de l'image si elle existe
            if conf.image:
                conf_data['image_url'] = request.build_absolute_uri(conf.image.url)

            conferences_data.append(conf_data)

        # Format de réponse compatible DRF
        response_data = {
            'count': len(conferences_data),
            'next': None,
            'previous': None,
            'results': conferences_data
        }

        response = JsonResponse(response_data)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'

        return response

    except Exception as e:
        response_data = {
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
            'error': str(e)
        }

        response = JsonResponse(response_data, status=500)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'

        return response


@staff_member_required
def admin_dashboard(request):
    """
    Tableau de bord administrateur personnalisé
    """
    # Importer les modèles ici pour éviter les erreurs d'importation circulaire
    from courses.models import Course, CourseEnrollment
    from news.models import News
    from library.models import Book, BookBorrow
    from users.models import UserProfile, UserNotification, AdminUserMessage

    # Calculer les statistiques
    today = timezone.now().date()
    last_week = today - timedelta(days=7)
    last_month = today - timedelta(days=30)

    # Statistiques générales
    stats = {
        'users': {
            'total': User.objects.count(),
            'active': User.objects.filter(is_active=True).count(),
            'new_this_week': User.objects.filter(date_joined__gte=last_week).count(),
            'new_this_month': User.objects.filter(date_joined__gte=last_month).count(),
        },
        'courses': {
            'total': Course.objects.count(),
            'published': Course.objects.filter(status='published').count(),
            'enrollments_total': CourseEnrollment.objects.count(),
            'enrollments_this_week': CourseEnrollment.objects.filter(enrolled_at__gte=last_week).count(),
        },
        'news': {
            'total': News.objects.count(),
            'published': News.objects.filter(status='published').count(),
            'drafts': News.objects.filter(status='draft').count(),
            'published_this_week': News.objects.filter(status='published', published_at__gte=last_week).count(),
        },
        'library': {
            'total_books': Book.objects.count(),
            'available_books': Book.objects.filter(status='available').count(),
            'borrowed_books': BookBorrow.objects.filter(status='borrowed').count(),
            'overdue_books': BookBorrow.objects.filter(
                status='borrowed',
                due_date__lt=today
            ).count(),
        },
        'notifications': {
            'total_notifications': UserNotification.objects.count(),
            'unread_notifications': UserNotification.objects.filter(is_read=False).count(),
            'important_notifications': UserNotification.objects.filter(is_important=True, is_read=False).count(),
            'notifications_today': UserNotification.objects.filter(created_at__date=today).count(),
        },
        'messages': {
            'total_messages': AdminUserMessage.objects.count(),
            'pending_messages': AdminUserMessage.objects.filter(status='pending').count(),
            'urgent_messages': AdminUserMessage.objects.filter(is_urgent=True, status='pending').count(),
            'login_notifications': AdminUserMessage.objects.filter(message_type='login_notification', status='pending').count(),
            'responded_today': AdminUserMessage.objects.filter(responded_at__date=today).count(),
        }
    }

    # Activités récentes
    recent_users = User.objects.filter(date_joined__gte=last_week).order_by('-date_joined')[:5]
    recent_courses = Course.objects.filter(created_at__gte=last_week).order_by('-created_at')[:5]
    recent_news = News.objects.filter(created_at__gte=last_week).order_by('-created_at')[:5]

    # Cours populaires
    popular_courses = Course.objects.annotate(
        enrollment_count=Count('enrollments')
    ).order_by('-enrollment_count')[:5]

    # Articles populaires
    popular_news = News.objects.filter(status='published').order_by('-views_count')[:5]

    # Messages et notifications récents
    recent_messages = AdminUserMessage.objects.filter(
        status='pending'
    ).select_related('user').order_by('-is_urgent', '-created_at')[:10]

    urgent_messages = AdminUserMessage.objects.filter(
        is_urgent=True, status='pending'
    ).select_related('user').order_by('-created_at')[:5]

    recent_notifications = UserNotification.objects.filter(
        is_read=False, is_important=True
    ).select_related('user').order_by('-created_at')[:5]

    context = {
        'stats': stats,
        'recent_users': recent_users,
        'recent_courses': recent_courses,
        'recent_news': recent_news,
        'popular_courses': popular_courses,
        'popular_news': popular_news,
        'recent_messages': recent_messages,
        'urgent_messages': urgent_messages,
        'recent_notifications': recent_notifications,
        'today': today,
    }

    return render(request, 'dashboard/dashboard.html', context)


# ==================== GESTION DES UTILISATEURS ====================

@staff_member_required
def users_management(request):
    """Gestion complète des utilisateurs"""
    from users.models import UserProfile

    # Filtres
    user_type = request.GET.get('user_type', '')
    search = request.GET.get('search', '')
    is_active = request.GET.get('is_active', '')

    # Requête de base
    users = User.objects.select_related('profile').all()

    # Appliquer les filtres
    if user_type:
        users = users.filter(profile__user_type=user_type)
    if search:
        users = users.filter(
            Q(username__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search) |
            Q(email__icontains=search)
        )
    if is_active:
        users = users.filter(is_active=is_active == 'true')

    # Pagination
    paginator = Paginator(users.order_by('-date_joined'), 20)
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

    context = {
        'users': users_page,
        'stats': stats,
        'user_types': UserProfile.USER_TYPE_CHOICES,
        'current_filters': {
            'user_type': user_type,
            'search': search,
            'is_active': is_active,
        }
    }

    return render(request, 'dashboard/users_management.html', context)


@staff_member_required
def user_detail(request, user_id):
    """Détail et modification d'un utilisateur"""
    from users.models import UserProfile, UserActivity

    user = get_object_or_404(User, id=user_id)
    profile, created = UserProfile.objects.get_or_create(user=user)

    if request.method == 'POST':
        # Mise à jour des informations utilisateur
        user.first_name = request.POST.get('first_name', '')
        user.last_name = request.POST.get('last_name', '')
        user.email = request.POST.get('email', '')
        user.is_active = request.POST.get('is_active') == 'on'
        user.save()

        # Mise à jour du profil
        profile.user_type = request.POST.get('user_type', 'visitor')
        profile.phone = request.POST.get('phone', '')
        profile.address = request.POST.get('address', '')
        profile.city = request.POST.get('city', '')
        profile.department = request.POST.get('department', '')
        profile.specialization = request.POST.get('specialization', '')
        profile.save()

        messages.success(request, f'Utilisateur {user.get_full_name()} mis à jour avec succès.')
        return redirect('user_detail', user_id=user.id)

    # Activités récentes
    recent_activities = UserActivity.objects.filter(user=user).order_by('-timestamp')[:10]

    context = {
        'user': user,
        'profile': profile,
        'recent_activities': recent_activities,
        'user_types': UserProfile.USER_TYPE_CHOICES,
    }

    return render(request, 'dashboard/user_detail.html', context)


# ==================== GESTION DES COURS ====================

@staff_member_required
def courses_management(request):
    """Gestion complète des cours"""
    from courses.models import Course, CourseCategory, CourseEnrollment

    # Filtres
    category_id = request.GET.get('category', '')
    status = request.GET.get('status', '')
    course_type = request.GET.get('type', '').strip()
    search = request.GET.get('search', '')
    course_type = request.GET.get('course_type', '')

    # Requête de base
    courses = Course.objects.select_related('category', 'created_by').all()

    # Appliquer les filtres
    if category_id:
        courses = courses.filter(category_id=category_id)
    if status:
        courses = courses.filter(status=status)
    if search:
        courses = courses.filter(
            Q(title_fr__icontains=search) |
            Q(title_ar__icontains=search) |
            Q(description_fr__icontains=search)
        )

    # Pagination
    paginator = Paginator(courses.order_by('-created_at'), 15)
    page_number = request.GET.get('page')
    courses_page = paginator.get_page(page_number)

    # Statistiques
    stats = {
        'total': Course.objects.count(),
        'published': Course.objects.filter(status='published').count(),
        'draft': Course.objects.filter(status='draft').count(),
        'archived': Course.objects.filter(status='archived').count(),
        'total_enrollments': CourseEnrollment.objects.count(),
        'featured': Course.objects.filter(featured=True).count(),
    }

    # Catégories pour le filtre
    categories = CourseCategory.objects.all()

    context = {
        'courses': courses_page,
        'stats': stats,
        'categories': categories,
        'type_choices': Course.TYPE_CHOICES,
        'status_choices': Course.STATUS_CHOICES,
        'current_filters': {
            'category': category_id,
            'status': status,
            'type': course_type,
            'search': search,
            'course_type': course_type,
        }
    }

    return render(request, 'dashboard/courses_management.html', context)


@staff_member_required
def formation_management(request):
    """Gestion des formations OHB - Page dédiée aux formations OHB"""
    from ohb_formation.models import Formation, FormationCategory
    from django.core.paginator import Paginator
    
    # Get filter parameters
    search_query = request.GET.get('search', '')
    category_filter = request.GET.get('category', '')
    status_filter = request.GET.get('status', '')
    
    # Base queryset
    formations = Formation.objects.select_related('category').order_by('-created_at')
    
    # Apply filters
    if search_query:
        formations = formations.filter(
            Q(title_fr__icontains=search_query) | 
            Q(title_ar__icontains=search_query) |
            Q(description_fr__icontains=search_query)
        )
    
    if category_filter:
        formations = formations.filter(category_id=category_filter)
    
    if status_filter:
        formations = formations.filter(status=status_filter)
    
    # Pagination
    paginator = Paginator(formations, 12)
    page_number = request.GET.get('page', 1)
    formations_page = paginator.get_page(page_number)
    
    categories = FormationCategory.objects.all()
    
    context = {
        'formations': formations_page,
        'categories': categories,
        'current_filters': {
            'search': search_query,
            'category': category_filter,
            'status': status_filter,
        },
        'status_choices': Formation.STATUS_CHOICES,
    }
    return render(request, 'dashboard/formations_management.html', context)


@staff_member_required
def course_add(request):
    """Ajouter un nouveau cours"""
    from courses.models import Course, CourseCategory
    from django.utils.text import slugify

    if request.method == 'POST':
        try:
            # Récupérer les données du formulaire
            # Informations de base
            title_fr = request.POST.get('title_fr', '').strip()
            title_ar = request.POST.get('title_ar', '').strip()
            description_fr = request.POST.get('description_fr', '').strip()
            description_ar = request.POST.get('description_ar', '').strip()
            category_id = request.POST.get('category')
            duration = request.POST.get('duration', 0)
            price = request.POST.get('price', 0)
            status = request.POST.get('status', 'draft')
            grade = request.POST.get('grade', '')
            featured = request.POST.get('featured') == 'on'

            # Descriptions
            description_fr = request.POST.get('description_fr', '').strip()
            description_ar = request.POST.get('description_ar', '').strip()
            content_fr = request.POST.get('content_fr', '').strip()
            content_ar = request.POST.get('content_ar', '').strip()

            # Métadonnées
            level = request.POST.get('level', 'beginner')
            duration_weeks = request.POST.get('duration_weeks', 0)
            duration_hours = request.POST.get('duration_hours')
            max_students = request.POST.get('max_students', 30)

            # Médias
            video_url = request.POST.get('video_url', '').strip()
            
            # Prérequis et objectifs
            prerequisites_fr = request.POST.get('prerequisites_fr', '').strip()
            prerequisites_ar = request.POST.get('prerequisites_ar', '').strip()
            objectives_fr = request.POST.get('objectives_fr', '').strip()
            objectives_ar = request.POST.get('objectives_ar', '').strip()

            # Inscription et prix
            price = request.POST.get('price', 0)
            is_free = request.POST.get('is_free') == 'on'
            registration_open = request.POST.get('registration_open') == 'on'
            registration_deadline = request.POST.get('registration_deadline')

            # Dates
            start_date = request.POST.get('start_date')
            end_date = request.POST.get('end_date')

            # Validation simple
            if not title_fr:
                messages.error(request, 'Le titre en français est requis.')
                return redirect('course_add')

            if not category_id:
                messages.error(request, 'La catégorie est requise.')
                return redirect('course_add')

            # Créer le cours
            # generate unique slug for the course from the title
            base_slug = slugify(title_fr) or 'course'
            slug = base_slug
            counter = 1
            while Course.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            # level is required in the model
            level = request.POST.get('level', 'beginner')

            course = Course.objects.create(
                # Base
                title_fr=title_fr,
                title_ar=title_ar,
                description_fr=description_fr,
                description_ar=description_ar,
                category_id=category_id,
                duration_weeks=int(duration) if duration else 0,
                price=float(price) if price else 0.0,
                status=status,
                featured=featured,
                course_type=request.POST.get('course_type', 'school'),
                image=request.FILES.get('image'),
                created_by=request.user
            )

            messages.success(request, f'Le cours "{course.title_fr}" a été créé avec succès.')
            return redirect('course_detail', course_id=course.id)

        except Exception as e:
            messages.error(request, f'Erreur lors de la création du cours: {str(e)}')
            return redirect('course_add')

    # GET request - afficher le formulaire
    categories = CourseCategory.objects.all()

    context = {
        'categories': categories,
        'status_choices': Course.STATUS_CHOICES,
        'default_course_type': request.GET.get('course_type', 'school'),
        'grade_choices': Course.GRADE_CHOICES,
    }

    return render(request, 'dashboard/course_add.html', context)


@staff_member_required
def course_edit(request, course_id):
    """Modifier un cours existant"""
    from courses.models import Course, CourseCategory
    
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        messages.error(request, 'Cours non trouvé.')
        return redirect('courses_management')
    
    if request.method == 'POST':
        try:
            course.title_fr = request.POST.get('title_fr', '').strip()
            course.title_ar = request.POST.get('title_ar', '').strip()
            course.description_fr = request.POST.get('description_fr', '').strip()
            course.description_ar = request.POST.get('description_ar', '').strip()
            
            category_id = request.POST.get('category')
            if category_id:
                course.category_id = category_id
            
            # Handle grades (comma-separated)
            grades = request.POST.getlist('grades')
            if grades:
                course.grade = ','.join(grades)
            
            course.duration_weeks = int(request.POST.get('duration_weeks', 1))
            course.duration_hours = int(request.POST.get('duration_hours', 0)) if request.POST.get('duration_hours') else None
            
            if request.FILES.get('image'):
                course.image = request.FILES.get('image')
            
            course.save()
            messages.success(request, f'Le cours "{course.title_fr}" a été modifié avec succès.')
            return redirect('courses_management')
            
        except Exception as e:
            messages.error(request, f'Erreur lors de la modification: {str(e)}')
    
    categories = CourseCategory.objects.all()
    context = {
        'course': course,
        'categories': categories,
    }
    return render(request, 'dashboard/course_edit.html', context)


@staff_member_required
def formation_add(request):
    """Ajouter une nouvelle formation OHB - Redirect vers Django admin"""
    from django.shortcuts import redirect
    from django.contrib import messages
    return redirect('/admin/ohb_formation/formation/add/')
    from ohb_formation.models import Formation, FormationCategory
    from django.utils.text import slugify

    if request.method == 'POST':
        try:
            title_fr = request.POST.get('title_fr', '').strip()
            title_ar = request.POST.get('title_ar', '').strip()
            description_fr = request.POST.get('description_fr', '').strip()
            description_ar = request.POST.get('description_ar', '').strip()
            category_id = request.POST.get('category')
            duration_weeks = request.POST.get('duration', 0)
            duration_hours = request.POST.get('duration_hours', '')
            status = request.POST.get('status', 'draft')
            featured = request.POST.get('featured') == 'on'

            if not title_fr:
                messages.error(request, 'Le titre en français est requis.')
                return redirect('formation_add')

            if not category_id:
                messages.error(request, 'La catégorie est requise.')
                return redirect('formation_add')

            # generate a unique slug for the formation
            base_slug = slugify(title_fr) or 'formation'
            slug = base_slug
            counter = 1
            while Formation.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            formation = Formation.objects.create(
                title_fr=title_fr,
                title_ar=title_ar,
                description_fr=description_fr,
                description_ar=description_ar,
                category_id=category_id,
                duration_weeks=int(duration_weeks) if duration_weeks else 0,
                duration_hours=int(duration_hours) if duration_hours else None,
                status=status,
                featured=featured,
                image=request.FILES.get('image'),
                brochure_pdf=request.FILES.get('brochure_pdf'),
                slug=slug,
                created_by=request.user
            )

            messages.success(request, f'La formation "{formation.title_fr}" a été créée avec succès.')
            return redirect('formation_management')

        except Exception as e:
            messages.error(request, f'Erreur lors de la création de la formation: {str(e)}')
            return redirect('formation_add')

    # GET: render specialized OHB form
    categories = FormationCategory.objects.all()
    context = {
        'categories': categories,
        'status_choices': Formation.STATUS_CHOICES,
    }
    return render(request, 'dashboard/formation_add.html', context)


@staff_member_required
def course_detail(request, course_id):
    """Détail et modification d'un cours"""
    from courses.models import Course, CourseCategory, CourseEnrollment, CourseModule

    course = get_object_or_404(Course, id=course_id)

    if request.method == 'POST':
        # Mise à jour du cours
        course.title_fr = request.POST.get('title_fr', '')
        course.title_ar = request.POST.get('title_ar', '')
        course.description_fr = request.POST.get('description_fr', '')
        course.description_ar = request.POST.get('description_ar', '')
        course.level = request.POST.get('level', 'beginner')
        course.duration_weeks = int(request.POST.get('duration_weeks', 1))
        course.max_students = int(request.POST.get('max_students', 30))
        course.price = float(request.POST.get('price', 0))
        course.status = request.POST.get('status', 'draft')
        course.featured = request.POST.get('featured') == 'on'
        course.registration_open = request.POST.get('registration_open') == 'on'
        course.grade = request.POST.get('grade', course.grade)

        if category_id:
            course.category_id = category_id
            
        course.course_type = request.POST.get('course_type', course.course_type)
        if request.FILES.get('image'):
            course.image = request.FILES.get('image')

        course.save()

        messages.success(request, f'Cours "{course.title_fr}" mis à jour avec succès.')
        return redirect('course_detail', course_id=course.id)

    # Données pour le contexte
    categories = CourseCategory.objects.all()
    enrollments = CourseEnrollment.objects.filter(course=course).select_related('course')[:10]
    modules = CourseModule.objects.filter(course=course).order_by('order')

    # Statistiques du cours
    course_stats = {
        'total_enrollments': CourseEnrollment.objects.filter(course=course).count(),
        'approved_enrollments': CourseEnrollment.objects.filter(course=course, status='approved').count(),
        'pending_enrollments': CourseEnrollment.objects.filter(course=course, status='pending').count(),
        'modules_count': modules.count(),
        'views': course.views_count,
    }

    context = {
        'course': course,
        'categories': categories,
        'enrollments': enrollments,
        'modules': modules,
        'course_stats': course_stats,
        'level_choices': Course.LEVEL_CHOICES,
        'status_choices': Course.STATUS_CHOICES,
    }

    return render(request, 'dashboard/course_detail.html', context)


# ==================== GESTION DE LA BIBLIOTHÈQUE ====================

@staff_member_required
def library_management(request):
    """Gestion complète de la bibliothèque"""
    from library.models import Book, BookCategory, BookBorrow, BookReservation

    # Filtres
    category_id = request.GET.get('category', '')
    status = request.GET.get('status', '')
    search = request.GET.get('search', '')

    # Requête de base
    books = Book.objects.select_related('category', 'publisher', 'added_by').prefetch_related('authors').all()

    # Appliquer les filtres
    if category_id:
        books = books.filter(category_id=category_id)
    if status:
        books = books.filter(status=status)
    if search:
        books = books.filter(
            Q(title__icontains=search) |
            Q(isbn__icontains=search) |
            Q(authors__first_name__icontains=search) |
            Q(authors__last_name__icontains=search)
        ).distinct()

    # Pagination
    paginator = Paginator(books.order_by('-created_at'), 15)
    page_number = request.GET.get('page')
    books_page = paginator.get_page(page_number)

    # Statistiques
    stats = {
        'total_books': Book.objects.count(),
        'available': Book.objects.filter(status='available').count(),
        'borrowed': Book.objects.filter(status='borrowed').count(),
        'reserved': Book.objects.filter(status='reserved').count(),
        'total_copies': Book.objects.aggregate(total=Sum('copies_total'))['total'] or 0,
        'available_copies': Book.objects.aggregate(total=Sum('copies_available'))['total'] or 0,
        'active_borrows': BookBorrow.objects.filter(status='borrowed').count(),
        'overdue_borrows': BookBorrow.objects.filter(
            status='borrowed',
            due_date__lt=timezone.now().date()
        ).count(),
        'active_reservations': BookReservation.objects.filter(status='active').count(),
    }

    # Catégories pour le filtre
    categories = BookCategory.objects.all()

    context = {
        'books': books_page,
        'stats': stats,
        'categories': categories,
        'status_choices': Book.STATUS_CHOICES,
        'current_filters': {
            'category': category_id,
            'status': status,
            'search': search,
        }
    }

    return render(request, 'dashboard/library_management.html', context)


@staff_member_required
def book_detail(request, book_id):
    """Détail et modification d'un livre"""
    from library.models import Book, BookCategory, Author, Publisher, BookBorrow, BookReservation

    book = get_object_or_404(Book, id=book_id)

    if request.method == 'POST':
        # Mise à jour du livre
        book.title = request.POST.get('title', '')
        book.subtitle = request.POST.get('subtitle', '')
        book.isbn = request.POST.get('isbn', '')
        book.description_fr = request.POST.get('description_fr', '')
        book.pages = int(request.POST.get('pages', 0)) if request.POST.get('pages') else 0
        book.language = request.POST.get('language', 'fr')
        book.status = request.POST.get('status', 'available')
        book.copies_total = int(request.POST.get('copies_total', 1))
        book.copies_available = int(request.POST.get('copies_available', 1))
        book.location = request.POST.get('location', '')
        book.call_number = request.POST.get('call_number', '')
        book.is_featured = request.POST.get('is_featured') == 'on'
        book.allow_download = request.POST.get('allow_download') == 'on'

        category_id = request.POST.get('category')
        if category_id:
            book.category_id = category_id

        publisher_id = request.POST.get('publisher')
        if publisher_id:
            book.publisher_id = publisher_id

        book.save()

        messages.success(request, f'Livre "{book.title}" mis à jour avec succès.')
        return redirect('book_detail', book_id=book.id)

    # Données pour le contexte
    categories = BookCategory.objects.all()
    publishers = Publisher.objects.all()
    authors = Author.objects.all()

    # Emprunts et réservations
    borrows = BookBorrow.objects.filter(book=book).select_related('user').order_by('-borrowed_at')[:10]
    reservations = BookReservation.objects.filter(book=book).order_by('-created_at')[:10]

    # Statistiques du livre
    book_stats = {
        'total_borrows': BookBorrow.objects.filter(book=book).count(),
        'active_borrows': BookBorrow.objects.filter(book=book, status='borrowed').count(),
        'overdue_borrows': BookBorrow.objects.filter(
            book=book,
            status='borrowed',
            due_date__lt=timezone.now().date()
        ).count(),
        'total_reservations': BookReservation.objects.filter(book=book).count(),
        'active_reservations': BookReservation.objects.filter(book=book, status='active').count(),
        'views': book.views_count,
        'downloads': book.download_count,
    }

    context = {
        'book': book,
        'categories': categories,
        'publishers': publishers,
        'authors': authors,
        'borrows': borrows,
        'reservations': reservations,
        'book_stats': book_stats,
        'status_choices': Book.STATUS_CHOICES,
        'language_choices': Book.LANGUAGE_CHOICES,
    }

    return render(request, 'dashboard/book_detail.html', context)


# ==================== GESTION DES ACTUALITÉS ====================

@staff_member_required
def news_management(request):
    """Gestion complète des actualités"""
    from news.models import News, NewsCategory

    # Filtres
    category_id = request.GET.get('category', '')
    status = request.GET.get('status', '')
    search = request.GET.get('search', '')

    # Requête de base
    news = News.objects.select_related('category', 'author').all()

    # Appliquer les filtres
    if category_id:
        news = news.filter(category_id=category_id)
    if status:
        news = news.filter(status=status)
    if search:
        news = news.filter(
            Q(title_fr__icontains=search) |
            Q(title_ar__icontains=search) |
            Q(content_fr__icontains=search)
        )

    # Pagination
    paginator = Paginator(news.order_by('-created_at'), 15)
    page_number = request.GET.get('page')
    news_page = paginator.get_page(page_number)

    # Statistiques
    stats = {
        'total': News.objects.count(),
        'published': News.objects.filter(status='published').count(),
        'draft': News.objects.filter(status='draft').count(),
        'archived': News.objects.filter(status='archived').count(),
        'featured': News.objects.filter(featured=True).count(),
        'total_views': News.objects.aggregate(total=Sum('views_count'))['total'] or 0,
    }

    # Catégories pour le filtre
    categories = NewsCategory.objects.all()

    context = {
        'news': news_page,
        'stats': stats,
        'categories': categories,
        'status_choices': News.STATUS_CHOICES,
        'current_filters': {
            'category': category_id,
            'status': status,
            'search': search,
        }
    }

    return render(request, 'dashboard/news_management.html', context)


# ==================== STATISTIQUES AVANCÉES ====================

@staff_member_required
def advanced_statistics(request):
    """Statistiques avancées avec graphiques"""
    from courses.models import Course, CourseEnrollment
    from news.models import News
    from library.models import Book, BookBorrow
    from users.models import UserProfile, UserActivity

    # Période d'analyse
    days = int(request.GET.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)

    # Statistiques des utilisateurs par jour
    user_registrations = []
    for i in range(days):
        date = start_date + timedelta(days=i)
        count = User.objects.filter(
            date_joined__date=date.date()
        ).count()
        user_registrations.append({
            'date': date.strftime('%Y-%m-%d'),
            'count': count
        })

    # Statistiques des cours par catégorie
    course_by_category = []
    from courses.models import CourseCategory
    for category in CourseCategory.objects.all():
        count = Course.objects.filter(category=category).count()
        enrollments = CourseEnrollment.objects.filter(course__category=category).count()
        course_by_category.append({
            'name': category.name_fr,
            'courses': count,
            'enrollments': enrollments
        })

    # Statistiques de la bibliothèque
    library_stats = {
        'books_by_status': [],
        'borrows_by_month': [],
        'popular_books': []
    }

    # Livres par statut
    for status, label in Book.STATUS_CHOICES:
        count = Book.objects.filter(status=status).count()
        library_stats['books_by_status'].append({
            'status': label,
            'count': count
        })

    # Emprunts par mois (6 derniers mois)
    for i in range(6):
        date = timezone.now() - timedelta(days=30*i)
        count = BookBorrow.objects.filter(
            borrowed_at__year=date.year,
            borrowed_at__month=date.month
        ).count()
        library_stats['borrows_by_month'].append({
            'month': date.strftime('%B %Y'),
            'count': count
        })

    # Livres populaires
    popular_books = Book.objects.order_by('-views_count')[:10]
    for book in popular_books:
        library_stats['popular_books'].append({
            'title': book.title,
            'views': book.views_count,
            'borrows': BookBorrow.objects.filter(book=book).count()
        })

    # Activités des utilisateurs
    activity_stats = []
    for action, label in UserActivity.ACTION_CHOICES:
        count = UserActivity.objects.filter(
            action=action,
            timestamp__gte=start_date
        ).count()
        activity_stats.append({
            'action': label,
            'count': count
        })

    context = {
        'user_registrations': user_registrations,
        'course_by_category': course_by_category,
        'library_stats': library_stats,
        'activity_stats': activity_stats,
        'days': days,
        'start_date': start_date,
    }

    return render(request, 'dashboard/advanced_statistics.html', context)


# ==================== API DE DEBUG POUR CAPTURER LES REQUÊTES ====================

@csrf_exempt
def catch_all_api(request, path=''):
    """Capture toutes les requêtes API non trouvées"""
    import json

    print(f"🔍 REQUÊTE NON TROUVÉE:")
    print(f"   Method: {request.method}")
    print(f"   Path: {request.path}")
    print(f"   Full URL: {request.build_absolute_uri()}")
    print(f"   User-Agent: {request.META.get('HTTP_USER_AGENT', 'Unknown')}")
    print(f"   Origin: {request.META.get('HTTP_ORIGIN', 'Unknown')}")
    print(f"   Referer: {request.META.get('HTTP_REFERER', 'Unknown')}")

    # Réponse avec format de pagination vide + info de debug
    response_data = {
        'count': 0,
        'next': None,
        'previous': None,
        'results': [],
        'debug_info': {
            'requested_path': request.path,
            'method': request.method,
            'message': f'URL non trouvée: {request.path}',
            'available_urls': [
                'http://192.168.100.16:8000/api/events/',
                'http://192.168.100.16:8000/api/conferences/',
            ],
            'suggestion': 'Vérifiez que votre frontend appelle les bonnes URLs'
        }
    }

    response = JsonResponse(response_data)
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'

    return response


# ==================== APIs SPÉCIALISÉES PAR TYPE D'ÉVÉNEMENT ====================

@csrf_exempt
def api_events_by_type(request, event_type):
    """API pour récupérer les événements par catégorie"""
    if request.method == 'GET':
        try:
            # Mapping des types d'événements vers les catégories
            # Utilise les noms exacts existants dans la DB: Ateliers, Competition, Conférence, succes alumni
            type_mapping = {
                'conferences': 'Conférence',        # Existe en DB
                'workshops': 'Ateliers',            # Existe en DB
                'competitions': 'Competition',     # Existe en DB (sans accent)
                'cultural': 'Événements culturels', # N'existe pas en DB
                'sports': 'Sport',                  # N'existe pas en DB
                'seminars': 'Séminaires',           # N'existe pas en DB
                'formations': 'Formations',         # N'existe pas en DB
                'reunions': 'Réunions',             # N'existe pas en DB
                'training': 'Formations',           # Alias pour formations
                'meetings': 'Réunions',             # Alias pour réunions
                'graduation': ' graduation',       # N'existe pas en DB
                'hackathons': 'hackathons'          # N'existe pas en DB
            }

            # Vérifier si le type est valide
            if event_type not in type_mapping:
                return JsonResponse({
                    'events': [],
                    'total_count': 0,
                    'message': f'Type d\'événement inconnu: {event_type}'
                }, status=200)

            # Récupérer la catégorie correspondante
            category_name = type_mapping[event_type]

            # Tenter de récupérer la catégorie avec icontains pour plus de flexibilité
            try:
                category = EventCategory.objects.get(name_fr__icontains=category_name)
            except EventCategory.DoesNotExist:
                # Retourner un tableau vide au lieu d'une erreur
                return JsonResponse({
                    'events': [],
                    'total_count': 0,
                    'message': f'Aucun événement de type "{event_type}" n\'existe actuellement.'
                }, status=200)

            # Récupérer les événements de cette catégorie
            events = Event.objects.filter(
                status='published',
                is_public=True,
                category=category
            ).select_related('category', 'organizer').order_by('-start_date')

            print(f"🎯 API {event_type}: {events.count()} événements trouvés")

            # Sérialiser les données
            events_data = []
            for event in events:
                event_data = {
                    'id': event.id,
                    'title_fr': event.title_fr,
                    'title_ar': event.title_ar or event.title_fr,
                    'slug': event.slug,
                    'description_fr': event.description_fr,
                    'description_ar': event.description_ar or event.description_fr,
                    'content_fr': event.description_fr,
                    'content_ar': event.description_ar or event.description_fr,
                    'category_name_fr': event.category.name_fr,
                    'category_name_ar': event.category.name_ar or event.category.name_fr,
                    'category_color': event.category.color,
                    'event_type': event_type,
                    'event_type_display_fr': category_name,
                    'event_type_display_ar': event.category.name_ar or category_name,
                    'start_date': event.start_date.isoformat(),
                    'end_date': event.end_date.isoformat() if event.end_date else None,
                    'start_time': event.start_date.strftime('%H:%M') if event.start_date else None,
                    'end_time': event.end_date.strftime('%H:%M') if event.end_date else None,
                    'location': event.location or '',
                    'max_participants': event.max_participants,
                    'registration_required': event.registration_required,
                    'registration_fee': float(event.registration_fee) if event.registration_fee else 0.0,
                    'priority': event.priority,
                    'priority_display_fr': event.get_priority_display(),
                    'priority_display_ar': event.get_priority_display(),
                    'is_featured': event.is_featured,
                    'is_public': event.is_public,
                    'featured_image': request.build_absolute_uri(event.image.url) if event.image else None,
                    'image_url': request.build_absolute_uri(event.image.url) if event.image else None,
                    'image_alt_fr': f"Image de {event.title_fr}",
                    'image_alt_ar': f"صورة {event.title_ar or event.title_fr}",
                    'views_count': getattr(event, 'views_count', 0),
                    'organizer_name': f"{event.organizer.first_name} {event.organizer.last_name}".strip() or event.organizer.username,
                    'organizer_email': event.organizer.email,
                    'created_at': event.created_at.isoformat(),
                    'status': {
                        'is_upcoming': event.start_date > timezone.now(),
                        'is_ongoing': event.start_date <= timezone.now() <= (event.end_date or event.start_date),
                        'is_past': (event.end_date or event.start_date) < timezone.now(),
                    }
                }
                events_data.append(event_data)

            # Format de réponse avec pagination
            response_data = {
                'count': len(events_data),
                'next': None,
                'previous': None,
                'results': events_data,
                'event_type': event_type,
                'event_type_display': category_name,
                'category_info': {
                    'id': category.id,
                    'name_fr': category.name_fr,
                    'name_ar': category.name_ar,
                    'color': category.color
                }
            }

            response = JsonResponse(response_data)
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'

            return response

        except Exception as e:
            print(f"❌ Erreur API events by type: {str(e)}")
            import traceback
            traceback.print_exc()

            response_data = {
                'error': 'Erreur serveur',
                'message': str(e),
                'count': 0,
                'results': []
            }
            response = JsonResponse(response_data, status=500)
            response['Access-Control-Allow-Origin'] = '*'
            return response

    elif request.method == 'OPTIONS':
        response = JsonResponse({})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        return response

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
