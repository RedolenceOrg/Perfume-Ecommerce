from django.urls import path
from .views import AddToCartView, CheckoutView, CartDetailView

urlpatterns = [
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('view/',CartDetailView.as_view(),name='cartdetail')
]