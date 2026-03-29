from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.contrib.admin.sites import AdminSite
from courses.models import Course, CourseCategory
from courses.admin import CourseAdmin

class MockSuperUser:
    def has_perm(self, perm, obj=None):
        return True
    def has_module_perms(self, app_label):
        return True
    is_active = True
    is_staff = True
    pk = 1

class AdminChangeViewDeepReproductionTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        User = get_user_model()
        self.user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
        
        category = CourseCategory.objects.create(name_fr="Test Category", name_ar="Test Cat Ar")
        self.course = Course.objects.create(
            title_fr="Test Course",
            title_ar="Test Course Ar",
            slug="test-reproduce-change-deep",
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
        self.site = AdminSite()

    def test_admin_change_view_methods(self):
        try:
            ma = CourseAdmin(Course, self.site)
            request = self.factory.get(f'/admin/courses/course/{self.course.id}/change/')
            request.user = self.user
            
            print("Calling get_form...")
            form = ma.get_form(request, self.course)
            print(f"Form class: {form}")
            
            print("Calling get_fieldsets...")
            fieldsets = ma.get_fieldsets(request, self.course)
            print(f"Fieldsets: {len(fieldsets)}")
            
            print("Calling get_inline_instances...")
            inlines = ma.get_inline_instances(request, self.course)
            print(f"Inlines: {len(inlines)}")
            
            # This is where deepcopy usually happens in change_view
            print("Simulating change_view interactions...")
            # Django's change_view eventually calls get_formsets_with_inlines
            for inline in inlines:
                print(f"Checking inline: {inline}")
                # Check for attributes that might be missing on super() if shadowed
                if hasattr(inline, 'get_formset'):
                    fs = inline.get_formset(request, self.course)
                    print(f"Formset: {fs}")

        except Exception as e:
            print(f"Deep Reproduction Failed: {e}")
            import traceback
            traceback.print_exc()
