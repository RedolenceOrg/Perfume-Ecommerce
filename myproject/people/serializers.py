from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction

from product.models import Decant, Perfume
from .models import PasswordResetOTP, Profile, StockNotificationRequest
from orders.serializers import OrderSerializer
from django.db.models import Sum


User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    email = serializers.EmailField()
    username = serializers.CharField(max_length = 20)
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)

    class Meta:
        model = User
        fields = ['username', 'email', 'password','first_name','last_name']

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
        first_name = validated_data['first_name'].strip()
        last_name = validated_data['last_name'].strip()

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                return user

        except IntegrityError:
            raise serializers.ValidationError({
                "detail": "User with this email or username already exists."
            })
        
class LoginSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True,min_length=8)
    email = serializers.EmailField()



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','username','isVerified']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    orders = serializers.SerializerMethodField()
    class Meta:
        model = Profile 
        fields =["user","phone_number","place","district","total_spend",'orders']

    def get_orders(self, obj):
        orders = obj.user.orders.all().order_by("-created_at").exclude(status="expired")
        return OrderSerializer(orders, many=True).data

class updateProfileSerializer(serializers.Serializer):
    phone_number = serializers.DecimalField(required=False,max_digits=10,decimal_places=0)
    district = serializers.CharField(required=False, allow_blank=True)
    place =  serializers.CharField(required =False, allow_blank = True,max_length=50)

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(min_length=8)
    new_password = serializers.CharField(min_length=8)
    confirm_new_password = serializers.CharField(min_length=8)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({
                'confirm_new_password': 'New passwords do not match'
            })
        return data

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)

class VerifyAccountSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    

class SuggestionSerializer(serializers.Serializer):
    suggestion = serializers.CharField(max_length=200)


class StockNotificationRequestSerializer(serializers.ModelSerializer):
    perfume = serializers.SlugRelatedField(slug_field='slug', queryset=Perfume.objects.all())
    decant_id = serializers.PrimaryKeyRelatedField(
        source='decant', queryset=Decant.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = StockNotificationRequest
        fields = ['perfume', 'decant_id', 'email', 'phone']

    def validate(self, data):
        if not data.get('email') and not data.get('phone'):
            raise serializers.ValidationError("Provide at least an email or a phone number.")
        decant = data.get('decant')
        perfume = data.get('perfume')
        if decant and decant.perfume_id != perfume.id:
            raise serializers.ValidationError("That decant doesn't belong to this perfume.")
        return data