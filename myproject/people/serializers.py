from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from .models import Profile

User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    email = serializers.EmailField()
    username = serializers.CharField(max_length = 20)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_email(self, value):
        email = value.strip().lower()

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("This email is already registered.")

        return email
    def validate_username(self,value):
        return value.strip()

    def create(self, validated_data):
        username = validated_data['username'].strip()
        email = validated_data['email'].strip().lower()
        password = validated_data['password']

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password
                )
                return user

        except IntegrityError:
            raise serializers.ValidationError({
                "detail": "User with this email or username already exists."
            })
        
class LoginSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True,min_length=8)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ['email', 'password']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','username']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile 
        fields =["user","phone_number","address","total_spend"]

class updateProfileSerializer(serializers.Serializer):
    phone_number = serializers.DecimalField(max_digits=10,decimal_places=0)
    address = serializers.CharField()





