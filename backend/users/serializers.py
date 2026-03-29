from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .models import UserProfile, UserActivity, UserNotification, AdminUserMessage, TeamMember

User = get_user_model()



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        exclude = ['user', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'is_active', 'date_joined', 'profile'
        ]
        read_only_fields = ['id', 'username', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    # Champs du profil
    user_type = serializers.ChoiceField(choices=UserProfile.USER_TYPE_CHOICES, default='visitor', required=False)
    phone = serializers.CharField(required=False, allow_blank=True)
    student_id = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'password', 'password_confirm', 'user_type', 'phone',
            'student_id', 'department'
        ]

    def validate(self, data):
        if 'password' in data and 'password_confirm' in data:
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cette adresse email est déjà utilisée.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return value

    def create(self, validated_data):
        # Extraire les données du profil
        profile_data = {
            'user_type': validated_data.pop('user_type', 'visitor'),
            'phone': validated_data.pop('phone', ''),
            'student_id': validated_data.pop('student_id', ''),
            'department': validated_data.pop('department', ''),
        }
        
        # Supprimer password_confirm
        validated_data.pop('password_confirm')

        # Créer l'utilisateur
        user = User.objects.create_user(**validated_data)

        # Ajouter is_verified=True après création si le champ existe (pour compatibilité avec le modèle User personnalisé)
        if hasattr(user, 'is_verified'):
            user.is_verified = True
            user.save()

        # Nettoyer les données du profil (convertir les chaînes vides en None pour les champs uniques)
        if 'student_id' in profile_data and profile_data['student_id'] == '':
            profile_data['student_id'] = None
        if 'employee_id' in profile_data and profile_data['employee_id'] == '':
            profile_data['employee_id'] = None

        # Créer ou récupérer le profil (le signal post_save peut déjà l'avoir créé)
        profile, created = UserProfile.objects.get_or_create(user=user, defaults=profile_data)

        # Si le profil existait déjà, mettre à jour les données
        if not created:
            for key, value in profile_data.items():
                setattr(profile, key, value)
            profile.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("Ce compte est désactivé.")
                data['user'] = user
            else:
                raise serializers.ValidationError("Nom d'utilisateur ou mot de passe incorrect.")
        else:
            raise serializers.ValidationError("Le nom d'utilisateur et le mot de passe sont requis.")

        return data


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    # Champs utilisateur
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = UserProfile
        fields = [
            'first_name', 'last_name', 'email', 'phone', 'address',
            'city', 'postal_code', 'country', 'birth_date', 'gender',
            'nationality', 'department', 'specialization', 'academic_year',
            'avatar', 'preferred_language', 'receive_notifications',
            'receive_newsletter'
        ]

    def update(self, instance, validated_data):
        # Mettre à jour les champs utilisateur
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Mettre à jour le profil
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError("Les nouveaux mots de passe ne correspondent pas.")
        return data

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("L'ancien mot de passe est incorrect.")
        return value


class UserActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = UserActivity
        fields = [
            'id', 'user_name', 'action', 'action_display',
            'description', 'ip_address', 'created_at'
        ]


class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = [
            'id', 'title', 'message', 'notification_type',
            'link_url', 'link_text', 'is_read', 'is_important',
            'created_at', 'expires_at'
        ]
        read_only_fields = ['created_at']


class UserStatsSerializer(serializers.Serializer):
    """Serializer pour les statistiques utilisateur"""
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    students = serializers.IntegerField()
    teachers = serializers.IntegerField()
    staff = serializers.IntegerField()
    verified_users = serializers.IntegerField()
    new_users_this_month = serializers.IntegerField()
    active_sessions = serializers.IntegerField()


class AdminUserMessageSerializer(serializers.ModelSerializer):
    """Serializer pour les messages administrateur-utilisateur"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    admin_name = serializers.CharField(source='admin.get_full_name', read_only=True)
    message_type_display = serializers.CharField(source='get_message_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = AdminUserMessage
        fields = [
            'id', 'user', 'user_name', 'user_email', 'admin', 'admin_name',
            'message_type', 'message_type_display', 'subject', 'message',
            'admin_response', 'status', 'status_display', 'is_urgent',
            'login_ip', 'login_device', 'login_location',
            'created_at', 'responded_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'responded_at']


class AdminUserMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un message utilisateur vers admin"""
    class Meta:
        model = AdminUserMessage
        fields = ['subject', 'message', 'is_urgent']

    def create(self, validated_data):
        # L'utilisateur sera défini dans la vue
        return super().create(validated_data)


class AdminResponseSerializer(serializers.Serializer):
    """Serializer pour les réponses administrateur"""
    admin_response = serializers.CharField(max_length=2000)

    def validate_admin_response(self, value):
        if not value.strip():
            raise serializers.ValidationError("La réponse ne peut pas être vide.")
        return value


class TeamMemberSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les membres de l'équipe"""
    class Meta:
        model = TeamMember
        fields = '__all__'

