from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from news.models import AlumniSuccess

class Command(BaseCommand):
    help = 'Create a sample AlumniSuccess entry for the current year if it does not exist'

    def handle(self, *args, **options):
        User = get_user_model()
        admin = User.objects.filter(is_superuser=True).first() or User.objects.filter(is_staff=True).first()
        if not admin:
            self.stderr.write('No admin user found. Please create a superuser first.')
            return

        slug = 'succès-2025'
        obj, created = AlumniSuccess.objects.get_or_create(
            slug=slug,
            defaults={
                'title_fr': "Succès remarquable 2025",
                'title_ar': "نجاح مميز 2025",
                'year': 2025,
                'summary_fr': "Un ancien a obtenu un prix prestigieux en 2025.",
                'summary_ar': "حصل خريج على جائزة مرموقة في عام 2025.",
                'content_fr': "<p>Détails du succès pour 2025.</p>",
                'content_ar': "<p>تفاصيل النجاح لعام 2025.</p>",
                'author': admin,
                'featured': True,
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created AlumniSuccess: {obj.slug}'))
        else:
            self.stdout.write(self.style.NOTICE(f'AlumniSuccess already exists: {obj.slug}'))
