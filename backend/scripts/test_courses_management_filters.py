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
user, created = User.objects.get_or_create(username='test_admin2', defaults={'email':'test_admin2@example.com','is_superuser':True,'is_staff':True})
if created:
    user.set_password('password')
    user.save()

category, _ = CourseCategory.objects.get_or_create(name_fr='Filter Test Cat', name_ar='اختبار فلتر')

client = Client()
client.force_login(user)

# Clean up any existing test courses
Course.objects.filter(title_fr__contains='Filter Test Course').delete()

# Create a regular course (non-OHB)
course_normal = Course.objects.create(
    title_fr='Filter Test Course - Normal',
    description_fr='Normal course',
    category=category,
    duration_weeks=2,
    level='beginner',
    course_type='school',
    status='published',
    created_by=user,
    slug='filter-test-course-normal'
)

# Create an OHB course
course_ohb = Course.objects.create(
    title_fr='Filter Test Course - OHB',
    description_fr='OHB course',
    category=category,
    duration_weeks=2,
    level='beginner',
    course_type='ohb',
    status='published',
    created_by=user,
    slug='filter-test-course-ohb'
)

response = client.get('/dashboard/courses/')
content = response.content.decode('utf-8')
print('Courses page status:', response.status_code)
print('Contains normal course:', 'Filter Test Course - Normal' in content)
print('Contains OHB course:', 'Filter Test Course - OHB' in content)

response_ohb = client.get('/dashboard/courses/?type=ohb')
content_ohb = response_ohb.content.decode('utf-8')
print('Courses page (type=ohb) status:', response_ohb.status_code)
print('Contains normal course (ohb filter):', 'Filter Test Course - Normal' in content_ohb)
print('Contains OHB course (ohb filter):', 'Filter Test Course - OHB' in content_ohb)
