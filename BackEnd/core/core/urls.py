from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views import CustomerTokenObtainPairView, CustomerRefreshTokenView, UserRegistrationView, LogoutViewSet, is_authenticated

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('register/', UserRegistrationView.as_view()),
    path('login/', CustomerTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CustomerRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', LogoutViewSet.as_view(), name='logout'),
    path('is_authenticated/', is_authenticated),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


