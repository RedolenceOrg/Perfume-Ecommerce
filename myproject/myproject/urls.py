from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from . import views

admin.site.site_header = "Redolence Nepal"
admin.site.site_title = "Redolence Nepal"
admin.site.index_title = "Dashboard"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home),
    path('about/', views.about),
    path('api/', include('product.urls')),
    path('authenticate/',include('people.urls')),
    path('cart/',include('orders.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
