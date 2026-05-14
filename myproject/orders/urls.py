from django.urls import path
from .views import AddToCartView, CheckoutView, CartDetailView,CartDeleteView,CartUpdateView

urlpatterns = [
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('view/',CartDetailView.as_view(),name='cartdetail'),
    path('delete/',CartDeleteView.as_view(),name='cartdelete'),
    path('update/',CartUpdateView.as_view(),name='cartupdate')
]