
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "school_backend.settings")
django.setup()

from courses.models import Course, CourseCategory
from django.contrib.auth import get_user_model

def create_dummy():
    User = get_user_model()
    user = User.objects.first()
    if not user:
        user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
    
    category, _ = CourseCategory.objects.get_or_create(name_fr="Test Category", name_ar="Test Cat Ar")
    
    course, created = Course.objects.get_or_create(
        slug="test-http-reproduce",
        defaults={
            "title_fr": "Test Course HTTP",
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
    print(f"Created course: {course.id}")

if __name__ == "__main__":
    create_dummy()
