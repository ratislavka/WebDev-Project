from ast import Is
from calendar import c
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.decorators import action

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
 
from api.models import Event, BookingItem, Ticket, Customer
from api.serializers import EventSerializer, BookingItemSerializer, UserSerializer, UserRegistrationSerializer




class UserRegistrationView(CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Set login and password
class CustomerTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *agrs, **kwargs):
        try:
            response = super().post(request, *agrs, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response()

            res.data = {'success': True}

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                # secure=True,      # REMOVE or set to False for HTTP localhost
                # samesite='None',  # CHANGE for HTTP localhost
                samesite='Lax',  # Use Lax for localhost dev
                path='/'
            )
            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                # secure=True,      # REMOVE or set to False for HTTP localhost
                # samesite='None',  # CHANGE for HTTP localhost
                samesite='Lax',  # Use Lax for localhost dev
                path='/'
            )

            return res

        except:
            return Response({"success": False})
        
    
class CustomerRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)

            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                # secure=True,      # REMOVE or set to False for HTTP localhost
                # samesite='None',  # CHANGE for HTTP localhost
                samesite='Lax',  # Use Lax for localhost dev
                path='/'
            )

            return res

        except:
            return Response()
        
class LogoutViewSet(CreateAPIView):
    def post(self, request, *args, **kwargs):
        try:
            res = Response()
            res.data = {'success': True}
            res.delete_cookie('access_token', path='/', samesite='None')
            res.delete_cookie('refresh_token', path='/', samesite='None')
            return res
        except:
            return Response({'success': False})
        





class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]


class CartViewSet(viewsets.ModelViewSet):
    queryset = BookingItem.objects.all()
    serializer_class = BookingItemSerializer

    def get_permissions(self):
        if self.action == 'list' or self.action == 'create': #create is used only for postman 
            return [IsAuthenticated()]
        return [AllowAny()]

    # Adds events to BookingItems
    def create(self, request, *args, **kwargs):
        user = request.user
        try:
            customer = BookingItem.objects.filter(customer__user=user)
        except Customer.DoesNotExist:
            return Response({"error": "Customer does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        
        event_id = request.data.get("id")
        quantity = request.data.get("quantity")

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": 'Event Not Found'}, status=status.HTTP_400_BAD_REQUEST)
        
        booking = BookingItem.objects.create(
            customer=customer,
            event=event,
            quantity=quantity
        )
        serializers = BookingItemSerializer(booking)
        return Response(serializers.data, status=status.HTTP_201_CREATED)
    

    # Deletes items (NOT item) from BookingItems and appends them into Ticket
    @action(detail=False, methods=['post'], url_path='buy')
    def buy(self, request, *args, **kwargs):
        user = request.user
        try:
            customer = Customer.objects.get(user=user)
        except Customer.DoesNotExist:
            return Response({"error": "Customer does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_items = BookingItem.objects.filter(customer=customer)

        for item in cart_items:
            Ticket.objects.create(
                customer=customer,
                booking_item=item
            )
        cart_items.delete()
        return Response({"message": "Purchase completed"}, status=status.HTTP_200_Ok)
