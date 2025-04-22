from calendar import c
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from api.models import Event, BookingItem, Ticket, Customer
from api.serializers import EventSerializer, BookingItemSerializer, TicketSerializer

from django.utils import timezone


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer



class CartViewSet(viewsets.ModelViewSet):
    queryset = BookingItem.objects.all()
    serializer_class = BookingItemSerializer

    def get_permissions(self):
        if self.action == 'list' or self.action == 'create':

            return [IsAuthenticated()]
        return [AllowAny()]

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
    

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Ticket.objects.filter(customer__user=user)
        
        for ticket in queryset:
            if ticket.booking_item.event.date < timezone.now():
                ticket.status = False
                ticket.save()

        return queryset
