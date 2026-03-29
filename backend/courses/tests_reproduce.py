from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from courses.models import Course, CourseCategory

class AdminReproductionTest(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
        self.client = Client()
        self.client.force_login(self.user)
        
        category = CourseCategory.objects.create(name_fr="Test Category", name_ar="Test Cat Ar")
        Course.objects.create(
            title_fr="Test Course",
            title_ar="Test Course Ar",
            slug="test-reproduce-issue",
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

    def test_admin_course_changelist(self):
        try:
            print("Testing Course Admin...")
            response = self.client.get('/admin/courses/course/')
            self.assertEqual(response.status_code, 200)
        except Exception as e:
            print(f"Course Admin Failed: {e}")
            import traceback
            traceback.print_exc()

    def test_admin_category_changelist(self):
        try:
            print("Testing Category Admin...")
            response = self.client.get('/admin/courses/coursecategory/')
            self.assertEqual(response.status_code, 200)
        except Exception as e:
            print(f"Category Admin Failed: {e}")
            import traceback
            traceback.print_exc()
