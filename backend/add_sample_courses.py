#!/usr/bin/env python3
"""
Script pour ajouter des cours d'exemple
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
django.setup()

from django.contrib.auth.models import User
from courses.models import CourseCategory, Course

def create_sample_courses():
    """Créer des cours d'exemple"""

    # Récupérer l'utilisateur admin
    try:
        admin_user = User.objects.get(username='admin')
    except User.DoesNotExist:
        print("Utilisateur admin non trouvé. Créez d'abord un superutilisateur.")
        return

    # Créer des catégories si elles n'existent pas
    categories_data = [
        {
            'name_fr': 'Réseaux et Télécommunications',
            'name_ar': 'الشبكات والاتصالات',
            'description_fr': 'Cours sur les réseaux et technologies de télécommunications',
            'description_ar': 'دورات حول الشبكات وتقنيات الاتصالات',
            'icon': 'network'
        },
        {
            'name_fr': 'Cybersécurité',
            'name_ar': 'الأمن السيبراني',
            'description_fr': 'Formation en sécurité informatique et protection des données',
            'description_ar': 'تكوين في الأمن المعلوماتي وحماية البيانات',
            'icon': 'shield'
        },
        {
            'name_fr': 'Intelligence Artificielle',
            'name_ar': 'الذكاء الاصطناعي',
            'description_fr': 'Cours sur l\'IA et le machine learning',
            'description_ar': 'دورات حول الذكاء الاصطناعي والتعلم الآلي',
            'icon': 'cpu'
        }
    ]

    categories = {}
    for cat_data in categories_data:
        category, created = CourseCategory.objects.get_or_create(
            name_fr=cat_data['name_fr'],
            defaults=cat_data
        )
        categories[cat_data['name_fr']] = category
        if created:
            print(f"✓ Catégorie créée: {category.name_fr}")

    # Créer des cours d'exemple
    courses_data = [
        {
            'title_fr': 'Réseaux 5G et Technologies Avancées',
            'title_ar': 'شبكات الجيل الخامس والتقنيات المتقدمة',
            'slug': 'reseaux-5g-technologies-avancees',
            'description_fr': 'Formation approfondie sur les technologies 5G, l\'Internet des objets (IoT) et les réseaux intelligents. Ce cours couvre les aspects techniques, l\'architecture réseau et les applications pratiques.',
            'description_ar': 'تكوين معمق حول تقنيات الجيل الخامس وإنترنت الأشياء والشبكات الذكية. يغطي هذا المساق الجوانب التقنية وهندسة الشبكات والتطبيقات العملية.',
            'objectives_fr': '''• Comprendre l'architecture des réseaux 5G
• Maîtriser les protocoles de communication avancés
• Implémenter des solutions IoT
• Optimiser les performances réseau
• Gérer la sécurité des réseaux intelligents''',
            'objectives_ar': '''• فهم هندسة شبكات الجيل الخامس
• إتقان بروتوكولات الاتصال المتقدمة
• تطبيق حلول إنترنت الأشياء
• تحسين أداء الشبكة
• إدارة أمن الشبكات الذكية''',
            'prerequisites_fr': '''• Diplôme en télécommunications ou équivalent
• Expérience en réseaux informatiques
• Connaissances en protocoles TCP/IP
• Bases en programmation''',
            'prerequisites_ar': '''• شهادة في الاتصالات أو ما يعادلها
• خبرة في الشبكات المعلوماتية
• معرفة ببروتوكولات TCP/IP
• أساسيات البرمجة''',
            'category': categories['Réseaux et Télécommunications'],
            'level': 'advanced',
            'duration_weeks': 8,
            'duration_hours': 40,
            'max_students': 25,
            'price': '15000.00',
            'is_free': False,
            'registration_open': True,
            'start_date': datetime.now() + timedelta(days=30),
            'end_date': datetime.now() + timedelta(days=86),
            'featured': True,
            'status': 'published'
        },
        {
            'title_fr': 'Cybersécurité et Protection des Réseaux',
            'title_ar': 'الأمن السيبراني وحماية الشبكات',
            'slug': 'cybersecurite-protection-reseaux',
            'description_fr': 'Techniques avancées de sécurisation des infrastructures de télécommunications et protection contre les cyberattaques. Inclut la cryptographie, la détection d\'intrusions et la réponse aux incidents.',
            'description_ar': 'تقنيات متقدمة لتأمين البنية التحتية للاتصالات والحماية من الهجمات السيبرانية. يشمل التشفير واكتشاف التسلل والاستجابة للحوادث.',
            'objectives_fr': '''• Identifier les vulnérabilités des systèmes
• Implémenter des solutions de cryptographie
• Détecter et analyser les intrusions
• Gérer les incidents de sécurité
• Auditer la sécurité des réseaux''',
            'objectives_ar': '''• تحديد نقاط ضعف الأنظمة
• تطبيق حلول التشفير
• اكتشاف وتحليل التسلل
• إدارة حوادث الأمن
• مراجعة أمن الشبكات''',
            'prerequisites_fr': '''• Connaissances en réseaux informatiques
• Bases en administration système
• Compréhension des protocoles réseau
• Expérience en informatique''',
            'prerequisites_ar': '''• معرفة بالشبكات المعلوماتية
• أساسيات إدارة الأنظمة
• فهم بروتوكولات الشبكة
• خبرة في المعلوماتية''',
            'category': categories['Cybersécurité'],
            'level': 'advanced',
            'duration_weeks': 10,
            'duration_hours': 50,
            'max_students': 20,
            'price': '18000.00',
            'is_free': False,
            'registration_open': True,
            'start_date': datetime.now() + timedelta(days=45),
            'end_date': datetime.now() + timedelta(days=115),
            'featured': True,
            'status': 'published'
        },
        {
            'title_fr': 'Intelligence Artificielle en Télécommunications',
            'title_ar': 'الذكاء الاصطناعي في الاتصالات',
            'slug': 'ia-transmissionss',
            'description_fr': 'Application de l\'IA et du machine learning dans l\'optimisation des réseaux de télécommunications. Couvre les algorithmes d\'apprentissage, l\'analyse prédictive et l\'automatisation.',
            'description_ar': 'تطبيق الذكاء الاصطناعي والتعلم الآلي في تحسين شبكات الاتصالات. يغطي خوارزميات التعلم والتحليل التنبؤي والأتمتة.',
            'category': categories['Intelligence Artificielle'],
            'level': 'expert',
            'duration_weeks': 12,
            'duration_hours': 60,
            'max_students': 15,
            'price': '22000.00',
            'is_free': False,
            'registration_open': True,
            'start_date': datetime.now() + timedelta(days=60),
            'end_date': datetime.now() + timedelta(days=144),
            'featured': False,
            'status': 'published'
        },
        {
            'title_fr': 'Fibre Optique et Technologies Haut Débit',
            'title_ar': 'الألياف البصرية وتقنيات النطاق العريض',
            'slug': 'fibre-optique-haut-debit',
            'description_fr': 'Installation, maintenance et optimisation des réseaux en fibre optique. Formation pratique sur les équipements, les techniques de soudure et les tests de performance.',
            'description_ar': 'تركيب وصيانة وتحسين شبكات الألياف البصرية. تدريب عملي على المعدات وتقنيات اللحام واختبارات الأداء.',
            'category': categories['Réseaux et Télécommunications'],
            'level': 'intermediate',
            'duration_weeks': 6,
            'duration_hours': 30,
            'max_students': 30,
            'price': '12000.00',
            'is_free': False,
            'registration_open': True,
            'start_date': datetime.now() + timedelta(days=20),
            'end_date': datetime.now() + timedelta(days=62),
            'featured': False,
            'status': 'published'
        },
        {
            'title_fr': 'Introduction aux Télécommunications',
            'title_ar': 'مقدمة في الاتصالات',
            'slug': 'introduction-transmissionss',
            'description_fr': 'Cours d\'introduction aux concepts fondamentaux des télécommunications. Idéal pour les débutants souhaitant comprendre les bases du domaine.',
            'description_ar': 'مساق تمهيدي للمفاهيم الأساسية في الاتصالات. مثالي للمبتدئين الراغبين في فهم أساسيات المجال.',
            'category': categories['Réseaux et Télécommunications'],
            'level': 'beginner',
            'duration_weeks': 4,
            'duration_hours': 20,
            'max_students': 50,
            'price': '0.00',
            'is_free': True,
            'registration_open': True,
            'start_date': datetime.now() + timedelta(days=15),
            'end_date': datetime.now() + timedelta(days=43),
            'featured': True,
            'status': 'published'
        },
        {
            'title_fr': 'Sécurité des Systèmes Embarqués',
            'title_ar': 'أمن الأنظمة المدمجة',
            'slug': 'securite-systemes-embarques',
            'description_fr': 'Sécurisation des dispositifs IoT et systèmes embarqués dans les télécommunications. Couvre les vulnérabilités, les protocoles sécurisés et les bonnes pratiques.',
            'description_ar': 'تأمين أجهزة إنترنت الأشياء والأنظمة المدمجة في الاتصالات. يغطي نقاط الضعف والبروتوكولات الآمنة والممارسات الجيدة.',
            'category': categories['Cybersécurité'],
            'level': 'intermediate',
            'duration_weeks': 8,
            'duration_hours': 40,
            'max_students': 25,
            'price': '16000.00',
            'is_free': False,
            'registration_open': False,
            'start_date': datetime.now() + timedelta(days=90),
            'end_date': datetime.now() + timedelta(days=146),
            'featured': False,
            'status': 'published'
        }
    ]

    for course_data in courses_data:
        course, created = Course.objects.get_or_create(
            slug=course_data['slug'],
            defaults={
                **course_data,
                'created_by': admin_user
                # Note: Les fichiers PDF et brochures doivent être ajoutés manuellement via l'admin Django
            }
        )
        if created:
            print(f"✓ Cours créé: {course.title_fr}")
        else:
            print(f"- Cours existe déjà: {course.title_fr}")

    print(f"\n✅ {Course.objects.count()} cours au total dans la base de données")

if __name__ == '__main__':
    print("🎓 CRÉATION DES COURS D'EXEMPLE")
    print("="*50)
    create_sample_courses()
    print("="*50)
    print("✅ Terminé! Vous pouvez maintenant voir les cours sur:")
    print("   - API: http://localhost:8000/api/courses/")
    print("   - Admin: http://localhost:8000/admin/courses/course/")
    print("   - Frontend: Page OHB")
