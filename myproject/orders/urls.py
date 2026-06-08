from django.urls import path
from .views import AddToCartView, CheckoutView, CartDetailView,CartDeleteView,CartUpdateView,CheckoutView, EsewaInitiateView, EsewaVerifyView, GetPayVerifyView, KhaltiConfirmView,KhaltiInitiateView

urlpatterns = [
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('view/',CartDetailView.as_view(),name='cartdetail'),
    path('delete/',CartDeleteView.as_view(),name='cartdelete'),
    path('update/',CartUpdateView.as_view(),name='cartupdate'),
    path('payment/khalti/initiate/',KhaltiInitiateView.as_view(),name='khalti-initiate'),
    path('payments/khalti/confirm/', KhaltiConfirmView.as_view()),
    path('payment/esewa/confirm/<uuid:order_id>/', EsewaInitiateView.as_view(), name='esewa-confirm'),
    path('payment/esewa/verify/<uuid:order_id>/', EsewaVerifyView.as_view(), name='esewa-verify'),
    path('payment/getpay/verify/', GetPayVerifyView.as_view(), name='getpay-verify'),
]