import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')

import django
django.setup()
from django.test import Client
from django.contrib.auth import get_user_model
from courses.models import Course, CourseCategory

User = get_user_model()
user, created = User.objects.get_or_create(username='test_admin', defaults={'email':'test_admin@example.com','is_superuser':True,'is_staff':True})
if created:
    user.set_password('password')
    user.save()

category, _ = CourseCategory.objects.get_or_create(name_fr='Test Cat', name_ar='اختبار')

client = Client()
client.force_login(user)

post_data = {
    'title_fr': 'Test Slug Collision',
    'title_ar': 'اختبار تصادم Slug',
    'category': str(category.id),
    'duration': '4',
    'duration_hours': '30',
    'price': '0',
    'status': 'draft',
    'registration_open': 'on',
    'featured': 'on',
}

response = client.post('/dashboard/formation/add/', post_data, follow=True)
print('First create status', response.status_code)
print('First redirect chain:', response.redirect_chain)
print('First content snippet length:', len(response.content))
print('First content snippet contains "Erreur"?:', b'Erreur' in response.content)
if b'Erreur' in response.content:
    start = response.content.find(b'Erreur')
    print('First error message extract:', response.content[start:start+200])
print('First content snippet contains "Le titre en français"?:', b'Le titre en fran' in response.content)
if hasattr(response, 'context') and response.context:
    print('First context keys:', list(response.context.keys()))
    if 'messages' in response.context:
        print('First messages:', list(response.context['messages']))

response2 = client.post('/dashboard/formation/add/', post_data, follow=True)
print('Second create status', response2.status_code)
print('Second redirect chain:', response2.redirect_chain)
print('Second content snippet length:', len(response2.content))
print('Second content snippet contains "Erreur"?:', b'Erreur' in response2.content)
if b'Erreur' in response2.content:
    start = response2.content.find(b'Erreur')
    print('Second error message extract:', response2.content[start:start+200])
print('Second content snippet contains "Le titre en français"?:', b'Le titre en fran' in response2.content)
if hasattr(response2, 'context') and response2.context:
    print('Second context keys:', list(response2.context.keys()))
    if 'messages' in response2.context:
        print('Second messages:', list(response2.context['messages']))

qs = Course.objects.filter(title_fr='Test Slug Collision')
print('Count of created courses:', qs.count())
for c in qs:
    print(c.id, c.slug)
if not qs.exists():
    print('No courses found: check messages in redirect pages')
