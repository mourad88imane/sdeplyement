from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from courses.models import Course, CourseCategory

class AdminChangeViewReproductionTest(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
        self.client = Client()
        self.client.force_login(self.user)
        
        category = CourseCategory.objects.create(name_fr="Test Category", name_ar="Test Cat Ar")
        self.course = Course.objects.create(
            title_fr="Test Course",
            title_ar="Test Course Ar",
            slug="test-reproduce-change-issue",
            category=category,
            level="beginner",
            duration_weeks=1,
            created_by=self.user,
            description_fr="Desc",
            description_ar="Desc Ar",
            content_fr="Content",
            content_ar="Content Ar",
            status="published"
        )

    def test_admin_course_change_view(self):
        try:
            print(f"Testing Course Change View for ID {self.course.id}...")
            url = f'/admin/courses/course/{self.course.id}/change/'
            response = self.client.get(url)
            self.assertEqual(response.status_code, 200)
            print("Course Change View: OK")
        except Exception as e:
            print(f"Course Change View Failed: {e}")
            import traceback
            traceback.print_exc()
