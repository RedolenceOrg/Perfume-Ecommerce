import json
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from .serializers import RegistrationSerializer,LoginSerializer

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