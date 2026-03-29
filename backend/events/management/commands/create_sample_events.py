"""
Commande pour créer des événements d'exemple
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import timedelta
from events.models import EventCategory, Event


class Command(BaseCommand):
    help = 'Créer des événements d\'exemple'

    def handle(self, *args, **options):
        # Créer des catégories d'événements
        categories_data = [
            {
                'name_fr': 'Conférences',
                'name_ar': 'المؤتمرات',
                'description_fr': 'Conférences et séminaires académiques',
                'color': '#007bff',
                'icon': 'fas fa-microphone'
            },
            {
                'name_fr': 'Formations',
                'name_ar': 'التدريبات',
                'description_fr': 'Sessions de formation et ateliers',
                'color': '#28a745',
                'icon': 'fas fa-graduation-cap'
            },
            {
                'name_fr': 'Événements culturels',
                'name_ar': 'الأحداث الثقافية',
                'description_fr': 'Activités culturelles et artistiques',
                'color': '#ffc107',
                'icon': 'fas fa-palette'
            },
            {
                'name_fr': 'Sport',
                'name_ar': 'الرياضة',
                'description_fr': 'Événements sportifs et compétitions',
                'color': '#dc3545',
                'icon': 'fas fa-running'
            },
            {
                'name_fr': 'Réunions',
                'name_ar': 'الاجتماعات',
                'description_fr': 'Réunions administratives et assemblées',
                'color': '#6c757d',
                'icon': 'fas fa-users'
            }
        ]

        categories = []
        for cat_data in categories_data:
            category, created = EventCategory.objects.get_or_create(
                name_fr=cat_data['name_fr'],
                defaults=cat_data
            )
            categories.append(category)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Catégorie créée: {category.name_fr}')
                )

        # Obtenir un utilisateur admin pour créer les événements
        try:
            admin_user = User.objects.filter(is_staff=True).first()
            if not admin_user:
                admin_user = User.objects.create_user(
                    username='admin_events',
                    email='admin@ent-ecole.com',
                    password='admin123',
                    is_staff=True,
                    is_superuser=True
                )
                self.stdout.write(
                    self.style.SUCCESS('Utilisateur admin créé: admin_events')
                )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Erreur lors de la création de l\'admin: {e}')
            )
            return

        # Créer des événements d'exemple
        events_data = [
            {
                'title_fr': 'Conférence sur l\'Intelligence Artificielle',
                'title_ar': 'مؤتمر حول الذكاء الاصطناعي',
                'slug': 'conference-ia-2025',
                'description_fr': 'Une conférence passionnante sur les dernières avancées en intelligence artificielle et leur impact sur l\'éducation.',
                'category': categories[0],  # Conférences
                'start_date': timezone.now() + timedelta(days=15),
                'end_date': timezone.now() + timedelta(days=15, hours=3),
                'location': 'Amphithéâtre Principal',
                'room': 'Amphi A',
                'max_participants': 200,
                'registration_required': True,
                'status': 'published',
                'priority': 'high',
                'is_featured': True
            },
            {
                'title_fr': 'Atelier de Programmation Python',
                'title_ar': 'ورشة برمجة بايثون',
                'slug': 'atelier-python-debutants',
                'description_fr': 'Atelier pratique pour apprendre les bases de la programmation Python. Destiné aux débutants.',
                'category': categories[1],  # Formations
                'start_date': timezone.now() + timedelta(days=7),
                'end_date': timezone.now() + timedelta(days=7, hours=4),
                'location': 'Laboratoire Informatique',
                'room': 'Lab 1',
                'max_participants': 30,
                'registration_required': True,
                'status': 'published',
                'priority': 'normal'
            },
            {
                'title_fr': 'Soirée Culturelle Internationale',
                'title_ar': 'أمسية ثقافية دولية',
                'slug': 'soiree-culturelle-internationale',
                'description_fr': 'Une soirée pour célébrer la diversité culturelle de notre école avec des performances artistiques.',
                'category': categories[2],  # Événements culturels
                'start_date': timezone.now() + timedelta(days=20),
                'end_date': timezone.now() + timedelta(days=20, hours=4),
                'location': 'Salle des Fêtes',
                'max_participants': 150,
                'registration_required': True,
                'status': 'published',
                'priority': 'normal',
                'is_featured': True
            },
            {
                'title_fr': 'Tournoi de Football Inter-Classes',
                'title_ar': 'بطولة كرة القدم بين الفصول',
                'slug': 'tournoi-football-inter-classes',
                'description_fr': 'Compétition sportive amicale entre les différentes classes de l\'école.',
                'category': categories[3],  # Sport
                'start_date': timezone.now() + timedelta(days=10),
                'end_date': timezone.now() + timedelta(days=10, hours=6),
                'location': 'Terrain de Sport',
                'max_participants': 100,
                'registration_required': True,
                'status': 'published',
                'priority': 'normal'
            },
            {
                'title_fr': 'Assemblée Générale des Étudiants',
                'title_ar': 'الجمعية العامة للطلاب',
                'slug': 'assemblee-generale-etudiants',
                'description_fr': 'Réunion annuelle pour discuter des projets étudiants et élire les représentants.',
                'category': categories[4],  # Réunions
                'start_date': timezone.now() + timedelta(days=5),
                'end_date': timezone.now() + timedelta(days=5, hours=2),
                'location': 'Salle de Conférence',
                'room': 'Salle C1',
                'max_participants': 80,
                'registration_required': False,
                'status': 'published',
                'priority': 'urgent'
            },
            {
                'title_fr': 'Formation Cybersécurité',
                'title_ar': 'تدريب الأمن السيبراني',
                'slug': 'formation-cybersecurite',
                'description_fr': 'Formation avancée sur les techniques de cybersécurité et protection des données.',
                'category': categories[1],  # Formations
                'start_date': timezone.now() + timedelta(days=25),
                'end_date': timezone.now() + timedelta(days=25, hours=6),
                'location': 'Laboratoire Réseau',
                'room': 'Lab Réseau',
                'max_participants': 25,
                'registration_required': True,
                'registration_fee': 50.00,
                'status': 'published',
                'priority': 'high'
            }
        ]

        created_count = 0
        for event_data in events_data:
            event_data['organizer'] = admin_user
            event_data['created_by'] = admin_user
            
            event, created = Event.objects.get_or_create(
                slug=event_data['slug'],
                defaults=event_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Événement créé: {event.title_fr}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Événement existe déjà: {event.title_fr}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nTerminé ! {created_count} nouveaux événements créés.')
        )
