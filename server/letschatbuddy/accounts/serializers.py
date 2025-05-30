from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    avatar = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password_confirm', 'avatar']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'password': {'required': True},
            'password_confirm': {'required': True},
        }
        
    def validate(self, attrs):
        if CustomUser.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({'error': 'email-exists', "message": "Email already exists."})
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'error': 'password-not-confirm' ,"message": "Password fields did not match."})
        
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            avatar=validated_data['avatar']
        )
        user.set_password(validated_data['password'])
        user.save()
        
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        print("XXXX", email, password)
        
        try:
            user = CustomUser.objects.get(email=email)
            print("2222", user)
            if not user.check_password(password):
                print("Error 1")
                raise serializers.ValidationError({'error': "password-mismatch", "message": "Incorrect password."})
            if not user.is_active:
                print("Error 2")
                if not user.last_login:
                    print("Error 3")
                    raise serializers.ValidationError({"error": "account-not-activated", "message": "Your account is not activated yet. Please check your email."})
                raise serializers.ValidationError({"error": "account-blocked", "message": "Your account is blocked by admin. Please contact support."})
            attrs['user'] = user
            print("Error 4", attrs)
            return attrs
        
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"error": "not-exist", "message": "Please check your email and try again."})


