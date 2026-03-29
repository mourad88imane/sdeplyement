import os
import django
import sys
import json
from django.conf import settings
# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "school_backend.settings")
django.setup()

from rest_framework.test import APIRequestFactory
from courses.models import Course, CourseCategory
from courses.views import popular_courses
from django.contrib.auth import get_user_model

def test_course_types():
    print("Creating test data for Course Types...")
    
    User = get_user_model()
    user = User.objects.first()
    if not user:
        user = User.objects.create_superuser('admin_test_types', 'admin_types@example.com', 'password123')

    category, _ = CourseCategory.objects.get_or_create(name_fr="Test Cat", name_ar="Test Cat Ar")

    # Create OHB Course
    course_ohb = Course.objects.create(
        title_fr="OHB Course",
        title_ar="OHB Ar",
        slug="ohb-course-test",
        category=category,
        level="beginner", duration_weeks=1,
        status="published",
        course_type="ohb",
        created_by=user,
        views_count=100
    )

    # Create School Course
    course_school = Course.objects.create(
        title_fr="School Course",
        title_ar="School Ar",
        slug="school-course-test",
        category=category,
        level="beginner", duration_weeks=1,
        status="published",
        course_type="school",
        created_by=user,
        views_count=200 
    )

    factory = APIRequestFactory()

    # Test Default (should be OHB)
    print("Testing Default (expecting OHB)...")
    request = factory.get('/api/courses/popular/')
    response = popular_courses(request)
    data = response.data
    found_ohb = any(c['id'] == course_ohb.id for c in data)
    found_school = any(c['id'] == course_school.id for c in data)
    
    if found_ohb and not found_school:
        print("SUCCESS: Default returned OHB only.")
    else:
        print(f"FAILURE: Default. OHB found: {found_ohb}, School found: {found_school}")
        
    # Test Explicit OHB
    print("Testing ?type=ohb...")
    request = factory.get('/api/courses/popular/?type=ohb')
    response = popular_courses(request)
    data = response.data
    found_ohb = any(c['id'] == course_ohb.id for c in data)
    found_school = any(c['id'] == course_school.id for c in data)
    
    if found_ohb and not found_school:
        print("SUCCESS: Explicit OHB returned OHB only.")
    else:
         print(f"FAILURE: ?type=ohb. OHB found: {found_ohb}, School found: {found_school}")

    # Test School
    print("Testing ?type=school...")
    request = factory.get('/api/courses/popular/?type=school')
    response = popular_courses(request)
    data = response.data
    found_ohb = any(c['id'] == course_ohb.id for c in data)
    found_school = any(c['id'] == course_school.id for c in data)
    
    if found_school and not found_ohb:
        print("SUCCESS: School returned School only.")
    else:
         print(f"FAILURE: ?type=school. OHB found: {found_ohb}, School found: {found_school}")

    # Cleanup
    course_ohb.delete()
    course_school.delete()

if __name__ == "__main__":
    try:
        test_course_types()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
