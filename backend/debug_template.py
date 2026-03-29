import os
import django
from django.conf import settings
from django.template import Template, Context

# Configure minimal Django settings
if not settings.configured:
    settings.configure(
        TEMPLATES=[{
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
        }],
        INSTALLED_APPS=['django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes'],
    )
    django.setup()

template_path = '/Users/imanebenmoussa/Documents/augment-projects/sites/site_full/backend/templates/admin/courses_management.html'

try:
    with open(template_path, 'r') as f:
        content = f.read()
    
    print(f"Reading file: {template_path}")
    t = Template(content)
    print("Template parsed successfully.")

except Exception as e:
    print(f"Error parsing template: {e}")
