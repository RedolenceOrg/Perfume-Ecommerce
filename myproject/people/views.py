import json
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from .serializers import RegistrationSerializer,LoginSerializer,ProfileSerializer, ResetPasswordSerializer,updateProfileSerializer,ChangePasswordSerializer
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import PasswordResetOTP
import random
from .utils import send_otp_email


User = get_user_model()


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFView(View):
    def get(self, request):
        
        return JsonResponse({'csrfToken': 'set'})


@method_decorator(csrf_protect, name='dispatch')
class SignupView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)

        serializer = RegistrationSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return JsonResponse({
                'message': 'User created successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            }, status=201)
        return JsonResponse(serializer.errors, status=400)


@method_decorator(csrf_protect, name='dispatch')
class LoginView(View):
    def post(self, request):

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)
        

        serializer = LoginSerializer(data = data)



        if not serializer.is_valid():
            return JsonResponse(serializer.errors,status = 400)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        
        
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return JsonResponse(
                {'detail': 'Invalid credentials'},
                status=401
            )
        
        user = authenticate(request, username=user.username, password=password)

        if user is None:
            return JsonResponse(
                {'detail': 'Invalid credentials'},
                status=401
            )

        auth_login(request, user)

        return JsonResponse({
            'id': user.id,
            'username': user.username,
            'email': user.email,
        })


@method_decorator(csrf_protect, name='dispatch')
class LogoutView(View):
    def post(self, request):
        auth_logout(request)
        return JsonResponse({'message': 'Logged out successfully'})
    

class MeView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse(
                {'detail': 'Not logged in'},
                status=403
            )
        return JsonResponse({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'first_name':request.user.first_name
        })
    

@method_decorator(csrf_protect, name='dispatch')
class ProfileView(LoginRequiredMixin, View):
    def get(self, request):
        profile = request.user.profile
        
        serializer = ProfileSerializer(profile)
        
        return JsonResponse(serializer.data, status=200)
    

@method_decorator(csrf_protect,name = 'dispatch')
class UpdateProfile(View):
    def patch(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)
     
        serializer = updateProfileSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors,status= 400)
        
        if not request.user.is_authenticated:
            return JsonResponse(
                {'detail': 'Not logged in'},
                status=403
            )
        
        profile = request.user.profile

        district = serializer.validated_data.get('district')
        place = serializer.validated_data.get('place')
        
        phone_number = serializer.validated_data.get('phone_number')


        if district is not None:
            profile.district = district
        if place is not None:
            profile.place  =  place    
        if phone_number is not None:
            profile.phone_number = phone_number
        profile.save()
        return JsonResponse({
            'phone_number': profile.phone_number,
            'place':profile.place,
            'district':profile.district
        }   
        )
        
@method_decorator(csrf_protect,name = 'dispatch')
class UpdatePasword(LoginRequiredMixin,View):
    def patch(self,request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError as e:
            return JsonResponse({"detail":"Error parsing to JSON format"},status = 400)
        
        
        serializer = ChangePasswordSerializer(data = data)

        if not serializer.is_valid():
            return JsonResponse(serializer.errors,status = 400)
        
        old_pass = serializer.validated_data['current_password']
        new_pass = serializer.validated_data['new_password']

        if  not request.user.check_password(old_pass):
            return JsonResponse(
                {'detail': 'Current password is incorrect'},
                status=400
            )
        
        
        request.user.set_password(new_pass)
        
        request.user.save()

        auth_logout(request)
        
        return JsonResponse({'detail':"Password successfully changed"},status = 200)
    
@method_decorator(csrf_protect,name = 'dispatch')
class DeleteAccount(LoginRequiredMixin,View):
    def delete(self,request):
        user = request.user
        auth_logout(request)
        user.delete()
        return JsonResponse({'detail':"Account successfully deleted"},status = 200)


class RequestResetPasswordView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)
        
        email = data.get('email')
        if not email:
            return JsonResponse({'detail': 'Email is required'}, status=400)
        
        try:
            user = User.objects.get(email__iexact=email)
            otp = f"{random.randint(100000, 999999)}"
            PasswordResetOTP.objects.filter(email=email).delete()
            PasswordResetOTP.objects.create(email=email, otp=otp)
            send_otp_email(email, otp)
        except User.DoesNotExist:
            pass
        
        return JsonResponse({'detail': 'If the email exists, an OTP has been sent'}, status=200)

class ResetPasswordView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)
        
        serializer = ResetPasswordSerializer(data=data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)

        try:
            otp_entry = PasswordResetOTP.objects.get(email=serializer.validated_data['email'], otp=serializer.validated_data['otp'])
            if otp_entry.is_expired():
                otp_entry.delete()
                return JsonResponse({'detail': 'OTP has expired'}, status=400)
            
            user = User.objects.get(email__iexact=serializer.validated_data['email'])
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            otp_entry.delete()
            return JsonResponse({'detail': 'Password has been reset successfully'}, status=200)
        except PasswordResetOTP.DoesNotExist:
            return JsonResponse({'detail': 'Invalid OTP'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'detail': 'User does not exist'}, status=400)

