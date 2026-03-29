#!/usr/bin/env python3
"""
Script pour créer des brochures PDF d'exemple
"""

import os
import sys
import django
from io import BytesIO
from django.core.files.base import ContentFile

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
django.setup()

from courses.models import Course

def create_sample_pdf_content(course_title):
    """Créer un contenu PDF simple pour la brochure"""
    content = f"""
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
50 750 Td
(Brochure: {course_title}) Tj
0 -20 Td
(École Nationale des Transmissions) Tj
0 -20 Td
(Formation OHB) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000251 00000 n 
0000000404 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
481
%%EOF
""".strip()
    return content.encode('utf-8')

def create_sample_brochures():
    """Créer des brochures PDF d'exemple pour les cours"""
    
    print("📄 CRÉATION DES BROCHURES PDF D'EXEMPLE")
    print("="*50)
    
    courses = Course.objects.all()
    
    if not courses.exists():
        print("❌ Aucun cours trouvé. Exécutez d'abord add_sample_courses.py")
        return
    
    for course in courses:
        if not course.brochure_pdf:
            # Créer un contenu PDF simple
            pdf_content = create_sample_pdf_content(course.title_fr)
            
            # Créer un fichier ContentFile
            pdf_file = ContentFile(pdf_content, name=f"brochure_{course.slug}.pdf")
            
            # Assigner le fichier au cours
            course.brochure_pdf.save(f"brochure_{course.slug}.pdf", pdf_file, save=True)
            
            print(f"✓ Brochure créée pour: {course.title_fr}")
        else:
            print(f"- Brochure existe déjà pour: {course.title_fr}")
    
    print(f"\n✅ {Course.objects.exclude(brochure_pdf='').count()} brochures au total")
    print("="*50)
    print("📁 Les brochures sont disponibles dans:")
    print("   - Dossier: media/courses/brochures/")
    print("   - API: http://localhost:8000/api/courses/{id}/brochure/")
    print("   - Frontend: Bouton 'Télécharger brochure'")
    print("="*50)

if __name__ == '__main__':
    create_sample_brochures()
