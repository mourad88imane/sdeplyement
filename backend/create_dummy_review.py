
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "school_backend.settings")
django.setup()

from reviews.models import Review
from django.contrib.auth import get_user_model

def create_dummy_review():
    User = get_user_model()
    user = User.objects.first()
    if not user:
        user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
    
    review, created = Review.objects.get_or_create(
        author_name="Test Author",
        defaults={
            "content_fr": "Test Content FR",
            "content_ar": "Test Content AR",
            "rating": 5,
            "created_by": user
        }
    )
    print(f"Created review: {review.id}")

if __name__ == "__main__":
    create_dummy_review()
