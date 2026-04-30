from django.urls import path
from . import views

urlpatterns = [
    path('getperfumeHome/',views.getPerfumeHome.as_view(),name='get_perfumesHome'),
    path('filter/', views.FilterOptionsView.as_view(), name='filter'),
    path('shop/', views.ShopView.as_view(), name='shop'),
    path('perfume/<slug:slug>/', views.PerfumeDetailView.as_view(), name='perfume_detail'),
    path('related/', views.RelatedPerfumesView.as_view(), name='related_perfumes'),
    path('atomizers/', views.AtomizerPage.as_view(), name='atomizer_page'),
]