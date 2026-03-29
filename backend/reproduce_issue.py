
import os
import django
from django.conf import settings
from django.test import RequestFactory
from django.contrib.admin.sites import AdminSite
from django.contrib.auth import get_user_model
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "school_backend.settings")
django.setup()

from courses.models import Course, CourseCategory
from courses.admin import CourseAdmin
from django.contrib import admin

def reproduce():
    print("Reproduction script running...")
    User = get_user_model()
    # Create a user if not exists
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'password')
    
    user = User.objects.get(username='admin')

    # Create dummy course
    category, _ = CourseCategory.objects.get_or_create(name_fr="Test Category", name_ar="Test Cat Ar")
    
    course, created = Course.objects.get_or_create(
        slug="test-reproduce-issue",
        defaults={
            "title_fr": "Test Course",
            "title_ar": "Test Course Ar",
            "category": category,
            "level": "beginner",
            "duration_weeks": 1,
            "created_by": user,
            "description_fr": "Desc",
            "description_ar": "Desc Ar",
            "content_fr": "Content",
            "content_ar": "Content Ar",
            "status": "published"
        }
    )
    
    print(f"Course created/found: {course}")

    site = AdminSite()
    admin_instance = CourseAdmin(Course, site)
    
    factory = RequestFactory()
    request = factory.get('/admin/courses/course/')
    request.user = user
    request.session = {}
    request.META = {}
    
    print("Calling get_queryset...")
    try:
        qs = admin_instance.get_queryset(request)
        print(f"QuerySet Count: {qs.count()}")
        for c in qs:
            print(f"Item: {c}")
    except Exception as e:
        print(f"Error in get_queryset: {e}")
        import traceback
        traceback.print_exc()

    print("Calling methods used in changelist...")
    
    try:
        list_display = admin_instance.get_list_display(request)
        print(f"List display: {list_display}")
    except Exception as e:
        print(f"Error in get_list_display: {e}")
        import traceback
        traceback.print_exc()

    # Try accessing fields
    qs = admin_instance.get_queryset(request)
    for obj in qs:
        for field_name in list_display:
            try:
                # This is what admin/changelist.py does effectively
                if hasattr(admin_instance, field_name):
                    # check if method on admin
                    attr = getattr(admin_instance, field_name)
                    if callable(attr):
                         # call it
                         pass
                elif hasattr(obj, field_name):
                    attr = getattr(obj, field_name)
                else:
                    # Lookups
                    pass
            except Exception as e:
                print(f"Error accessing {field_name} on {obj}: {e}")
                import traceback
                traceback.print_exc()

if __name__ == "__main__":
    try:
        reproduce()
    except Exception as e:
        print(f"Global Error: {e}")
        import traceback
        traceback.print_exc()
