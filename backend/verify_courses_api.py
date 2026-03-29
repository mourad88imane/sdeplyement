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

def test_popular_courses_api():
    print("Creating test data...")
    
    # Get User
    User = get_user_model()
    user = User.objects.first()
    if not user:
        print("Creating superuser...")
        user = User.objects.create_superuser('admin_test', 'admin_test@example.com', 'password123')

    # Create category if needed
    category, _ = CourseCategory.objects.get_or_create(
        name_fr="Test Category",
        name_ar="Test Cat Ar"
    )

    # Create a course with label
    print("Creating Course...")
    course = Course.objects.create(
        title_fr="Test Bootcamp",
        title_ar="Bootcamp Ar",
        slug="test-bootcamp-verification",
        description_fr="Desc",
        description_ar="Desc Ar",
        content_fr="Content",
        content_ar="Content",
        category=category,
        level="beginner",
        duration_weeks=4,
        status="published",
        label="Bootcamp", # The new field
        created_by=user,
        views_count=500 # Ensure it shows up in popular
    )
    
    print("Calling API view...")
    factory = APIRequestFactory()
    request = factory.get('/api/courses/popular/')
    request.user = user # Authenticate if needed, though popular is public
    
    response = popular_courses(request)
    
    print(f"Status Code: {response.status_code}")
    success = False
    
    if response.status_code == 200:
        data = response.data
        print(f"Data received: {len(data)} courses")
        for item in data:
            if item['id'] == course.id:
                print(f"Found course: {item['title_fr']}")
                print(f"Label: {item.get('label')}")
                if item.get('label') == "Bootcamp":
                    print("SUCCESS: Label matches!")
                    success = True
                else:
                    print(f"FAILURE: Label mismatch. Got '{item.get('label')}'")
    else:
        print("FAILURE: API returned error.")
        
    # Cleanup
    print("Cleaning up...")
    course.delete()
    # Don't delete user or category as they might be used or pre-existing

    if not success:
        raise Exception("Verification Failed")

if __name__ == "__main__":
    try:
        test_popular_courses_api()
        print("VERIFICATION COMPLETED SUCCESSFULLY")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
