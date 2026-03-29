"""
Commande pour créer les templates d'email par défaut
"""
from django.core.management.base import BaseCommand
from users.models import EmailTemplate


class Command(BaseCommand):
    help = 'Créer les templates d\'email par défaut'

    def handle(self, *args, **options):
        templates = [
            {
                'name': 'Email de bienvenue',
                'template_type': 'welcome',
                'subject': 'Bienvenue sur {{site_name}} !',
                'html_content': '''
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Bienvenue {{user_first_name}} !</h1>
                            <p>Votre compte a été créé avec succès</p>
                        </div>
                        <div class="content">
                            <h2>Bonjour {{user_name}},</h2>
                            <p>Nous sommes ravis de vous accueillir sur <strong>{{site_name}}</strong> !</p>
                            <p>Votre compte a été créé avec succès. Vous pouvez maintenant accéder à toutes nos fonctionnalités :</p>
                            <ul>
                                <li>📚 Consulter et vous inscrire aux cours</li>
                                <li>📖 Réserver des livres dans notre bibliothèque</li>
                                <li>📅 Participer aux événements</li>
                                <li>📰 Lire les dernières actualités</li>
                            </ul>
                            <div style="text-align: center;">
                                <a href="{{login_url}}" class="button">Se connecter</a>
                            </div>
                            <p>Si vous avez des questions, n'hésitez pas à nous contacter à <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>
                            <p>Cordialement,<br>L'équipe {{site_name}}</p>
                        </div>
                        <div class="footer">
                            <p>&copy; {{current_year}} {{site_name}}. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
                ''',
                'text_content': '''
                Bienvenue {{user_name}} !
                
                Nous sommes ravis de vous accueillir sur {{site_name}} !
                
                Votre compte a été créé avec succès. Vous pouvez maintenant accéder à toutes nos fonctionnalités :
                - Consulter et vous inscrire aux cours
                - Réserver des livres dans notre bibliothèque
                - Participer aux événements
                - Lire les dernières actualités
                
                Connectez-vous : {{login_url}}
                
                Si vous avez des questions, contactez-nous : {{support_email}}
                
                Cordialement,
                L'équipe {{site_name}}
                ''',
                'available_variables': 'user_name, user_first_name, user_email, site_name, login_url, support_email, current_year'
            },
            {
                'name': 'Inscription à un cours',
                'template_type': 'course_enrollment',
                'subject': 'Confirmation d\'inscription - {{course_title}}',
                'html_content': '''
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #28a745; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                        .course-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745; }
                        .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Inscription confirmée !</h1>
                        </div>
                        <div class="content">
                            <h2>Bonjour {{user_name}},</h2>
                            <p>Votre inscription au cours a été confirmée avec succès !</p>
                            <div class="course-info">
                                <h3>{{course_title}}</h3>
                                <p>{{course_description}}</p>
                            </div>
                            <p>Vous recevrez bientôt plus d'informations sur le déroulement du cours.</p>
                            <div style="text-align: center;">
                                <a href="{{course_url}}" class="button">Voir le cours</a>
                            </div>
                            <p>Cordialement,<br>L'équipe {{site_name}}</p>
                        </div>
                    </div>
                </body>
                </html>
                ''',
                'text_content': '''
                Inscription confirmée !
                
                Bonjour {{user_name}},
                
                Votre inscription au cours "{{course_title}}" a été confirmée avec succès !
                
                Description : {{course_description}}
                
                Vous recevrez bientôt plus d'informations sur le déroulement du cours.
                
                Voir le cours : {{course_url}}
                
                Cordialement,
                L'équipe {{site_name}}
                ''',
                'available_variables': 'user_name, course_title, course_description, course_url, site_name'
            },
            {
                'name': 'Réservation de livre',
                'template_type': 'book_reservation',
                'subject': 'Réservation confirmée - {{book_title}}',
                'html_content': '''
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #17a2b8; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                        .book-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #17a2b8; }
                        .button { display: inline-block; background: #17a2b8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📚 Réservation confirmée !</h1>
                        </div>
                        <div class="content">
                            <h2>Bonjour {{user_name}},</h2>
                            <p>Votre réservation de livre a été confirmée !</p>
                            <div class="book-info">
                                <h3>{{book_title}}</h3>
                                <p><strong>Auteur :</strong> {{book_author}}</p>
                            </div>
                            <p>Vous pouvez venir récupérer votre livre à la bibliothèque. N'oubliez pas d'apporter votre carte d'étudiant.</p>
                            <div style="text-align: center;">
                                <a href="{{library_url}}" class="button">Voir la bibliothèque</a>
                            </div>
                            <p>Cordialement,<br>L'équipe {{site_name}}</p>
                        </div>
                    </div>
                </body>
                </html>
                ''',
                'text_content': '''
                Réservation confirmée !
                
                Bonjour {{user_name}},
                
                Votre réservation du livre "{{book_title}}" par {{book_author}} a été confirmée !
                
                Vous pouvez venir récupérer votre livre à la bibliothèque. N'oubliez pas d'apporter votre carte d'étudiant.
                
                Voir la bibliothèque : {{library_url}}
                
                Cordialement,
                L'équipe {{site_name}}
                ''',
                'available_variables': 'user_name, book_title, book_author, library_url, site_name'
            },
            {
                'name': 'Notification administrateur',
                'template_type': 'admin_notification',
                'subject': 'Notification Admin - {{notification_subject}}',
                'html_content': '''
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                        .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                        .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔔 Notification Administrateur</h1>
                        </div>
                        <div class="content">
                            <h2>{{notification_subject}}</h2>
                            <div class="alert">
                                {{notification_message}}
                            </div>
                            <div style="text-align: center;">
                                <a href="{{admin_url}}" class="button">Accéder à l'administration</a>
                            </div>
                            <p>Cette notification a été générée automatiquement par le système {{site_name}}.</p>
                        </div>
                    </div>
                </body>
                </html>
                ''',
                'text_content': '''
                Notification Administrateur
                
                {{notification_subject}}
                
                {{notification_message}}
                
                Accéder à l'administration : {{admin_url}}
                
                Cette notification a été générée automatiquement par le système {{site_name}}.
                ''',
                'available_variables': 'notification_subject, notification_message, admin_url, site_name'
            }
        ]

        created_count = 0
        for template_data in templates:
            template, created = EmailTemplate.objects.get_or_create(
                template_type=template_data['template_type'],
                defaults=template_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Template créé: {template.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Template existe déjà: {template.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nTerminé ! {created_count} nouveaux templates créés.')
        )
