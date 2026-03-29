from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer pour le profil utilisateur"""
    age = serializers.ReadOnlyField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'phone', 'address', 'birth_date', 'gender', 'bio', 
            'avatar', 'website', 'occupation', 'organization', 
            'student_id', 'employee_id', 'language_preference', 
            'timezone', 'receive_notifications', 'receive_newsletter',
            'age', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'age', 'created_at', 'updated_at']

    def validate_phone(self, value):
        """Valide le format du numéro de téléphone"""
        if value and not value.replace('+', '').replace(' ', '').replace('-', '').isdigit():
            raise serializers.ValidationError(
                "Le numéro de téléphone doit contenir uniquement des chiffres, espaces, tirets et le signe +."
            )
        return value


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour l'utilisateur avec profil"""
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'is_active', 'is_staff', 'is_verified',
            'date_joined', 'last_login', 'profile'
        ]
        read_only_fields = [
            'id', 'full_name', 'is_staff', 'is_verified', 
            'date_joined', 'last_login'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription d'un nouvel utilisateur"""
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    phone = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=20
    )

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone'
        ]

    def validate_username(self, value):
        """Valide le nom d'utilisateur"""
        if len(value) < 3:
            raise serializers.ValidationError(
                "Le nom d'utilisateur doit contenir au moins 3 caractères."
            )
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "Ce nom d'utilisateur est déjà utilisé."
            )
        return value.lower()

    def validate_email(self, value):
        """Valide l'email"""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "Cette adresse email est déjà utilisée."
            )
        return value.lower()

    def validate_password(self, value):
        """Valide le mot de passe"""
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate(self, attrs):
        """Validation globale"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Les mots de passe ne correspondent pas."
            })
        return attrs

    def create(self, validated_data):
        """Crée un nouvel utilisateur"""
        # Retirer les champs qui ne sont pas dans le modèle User
        phone = validated_data.pop('phone', None)
        validated_data.pop('password_confirm', None)
        
        # Créer l'utilisateur
        user = User.objects.create_user(**validated_data)
        
        # Ajouter le téléphone au profil si fourni
        if phone:
            user.profile.phone = phone
            user.profile.save()
        
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer pour la connexion"""
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Permettre la connexion avec email ou username
            if '@' in username:
                # Connexion avec email
                try:
                    user_obj = User.objects.get(email__iexact=username)
                    username = user_obj.username
                except User.DoesNotExist:
                    raise serializers.ValidationError(
                        "Aucun compte n'est associé à cette adresse email."
                    )

            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )

            if not user:
                raise serializers.ValidationError(
                    "Nom d'utilisateur ou mot de passe incorrect."
                )

            if not user.is_active:
                raise serializers.ValidationError(
                    "Ce compte a été désactivé."
                )

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                "Le nom d'utilisateur et le mot de passe sont requis."
            )


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer pour changer le mot de passe"""
    old_password = serializers.CharField(style={'input_type': 'password'})
    new_password = serializers.CharField(
        min_length=8,
        style={'input_type': 'password'}
    )

    def validate_old_password(self, value):
        """Valide l'ancien mot de passe"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                "L'ancien mot de passe est incorrect."
            )
        return value

    def validate_new_password(self, value):
        """Valide le nouveau mot de passe"""
        try:
            validate_password(value, self.context['request'].user)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def save(self):
        """Change le mot de passe"""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour mettre à jour les informations utilisateur"""
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

    def validate_email(self, value):
        """Valide l'email lors de la mise à jour"""
        user = self.instance
        if User.objects.filter(email__iexact=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError(
                "Cette adresse email est déjà utilisée par un autre utilisateur."
            )
        return value.lower()


class PasswordResetSerializer(serializers.Serializer):
    """Serializer pour la réinitialisation de mot de passe"""
    email = serializers.EmailField()

    def validate_email(self, value):
        """Valide que l'email existe"""
        try:
            User.objects.get(email__iexact=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Aucun compte n'est associé à cette adresse email."
            )
        return value.lower()
