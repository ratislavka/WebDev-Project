from django.urls import path, include
from rest_framework import routers
from .views import get_tickets

from api import views

router = routers.DefaultRouter()
router.register('events', views.EventViewSet, basename='events')
router.register('cart', views.CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    path("tickets/", get_tickets),
]