#!/usr/bin/env python3
"""
Script pour ajouter des actualités d'exemple
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
django.setup()

from django.contrib.auth.models import User
from news.models import NewsCategory, News

def create_sample_news():
    """Créer des actualités d'exemple"""

    # Récupérer l'utilisateur admin
    try:
        admin_user = User.objects.get(username='admin')
    except User.DoesNotExist:
        print("Utilisateur admin non trouvé. Créez d'abord un superutilisateur.")
        return

    # Créer des catégories si elles n'existent pas
    categories_data = [
        {
            'name_fr': 'Actualités Générales',
            'name_ar': 'أخبار عامة',
            'description_fr': 'Actualités générales de l\'école',
            'description_ar': 'أخبار عامة للمدرسة',
            'color': '#3B82F6'
        },
        {
            'name_fr': 'Événements',
            'name_ar': 'فعاليات',
            'description_fr': 'Événements et activités de l\'école',
            'description_ar': 'فعاليات وأنشطة المدرسة',
            'color': '#10B981'
        },
        {
            'name_fr': 'Formations',
            'name_ar': 'تكوينات',
            'description_fr': 'Nouvelles formations et cours',
            'description_ar': 'تكوينات ودورات جديدة',
            'color': '#F59E0B'
        },
        {
            'name_fr': 'Annonces Importantes',
            'name_ar': 'إعلانات مهمة',
            'description_fr': 'Annonces importantes et urgentes',
            'description_ar': 'إعلانات مهمة وعاجلة',
            'color': '#EF4444'
        }
    ]

    categories = {}
    for cat_data in categories_data:
        category, created = NewsCategory.objects.get_or_create(
            name_fr=cat_data['name_fr'],
            defaults=cat_data
        )
        categories[cat_data['name_fr']] = category
        if created:
            print(f"✓ Catégorie créée: {category.name_fr}")

    # Créer des actualités d'exemple
    news_data = [
        {
            'title_fr': 'Nouvelle Formation en Cybersécurité',
            'title_ar': 'تكوين جديد في الأمن السيبراني',
            'slug': 'nouvelle-formation-cybersecurite',
            'summary_fr': 'L\'École Nationale des Transmissions lance une nouvelle formation spécialisée en cybersécurité pour répondre aux besoins croissants du marché.',
            'summary_ar': 'تطلق المدرسة الوطنية للمواصلات تكويناً جديداً متخصصاً في الأمن السيبراني لتلبية الاحتياجات المتزايدة للسوق.',
            'content_fr': '''Cette nouvelle formation de 6 mois couvre tous les aspects de la cybersécurité moderne, incluant la protection des infrastructures critiques, la détection d'intrusions, et la réponse aux incidents de sécurité.

Programme de la formation :
• Fondamentaux de la cybersécurité
• Protection des réseaux et systèmes
• Cryptographie et sécurité des données
• Détection et analyse des menaces
• Réponse aux incidents de sécurité
• Audit et conformité

Cette formation s'adresse aux professionnels IT souhaitant se spécialiser dans la cybersécurité et aux étudiants en télécommunications. Les participants bénéficieront d'un enseignement théorique et pratique dispensé par des experts du domaine.

Inscription ouverte jusqu'au 15 mars 2024.''',
            'content_ar': '''يغطي هذا التكوين الجديد لمدة 6 أشهر جميع جوانب الأمن السيبراني الحديث، بما في ذلك حماية البنية التحتية الحرجة واكتشاف التسلل والاستجابة لحوادث الأمن.

برنامج التكوين:
• أساسيات الأمن السيبراني
• حماية الشبكات والأنظمة
• التشفير وأمن البيانات
• اكتشاف وتحليل التهديدات
• الاستجابة لحوادث الأمن
• التدقيق والامتثال

يستهدف هذا التكوين المهنيين في مجال تكنولوجيا المعلومات الراغبين في التخصص في الأمن السيبراني والطلاب في مجال الاتصالات. سيستفيد المشاركون من تعليم نظري وعملي يقدمه خبراء في المجال.

التسجيل مفتوح حتى 15 مارس 2024.''',
            'category': categories['Formations'],
            'priority': 'high',
            'featured': True,
            'status': 'published',
            'event_date': datetime.now() + timedelta(days=30),
            'published_at': datetime.now() - timedelta(days=2)
        },
        {
            'title_fr': 'Journée Portes Ouvertes 2024',
            'title_ar': 'يوم الأبواب المفتوحة 2024',
            'slug': 'journee-portes-ouvertes-2024',
            'summary_fr': 'Venez découvrir nos formations et rencontrer nos étudiants et enseignants lors de notre journée portes ouvertes annuelle.',
            'summary_ar': 'تعال لاكتشاف تكويناتنا ولقاء طلابنا وأساتذتنا خلال يوم الأبواب المفتوحة السنوي.',
            'content_fr': 'Programme de la journée : présentation des formations, démonstrations techniques, rencontres avec les étudiants et les enseignants, visite des laboratoires.',
            'content_ar': 'برنامج اليوم: عرض التكوينات، عروض تقنية، لقاءات مع الطلاب والأساتذة، زيارة المختبرات.',
            'category': categories['Événements'],
            'priority': 'high',
            'featured': True,
            'status': 'published',
            'event_date': datetime.now() + timedelta(days=15),
            'published_at': datetime.now() - timedelta(days=5)
        },
        {
            'title_fr': 'Partenariat avec Orange Algérie',
            'title_ar': 'شراكة مع أورانج الجزائر',
            'slug': 'partenariat-orange-algerie',
            'summary_fr': 'Signature d\'un accord de partenariat stratégique avec Orange Algérie pour le développement des compétences en télécommunications.',
            'summary_ar': 'توقيع اتفاقية شراكة استراتيجية مع أورانج الجزائر لتطوير المهارات في مجال الاتصالات.',
            'content_fr': 'Ce partenariat permettra aux étudiants de bénéficier de stages pratiques et d\'opportunités d\'emploi chez Orange Algérie.',
            'content_ar': 'ستتيح هذه الشراكة للطلاب الاستفادة من التدريبات العملية وفرص العمل لدى أورانج الجزائر.',
            'category': categories['Actualités Générales'],
            'priority': 'normal',
            'featured': False,
            'status': 'published',
            'published_at': datetime.now() - timedelta(days=7)
        },
        {
            'title_fr': 'Conférence sur la 5G et l\'IoT',
            'title_ar': 'مؤتمر حول الجيل الخامس وإنترنت الأشياء',
            'slug': 'conference-5g-iot',
            'summary_fr': 'Conférence internationale sur les technologies 5G et l\'Internet des Objets avec la participation d\'experts internationaux.',
            'summary_ar': 'مؤتمر دولي حول تقنيات الجيل الخامس وإنترنت الأشياء بمشاركة خبراء دوليين.',
            'content_fr': 'La conférence abordera les dernières innovations en matière de 5G, les applications IoT et l\'impact sur l\'industrie des télécommunications.',
            'content_ar': 'سيتناول المؤتمر أحدث الابتكارات في مجال الجيل الخامس وتطبيقات إنترنت الأشياء والتأثير على صناعة الاتصالات.',
            'category': categories['Événements'],
            'priority': 'high',
            'featured': True,
            'status': 'published',
            'event_date': datetime.now() + timedelta(days=45),
            'published_at': datetime.now() - timedelta(days=10)
        },
        {
            'title_fr': 'Résultats des Examens de Fin d\'Année',
            'title_ar': 'نتائج امتحانات نهاية السنة',
            'slug': 'resultats-examens-fin-annee',
            'summary_fr': 'Publication des résultats des examens de fin d\'année académique 2023-2024.',
            'summary_ar': 'نشر نتائج امتحانات نهاية السنة الأكاديمية 2023-2024.',
            'content_fr': 'Les résultats sont disponibles sur le portail étudiant. Félicitations à tous les diplômés !',
            'content_ar': 'النتائج متاحة على البوابة الطلابية. تهانينا لجميع الخريجين!',
            'category': categories['Annonces Importantes'],
            'priority': 'urgent',
            'featured': False,
            'status': 'published',
            'published_at': datetime.now() - timedelta(days=1)
        },
        {
            'title_fr': 'Atelier de Programmation Python',
            'title_ar': 'ورشة برمجة بايثون',
            'slug': 'atelier-programmation-python',
            'summary_fr': 'Atelier pratique de programmation Python destiné aux étudiants de première année.',
            'summary_ar': 'ورشة عملية لبرمجة بايثون موجهة لطلاب السنة الأولى.',
            'content_fr': 'L\'atelier couvre les bases de Python, la programmation orientée objet et les applications en télécommunications.',
            'content_ar': 'تغطي الورشة أساسيات بايثون والبرمجة الكائنية والتطبيقات في الاتصالات.',
            'category': categories['Formations'],
            'priority': 'normal',
            'featured': False,
            'status': 'published',
            'event_date': datetime.now() + timedelta(days=20),
            'published_at': datetime.now() - timedelta(days=3)
        }
    ]

    for news_item in news_data:
        # Images par défaut selon la catégorie
        default_images = {
            'Formations': 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
            'Événements': 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
            'Actualités Générales': 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
            'Annonces Importantes': 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800'
        }

        category_name = news_item['category'].name_fr
        default_image = default_images.get(category_name, default_images['Actualités Générales'])

        article, created = News.objects.get_or_create(
            slug=news_item['slug'],
            defaults={
                **news_item,
                'author': admin_user,
                'featured_image': default_image,
                'image_alt_fr': news_item['title_fr'],
                'image_alt_ar': news_item['title_ar'],
                'reading_time': 3
            }
        )
        if created:
            print(f"✓ Actualité créée: {article.title_fr}")
        else:
            print(f"- Actualité existe déjà: {article.title_fr}")

    print(f"\n✅ {News.objects.count()} actualités au total dans la base de données")

if __name__ == '__main__':
    print("📰 CRÉATION DES ACTUALITÉS D'EXEMPLE")
    print("="*50)
    create_sample_news()
    print("="*50)
    print("✅ Terminé! Vous pouvez maintenant voir les actualités sur:")
    print("   - API: http://localhost:8000/api/news/")
    print("   - Admin: http://localhost:8000/admin/news/news/")
    print("   - Frontend: Page Events")
