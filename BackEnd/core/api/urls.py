from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api import views

router = routers.DefaultRouter()
router.register('events', views.EventViewSet, basename='events')
router.register('cart', views.CartViewSet, basename='cart')
router.register('tickets', views.TicketViewSet, basename='tickets')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
]