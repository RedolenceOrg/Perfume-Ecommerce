from django.urls import path
from .views import CSRFView, DeleteAccount, RequestResetPasswordView, ResetPasswordView, SignupView, LoginView, LogoutView, MeView,ProfileView,UpdateProfile,UpdatePasword

urlpatterns = [
    path('csrf/', CSRFView.as_view()),
    path('signup/', SignupView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('me/', MeView.as_view()),
    path('profile/',ProfileView.as_view()),
    path('updateprofile/',UpdateProfile.as_view()),
    path('updatepassword/',UpdatePasword.as_view()),
    path('deleteaccount/',DeleteAccount.as_view()),
    path('request-password-reset/', RequestResetPasswordView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
]