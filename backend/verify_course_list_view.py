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
from courses.views import CourseListView
from django.contrib.auth import get_user_model

def test_course_list_view_filtering():
    print("Creating test data for Course List View...")
    
    User = get_user_model()
    user = User.objects.first()
    if not user:
        user = User.objects.create_superuser('admin_list_test', 'admin_list@example.com', 'password123')

    category, _ = CourseCategory.objects.get_or_create(name_fr="Test Cat List", name_ar="Test Cat List Ar")

    # Create OHB Course
    course_ohb = Course.objects.create(
        title_fr="OHB List Course",
        title_ar="OHB List Ar",
        slug="ohb-list-test",
        category=category,
        level="beginner", duration_weeks=1,
        status="published",
        course_type="ohb",
        created_by=user
    )

    # Create School Course
    course_school = Course.objects.create(
        title_fr="School List Course",
        title_ar="School List Ar",
        slug="school-list-test",
        category=category,
        level="beginner", duration_weeks=1,
        status="published",
        course_type="school",
        created_by=user
    )

    factory = APIRequestFactory()
    view = CourseListView.as_view()

    # Test Default (should be ALL because CourseListView lists all published by default unless filtered)
    # Wait, in popular_courses I defaulted to OHB. In CourseListView, default is usually ALL.
    # The requirement was "OHB is different".
    # BestCourses uses "school", OHB page uses "ohb".
    # So default ListView should probably return ALL if no type specified, OR user didn't specify default behavior for ListView.
    # Let's assume default is ALL.
    
    print("Testing Default (expecting ALL)...")
    request = factory.get('/api/courses/')
    response = view(request)
    data = response.data['results'] if 'results' in response.data else response.data # Pagination?
    # View is ListCreateAPIView with pagination likely
    # Check if paginated. The previous response was list, but Generics usually paginate.
    # If paginated, data has 'results'.
    
    # If mocked request doesn't return paginated response directly if settings not loaded right, we'll see.
    # Usually `view(request)` returns Response.
    
    courses_list = data.get('results', data) if isinstance(data, dict) else data

    found_ohb = any(c['id'] == course_ohb.id for c in courses_list)
    found_school = any(c['id'] == course_school.id for c in courses_list)
    
    if found_ohb and found_school:
        print("SUCCESS: Default returned BOTH.")
    else:
        print(f"INFO: Default. OHB: {found_ohb}, School: {found_school}")

    # Test ?type=ohb
    print("Testing ?type=ohb...")
    request = factory.get('/api/courses/?type=ohb')
    response = view(request)
    data = response.data
    courses_list = data.get('results', data) if isinstance(data, dict) else data

    found_ohb = any(c['id'] == course_ohb.id for c in courses_list)
    found_school = any(c['id'] == course_school.id for c in courses_list)
    
    if found_ohb and not found_school:
        print("SUCCESS: OHB Filter worked.")
    else:
         print(f"FAILURE: ?type=ohb. OHB: {found_ohb}, School: {found_school}")
         
    # Test ?type=school
    print("Testing ?type=school...")
    request = factory.get('/api/courses/?type=school')
    response = view(request)
    data = response.data
    courses_list = data.get('results', data) if isinstance(data, dict) else data

    found_ohb = any(c['id'] == course_ohb.id for c in courses_list)
    found_school = any(c['id'] == course_school.id for c in courses_list)
    
    if found_school and not found_ohb:
        print("SUCCESS: School Filter worked.")
    else:
         print(f"FAILURE: ?type=school. OHB: {found_ohb}, School: {found_school}")

    # Cleanup
    course_ohb.delete()
    course_school.delete()

if __name__ == "__main__":
    try:
        test_course_list_view_filtering()
    except Exception as e:
        print(f"Error: {e}")
        # sys.exit(1) # Don't exit hard if it's just pagination diffs, let's see output
