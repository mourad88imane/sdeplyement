from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings

from .models import ContactMessage
from .serializers import ContactMessageSerializer, ContactMessageCreateSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_contact(request):
    """
    API endpoint to submit a contact form.
    Accepts POST requests with name, email, subject, message, and optional phone.
    """
    serializer = ContactMessageCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        # Save the contact message to database
        contact = ContactMessage.objects.create(
            name=serializer.validated_data['name'],
            email=serializer.validated_data['email'],
            subject=serializer.validated_data['subject'],
            message=serializer.validated_data['message'],
            phone=serializer.validated_data.get('phone', '')
        )
        
        # Optionally send notification email to admin
        try:
            send_mail(
                subject=f"Nouveau message de contact: {contact.subject}",
                message=f"""
Nouveau message de contact reçu:

Nom: {contact.name}
Email: {contact.email}
Téléphone: {contact.phone}

Message:
{contact.message}
                """.strip(),
                from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@ent.tn',
                recipient_list=[getattr(settings, 'CONTACT_EMAIL', 'admin@ent.tn')],
                fail_silently=True,
            )
        except Exception:
            # Email sending is optional, don't fail if it doesn't work
            pass
        
        return Response({
            'success': True,
            'message': 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            'data': ContactMessageSerializer(contact).data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'message': 'Erreur lors de l\'envoi du message.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def contact_info(request):
    """
    API endpoint to get contact information.
    """
    return Response({
        'success': True,
        'data': {
            'email': 'contact@ent.tn',
            'phone': '+216 70 123 456',
            'address': 'École Nationale des Transmissions',
            'city': 'Tunis',
            'country': 'Tunisie',
            'working_hours': 'Lundi - Vendredi: 8h00 - 17h00'
        }
    })
