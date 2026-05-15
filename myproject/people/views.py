import json
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from .serializers import RegistrationSerializer,LoginSerializer,ProfileSerializer,updateProfileSerializer,ChangePasswordSerializer
from django.contrib.auth.mixins import LoginRequiredMixin


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
        })
    

@method_decorator(csrf_protect, name='dispatch')
class ProfileView(View):
    def get(self,request):
        if not request.user.is_authenticated:
            return JsonResponse(
                {'detail': 'Not logged in'},
                status=403
            )

        profile = request.user.profile
        data = ProfileSerializer(profile).data

        return JsonResponse(data, status=200)
    

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

        address = serializer.validated_data.get('address')
        phone_number = serializer.validated_data.get('phone_number')

        if address is not None:
            profile.address = address
        if phone_number is not None:
            profile.phone_number = phone_number
        profile.save()
        return JsonResponse({
            'address': profile.address,
            'phone_number': profile.phone_number
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
        
        

