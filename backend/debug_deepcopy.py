
import os
import django
import copy
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "school_backend.settings")
django.setup()

from django.contrib.admin.sites import AdminSite
from courses.models import Course
from courses.admin import CourseAdmin

def debug_deepcopy():
    print("Debugging deepcopy on Admin classes...")
    site = AdminSite()
    
    print("Instantiating CourseAdmin...")
    ma = CourseAdmin(Course, site)
    
    print("Inspecting CourseAdmin instance attributes...")
    for k, v in ma.__dict__.items():
        print(f"Key: {k}, Type: {type(v)}")
        if isinstance(v, type(sys)):
            print(f"!!! FOUND MODULE: {k} -> {v}")

    print("Deepcopying CourseAdmin instance...")
    try:
        ma_copy = copy.deepcopy(ma)
        print("SUCCESS: CourseAdmin deepcopy worked.")
    except Exception as e:
        print(f"FAILURE: CourseAdmin deepcopy failed: {e}")
        import traceback
        traceback.print_exc()

    # print("\nChecking Inlines...")
    # inlines = [CourseModuleInline, CourseInstructorInline]
    # for InlineClass in inlines:
    #     print(f"Instantiating {InlineClass.__name__}...")
    #     inline_instance = InlineClass(Course, site)
    #     print(f"Deepcopying {InlineClass.__name__} instance...")
    #     try:
    #         inline_copy = copy.deepcopy(inline_instance)
    #         print(f"SUCCESS: {InlineClass.__name__} deepcopy worked.")
    #     except Exception as e:
    #         print(f"FAILURE: {InlineClass.__name__} deepcopy failed: {e}")
    #         import traceback
    #         traceback.print_exc()

if __name__ == "__main__":
    with open('debug_result.txt', 'w', encoding='utf-8') as f:
        try:
            sys.stdout = f
            sys.stderr = f
            debug_deepcopy()
        except Exception as e:
            import traceback
            traceback.print_exc(file=f)
