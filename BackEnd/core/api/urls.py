from django.urls import path, include
from rest_framework import routers
from .views import get_tickets

from api import views

router = routers.DefaultRouter()
router.register('events', views.EventViewSet, basename='events')
router.register('cart', views.CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
<<<<<<< Updated upstream
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutViewSet.as_view(), name='logout'),
    path('is_authenticated/', is_authenticated),
    path('api/', include(router.urls)),
=======
    path("tickets/", get_tickets),
>>>>>>> Stashed changes
]