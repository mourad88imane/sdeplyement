from django.core.management.base import BaseCommand
from events.models import EventCategory


class Command(BaseCommand):
    help = 'Créer les catégories d\'événements par défaut'

    def handle(self, *args, **options):
        categories = [
            {
                'name_fr': 'Conférences',
                'name_ar': 'المؤتمرات',
                'description_fr': 'Conférences académiques et professionnelles',
                'description_ar': 'المؤتمرات الأكاديمية والمهنية',
                'color': '#007bff',
                'icon': 'fas fa-microphone'
            },
            {
                'name_fr': 'Ateliers',
                'name_ar': 'ورش العمل',
                'description_fr': 'Ateliers pratiques et formations',
                'description_ar': 'ورش العمل العملية والتدريبات',
                'color': '#28a745',
                'icon': 'fas fa-tools'
            },
            {
                'name_fr': 'Formations',
                'name_ar': 'التدريبات',
                'description_fr': 'Sessions de formation et développement des compétences',
                'description_ar': 'جلسات التدريب وتطوير المهارات',
                'color': '#ffc107',
                'icon': 'fas fa-graduation-cap'
            },
            {
                'name_fr': 'Événements culturels',
                'name_ar': 'الأحداث الثقافية',
                'description_fr': 'Activités culturelles et artistiques',
                'description_ar': 'الأنشطة الثقافية والفنية',
                'color': '#e83e8c',
                'icon': 'fas fa-palette'
            },
            {
                'name_fr': 'Sport',
                'name_ar': 'الرياضة',
                'description_fr': 'Événements sportifs et compétitions',
                'description_ar': 'الأحداث الرياضية والمسابقات',
                'color': '#fd7e14',
                'icon': 'fas fa-running'
            },
            {
                'name_fr': 'Séminaires',
                'name_ar': 'الندوات',
                'description_fr': 'Séminaires éducatifs et informatifs',
                'description_ar': 'الندوات التعليمية والإعلامية',
                'color': '#6f42c1',
                'icon': 'fas fa-chalkboard-teacher'
            },
            {
                'name_fr': 'Réunions',
                'name_ar': 'الاجتماعات',
                'description_fr': 'Réunions administratives et de coordination',
                'description_ar': 'الاجتماعات الإدارية والتنسيقية',
                'color': '#6c757d',
                'icon': 'fas fa-users'
            },
            {
                'name_fr': 'Examens',
                'name_ar': 'الامتحانات',
                'description_fr': 'Sessions d\'examens et évaluations',
                'description_ar': 'جلسات الامتحانات والتقييمات',
                'color': '#dc3545',
                'icon': 'fas fa-file-alt'
            },
            {
                'name_fr': 'Orientation',
                'name_ar': 'التوجيه',
                'description_fr': 'Sessions d\'orientation pour nouveaux étudiants',
                'description_ar': 'جلسات التوجيه للطلاب الجدد',
                'color': '#17a2b8',
                'icon': 'fas fa-compass'
            },
            {
                'name_fr': 'Remise de diplômes',
                'name_ar': 'تسليم الشهادات',
                'description_fr': 'Cérémonies de remise de diplômes',
                'description_ar': 'حفلات تسليم الشهادات',
                'color': '#20c997',
                'icon': 'fas fa-medal'
            }
        ]

        created_count = 0
        updated_count = 0

        for cat_data in categories:
            category, created = EventCategory.objects.get_or_create(
                name_fr=cat_data['name_fr'],
                defaults=cat_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Catégorie créée: {category.name_fr}')
                )
            else:
                # Mettre à jour les champs si nécessaire
                updated = False
                for field, value in cat_data.items():
                    if getattr(category, field) != value:
                        setattr(category, field, value)
                        updated = True
                
                if updated:
                    category.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'🔄 Catégorie mise à jour: {category.name_fr}')
                    )
                else:
                    self.stdout.write(
                        self.style.HTTP_INFO(f'ℹ️  Catégorie existante: {category.name_fr}')
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n📊 Résumé:'
                f'\n   • {created_count} catégories créées'
                f'\n   • {updated_count} catégories mises à jour'
                f'\n   • {EventCategory.objects.count()} catégories au total'
            )
        )
