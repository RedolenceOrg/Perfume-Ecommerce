from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home),
    path('about/', views.about),
    path('api/', include('product.urls')),
    path('authenticate/',include('people.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)