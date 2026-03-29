from django.core.management.base import BaseCommand
from reviews.models import Review


class Command(BaseCommand):
    help = 'Add sample reviews for testing'

    def handle(self, *args, **options):
        sample_reviews = [
            {
                'author_name': 'Ahmad Hassan',
                'author_role': 'student',
                'content_fr': 'Cette école a transformé ma vie. Les professeurs sont excellents et le programme est très enrichissant.',
                'content_ar': 'غيرت هذه المدرسة حياتي. المعلمون ممتازون والبرنامج غني جداً.',
                'rating': 5,
                'is_published': True,
            },
            {
                'author_name': 'Fatima Al-Mansouri',
                'author_role': 'student',
                'content_fr': 'Les installations sont modernes et l\'environnement d\'apprentissage est très motivant.',
                'content_ar': 'المرافق حديثة وبيئة التعلم محفزة جداً.',
                'rating': 5,
                'is_published': True,
            },
            {
                'author_name': 'Mohammed Khalil',
                'author_role': 'sponsor',
                'content_fr': 'Nous sommes très satisfaits des progrès de nos enfants. L\'école offre un excellent suivi.',
                'content_ar': 'نحن راضون جداً عن تقدم أطفالنا. توفر المدرسة متابعة ممتازة.',
                'rating': 5,
                'is_published': True,
            },
            {
                'author_name': 'Zainab Mohamed',
                'author_role': 'visitor',
                'content_fr': 'Impressionné par la qualité des installations et l\'implication du personnel.',
                'content_ar': 'انطباعي رائع حول جودة المرافق وتفاني الموظفين.',
                'rating': 4,
                'is_published': True,
            },
            {
                'author_name': 'Dr. Ahmed Samir',
                'author_role': 'staff',
                'content_fr': 'C\'est un honneur de travailler dans une institution aussi dynamique et innovante.',
                'content_ar': 'إنه شرف العمل في مؤسسة ديناميكية ومبتكرة مثل هذه.',
                'rating': 5,
                'is_published': True,
            },
            {
                'author_name': 'Noor Al-Rashid',
                'author_role': 'student',
                'content_fr': 'Les cours sont intéressants et les professeurs nous aident vraiment à réussir.',
                'content_ar': 'الدروس مثيرة للاهتمام والمعلمون يساعدونونا حقاً في النجاح.',
                'rating': 5,
                'is_published': True,
            },
        ]

        for review_data in sample_reviews:
            review, created = Review.objects.get_or_create(
                author_name=review_data['author_name'],
                defaults=review_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created review by {review.author_name}')
                )
            else:
                self.stdout.write(f'Review by {review.author_name} already exists')

        self.stdout.write(self.style.SUCCESS('Sample reviews added successfully'))
