#!/usr/bin/env python3
import os
import sys
import django
from pathlib import Path

# Setup Django environment
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Course, CourseCategory

def test_course_creation():
    print("Testing course creation...")
    
    # Get or create a user
    User = get_user_model()
    user, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"Created user: {user.email}")
    else:
        print(f"Using existing user: {user.email}")
    
    # Get or create a category
    category, created = CourseCategory.objects.get_or_create(
        name_fr='Test Category',
        name_ar='فئة اختبار',
        defaults={
            'description_fr': 'Test category description',
            'description_ar': 'وصف فئة الاختبار',
        }
    )
    if created:
        print(f"Created category: {category.name_fr}")
    else:
        print(f"Using existing category: {category.name_fr}")
    
    # Create a course
    course = Course.objects.create(
        title_fr='Test Course French',
        title_ar='دورة اختبار عربية',
        title_en='Test Course English',  # This should be saved
        label='Test Label',
        course_type='school',
        category=category,
        level='beginner',
        duration_weeks=4,
        duration_hours=20,
        max_students=30,
        description_fr='Test description in French',
        description_ar='وصف الاختبار بالعربية',
        description_en='Test description in English',
        content_fr='Test content in French',
        content_ar='محتوى الاختبار بالعربية',
        price=0.00,
        is_free=True,
        registration_open=True,
        status='draft',
        created_by=user,
    )
    
    print(f"Created course: {course.title_fr}")
    print(f"Course title_en: '{course.title_en}'")
    print(f"Course title_en is None: {course.title_en is None}")
    print(f"Course title_en is blank: {course.title_en == ''}")
    
    # Check if we can set an image (this would require an actual file)
    print("\nNote: To test image upload, you would need to provide an actual image file.")
    print("The image field is required (no blank=True/null=True) so it must be provided.")
    
    return course

if __name__ == '__main__':
    try:
        course = test_course_creation()
        print("\nTest completed successfully!")
    except Exception as e:
        print(f"\nError during test: {e}")
        import traceback
        traceback.print_exc()