from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q, Count
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Event, EventCategory, EventRegistration, EventReminder

# Imports pour DRF
try:
    from rest_framework import generics, filters
    from rest_framework.decorators import api_view
    from rest_framework.response import Response
    from django_filters.rest_framework import DjangoFilterBackend
    DRF_AVAILABLE = True
except ImportError:
    DRF_AVAILABLE = False
from users.email_service import EmailService


@staff_member_required
def events_management(request):
    """Vue pour la gestion des événements dans le dashboard admin"""

    # Filtres
    category_filter = request.GET.get('category')
    status_filter = request.GET.get('status')
    search_query = request.GET.get('search')

    # Requête de base
    events = Event.objects.select_related('category', 'organizer', 'created_by').annotate(
        registrations_count=Count('registrations')
    )

    # Appliquer les filtres
    if category_filter:
        events = events.filter(category_id=category_filter)

    if status_filter:
        events = events.filter(status=status_filter)

    if search_query:
        events = events.filter(
            Q(title_fr__icontains=search_query) |
            Q(title_ar__icontains=search_query) |
            Q(description_fr__icontains=search_query) |
            Q(location__icontains=search_query)
        )

    # Pagination
    paginator = Paginator(events, 20)
    page_number = request.GET.get('page')
    events_page = paginator.get_page(page_number)

    # Statistiques
    stats = {
        'total': Event.objects.count(),
        'published': Event.objects.filter(status='published').count(),
        'draft': Event.objects.filter(status='draft').count(),
        'upcoming': Event.objects.filter(
            status='published',
            start_date__gt=timezone.now()
        ).count(),
        'ongoing': Event.objects.filter(
            status='published',
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        ).count(),
        'total_registrations': EventRegistration.objects.filter(status='confirmed').count(),
    }

    # Données pour les filtres
    categories = EventCategory.objects.filter(is_active=True)
    status_choices = Event.STATUS_CHOICES

    # Filtres actuels pour la pagination
    current_filters = {
        'category': category_filter,
        'status': status_filter,
        'search': search_query,
    }

    context = {
        'events': events_page,
        'categories': categories,
        'status_choices': status_choices,
        'current_filters': current_filters,
        'stats': stats,
    }

    return render(request, 'dashboard/events_management.html', context)


@staff_member_required
def event_detail(request, event_id):
    """Vue détaillée d'un événement"""
    event = get_object_or_404(Event, id=event_id)

    # Statistiques de l'événement
    registrations = event.registrations.select_related('user').order_by('-registered_at')

    stats = {
        'total_registrations': registrations.count(),
        'confirmed_registrations': registrations.filter(status='confirmed').count(),
        'pending_registrations': registrations.filter(status='pending').count(),
        'cancelled_registrations': registrations.filter(status='cancelled').count(),
        'views': event.views_count,
        'available_spots': event.available_spots,
    }

    # Pagination des inscriptions
    paginator = Paginator(registrations, 20)
    page_number = request.GET.get('page')
    registrations_page = paginator.get_page(page_number)

    context = {
        'event': event,
        'registrations': registrations_page,
        'stats': stats,
    }

    return render(request, 'dashboard/event_detail.html', context)


@login_required
def event_register(request, event_id):
    """Inscription à un événement"""
    event = get_object_or_404(Event, id=event_id, status='published')

    if request.method == 'POST':
        # Vérifier si l'utilisateur peut s'inscrire
        if not event.registration_open:
            messages.error(request, "Les inscriptions sont fermées pour cet événement.")
            return redirect('event_detail', event_id=event.id)

        if event.is_full:
            messages.error(request, "Cet événement est complet.")
            return redirect('event_detail', event_id=event.id)

        # Vérifier si déjà inscrit
        existing_registration = EventRegistration.objects.filter(
            event=event,
            user=request.user
        ).first()

        if existing_registration:
            if existing_registration.status == 'cancelled':
                # Réactiver l'inscription
                existing_registration.status = 'pending'
                existing_registration.save()
                messages.success(request, "Votre inscription a été réactivée.")
            else:
                messages.warning(request, "Vous êtes déjà inscrit à cet événement.")
            return redirect('event_detail', event_id=event.id)

        # Créer l'inscription
        registration = EventRegistration.objects.create(
            event=event,
            user=request.user,
            status='confirmed' if not event.registration_fee else 'pending',
            notes=request.POST.get('notes', ''),
            special_requirements=request.POST.get('special_requirements', '')
        )

        # Envoyer l'email de confirmation
        try:
            EmailService.send_event_registration_email(request.user, event)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erreur lors de l'envoi de l'email de confirmation d'événement: {e}")

        messages.success(request, "Votre inscription a été confirmée !")
        return redirect('event_detail', event_id=event.id)

    return redirect('event_detail', event_id=event.id)


@login_required
def event_cancel_registration(request, event_id):
    """Annuler une inscription à un événement"""
    event = get_object_or_404(Event, id=event_id)

    registration = get_object_or_404(
        EventRegistration,
        event=event,
        user=request.user
    )

    if request.method == 'POST':
        registration.status = 'cancelled'
        registration.save()

        messages.success(request, "Votre inscription a été annulée.")
        return redirect('event_detail', event_id=event.id)

    return redirect('event_detail', event_id=event.id)


@staff_member_required
@require_POST
@csrf_exempt
def update_registration_status(request):
    """Mettre à jour le statut d'une inscription"""
    try:
        data = json.loads(request.body)
        registration_id = data.get('registration_id')
        new_status = data.get('status')

        registration = get_object_or_404(EventRegistration, id=registration_id)
        registration.status = new_status
        registration.save()

        return JsonResponse({
            'success': True,
            'message': f'Statut mis à jour: {registration.get_status_display()}'
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


# ==================== API REST POUR LE FRONTEND ====================

def add_cors_headers(response):
    """Ajouter les headers CORS à la réponse"""
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    response['Access-Control-Allow-Credentials'] = 'true'
    return response

def cors_json_response(data, status=200):
    """Créer une réponse JSON avec headers CORS"""
    response = JsonResponse(data, status=status)
    return add_cors_headers(response)

@csrf_exempt
def api_events_list(request):
    """API pour récupérer la liste des événements"""

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'ok'})

    try:
        # Filtres
        category = request.GET.get('category', '')
        status = request.GET.get('status', 'published')
        featured = request.GET.get('featured', '')
        upcoming = request.GET.get('upcoming', '')
        slug = request.GET.get('slug', '')  # Added slug filter

        # Requête de base - événements publiés et publics
        events = Event.objects.filter(
            status='published',
            is_public=True
        ).select_related('category', 'organizer')

        # Appliquer les filtres
        if slug:
            events = events.filter(slug=slug)

        if category:
            events = events.filter(category__name_fr__icontains=category)

        if featured:
            events = events.filter(is_featured=True)

        if upcoming:
            events = events.filter(start_date__gt=timezone.now())

        # Ordonner par date de début
        events = events.order_by('start_date')

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
                'category': {
                    'id': event.category.id,
                    'name_fr': event.category.name_fr,
                    'name_ar': event.category.name_ar,
                },
                'start_date': event.start_date.isoformat(),
                'end_date': event.end_date.isoformat(),
                'location': event.location,
                'address': event.address,
                'room': event.room,
                'max_participants': event.max_participants,
                'registration_required': event.registration_required,
                'registration_fee': float(event.registration_fee),
                'priority': event.priority,
                'is_featured': event.is_featured,
                'is_upcoming': event.is_upcoming,
                'is_ongoing': event.is_ongoing,
                'is_past': event.is_past,
                'organizer': {
                    'id': event.organizer.id,
                    'name': event.organizer.get_full_name() or event.organizer.username,
                    'email': event.organizer.email,
                },
                'views_count': event.views_count,
                'created_at': event.created_at.isoformat(),
            }

            # Ajouter l'URL de l'image si elle existe
            if event.image:
                event_data['image_url'] = request.build_absolute_uri(event.image.url)

            events_data.append(event_data)

        return cors_json_response({
            'success': True,
            'count': len(events_data),
            'events': events_data
        })

    except Exception as e:
        return cors_json_response({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
def api_conferences_list(request):
    """API spécifique pour récupérer les conférences"""

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'ok'})

    try:
        # Filtres
        slug = request.GET.get('slug', '')  # Added slug filter
        
        # Récupérer les conférences (catégorie "Conférences")
        conferences = Event.objects.filter(
            status='published',
            is_public=True,
            category__name_fr__icontains='Conférence'
        ).select_related('category', 'organizer').order_by('start_date')

        # Appliquer le filtre slug
        if slug:
            conferences = conferences.filter(slug=slug)

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

            # Always include image fields (with null if no image)
            conf_data['image_url'] = request.build_absolute_uri(conf.image.url) if conf.image else None
            conf_data['image'] = conf.image.url if conf.image else None
            conf_data['featured_image'] = request.build_absolute_uri(conf.image.url) if conf.image else None

            conferences_data.append(conf_data)

        return cors_json_response({
            'success': True,
            'count': len(conferences_data),
            'conferences': conferences_data,
            'message': f'{len(conferences_data)} conférence(s) trouvée(s)'
        })

    except Exception as e:
        return cors_json_response({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
def api_events_paginated(request):
    """API avec pagination pour les événements (format DRF)"""

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'ok'})

    try:
        # Filtres
        slug = request.GET.get('slug', '')  # Added slug filter
        
        # Récupérer les événements publiés et publics
        events = Event.objects.filter(
            status='published',
            is_public=True
        ).select_related('category', 'organizer').order_by('start_date')

        # Appliquer le filtre slug
        if slug:
            events = events.filter(slug=slug)

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
                'category': {
                    'id': event.category.id,
                    'name_fr': event.category.name_fr,
                    'name_ar': event.category.name_ar,
                },
                'start_date': event.start_date.isoformat(),
                'end_date': event.end_date.isoformat(),
                'location': event.location,
                'address': event.address,
                'room': event.room,
                'max_participants': event.max_participants,
                'registration_required': event.registration_required,
                'registration_fee': float(event.registration_fee),
                'priority': event.priority,
                'is_featured': event.is_featured,
                'is_upcoming': event.is_upcoming,
                'is_ongoing': event.is_ongoing,
                'is_past': event.is_past,
                'organizer': {
                    'id': event.organizer.id,
                    'name': event.organizer.get_full_name() or event.organizer.username,
                    'email': event.organizer.email,
                },
                'views_count': event.views_count,
                'created_at': event.created_at.isoformat(),
            }

            # Ajouter l'URL de l'image si elle existe
            if event.image:
                event_data['image_url'] = request.build_absolute_uri(event.image.url)

            events_data.append(event_data)

        # Format de réponse compatible DRF
        return cors_json_response({
            'count': len(events_data),
            'next': None,
            'previous': None,
            'results': events_data
        })

    except Exception as e:
        return cors_json_response({
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
            'error': str(e)
        }, status=500)

@csrf_exempt
def api_conferences_paginated(request):
    """API avec pagination pour les conférences (format DRF)"""

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'ok'})

    try:
        # Filtres
        slug = request.GET.get('slug', '')  # Added slug filter
        
        # Récupérer les conférences
        conferences = Event.objects.filter(
            status='published',
            is_public=True,
            category__name_fr__icontains='Conférence'
        ).select_related('category', 'organizer').order_by('start_date')

        # Appliquer le filtre slug
        if slug:
            conferences = conferences.filter(slug=slug)

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
        return cors_json_response({
            'count': len(conferences_data),
            'next': None,
            'previous': None,
            'results': conferences_data
        })

    except Exception as e:
        return cors_json_response({
            'count': 0,
            'next': None,
            'previous': None,
            'results': [],
            'error': str(e)
        }, status=500)


# ==================== VUES DRF POUR LE FRONTEND ====================
# Les vues DRF sont désactivées pour éviter les problèmes d'imports

@csrf_exempt
def api_event_by_slug(request, slug):
    """API pour récupérer un événement par son slug"""
    
    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'ok'})
    
    try:
        event = Event.objects.filter(
            slug=slug,
            status='published',
            is_public=True
        ).select_related('category', 'organizer').first()
        
        if not event:
            return cors_json_response({
                'success': False,
                'error': 'Événement non trouvé'
            }, status=404)
        
        # Préparer les données complètes de l'événement
        event_data = {
            'id': event.id,
            'title_fr': event.title_fr,
            'title_ar': event.title_ar,
            'slug': event.slug,
            'description_fr': event.description_fr,
            'description_ar': event.description_ar,
            'content_fr': getattr(event, 'content_fr', None),
            'content_ar': getattr(event, 'content_ar', None),
            'category': {
                'id': event.category.id,
                'name_fr': event.category.name_fr,
                'name_ar': event.category.name_ar,
            } if event.category else None,
            'start_date': event.start_date.isoformat() if event.start_date else None,
            'end_date': event.end_date.isoformat() if event.end_date else None,
            'registration_deadline': event.registration_deadline.isoformat() if event.registration_deadline else None,
            'location': event.location,
            'address': event.address,
            'room': event.room,
            'max_participants': event.max_participants,
            'registration_required': event.registration_required,
            'registration_fee': float(event.registration_fee) if event.registration_fee else 0,
            'status': event.status,
            'priority': event.priority,
            'is_featured': event.is_featured,
            'is_public': event.is_public,
            'is_upcoming': event.is_upcoming,
            'is_ongoing': event.is_ongoing,
            'is_past': event.is_past,
            'registration_open': event.registration_open,
            'available_spots': event.available_spots,
            'organizer': {
                'id': event.organizer.id,
                'name': event.organizer.get_full_name() or event.organizer.username,
                'email': event.organizer.email,
            } if event.organizer else None,
            'views_count': event.views_count,
            'created_at': event.created_at.isoformat(),
            'updated_at': event.updated_at.isoformat() if event.updated_at else None,
            'published_at': event.published_at.isoformat() if event.published_at else None,
        }
        
        # Ajouter l'URL de l'image si elle existe
        if event.image:
            event_data['image_url'] = request.build_absolute_uri(event.image.url)
            event_data['image'] = event.image.url
        
        # Ajouter la pièce jointe si elle existe
        if event.attachment:
            event_data['attachment_url'] = request.build_absolute_uri(event.attachment.url)
        
        return cors_json_response({
            'success': True,
            'event': event_data
        })
        
    except Exception as e:
        return cors_json_response({
            'success': False,
            'error': str(e)
        }, status=500)


@staff_member_required
def events_statistics(request):
    """Statistiques détaillées des événements"""

    # Statistiques générales
    total_events = Event.objects.count()
    published_events = Event.objects.filter(status='published').count()
    upcoming_events = Event.objects.filter(
        status='published',
        start_date__gt=timezone.now()
    ).count()

    # Événements par catégorie
    events_by_category = list(
        EventCategory.objects.annotate(
            events_count=Count('event')
        ).values('name_fr', 'events_count', 'color')
    )

    # Inscriptions par mois (6 derniers mois)
    from django.db.models.functions import TruncMonth
    from datetime import datetime, timedelta

    six_months_ago = timezone.now() - timedelta(days=180)
    registrations_by_month = list(
        EventRegistration.objects.filter(
            registered_at__gte=six_months_ago
        ).annotate(
            month=TruncMonth('registered_at')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')
    )

    # Événements populaires
    popular_events = Event.objects.filter(
        status='published'
    ).annotate(
        registrations_count=Count('registrations')
    ).order_by('-registrations_count')[:10]

    context = {
        'stats': {
            'total_events': total_events,
            'published_events': published_events,
            'upcoming_events': upcoming_events,
        },
        'events_by_category': events_by_category,
        'registrations_by_month': registrations_by_month,
        'popular_events': popular_events,
    }

    return render(request, 'dashboard/events_statistics.html', context)
