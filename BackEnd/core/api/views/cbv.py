from calendar import c
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

from api.models import Event, BookingItem, Ticket
from api.serializers import EventSerializer, BookingItemSerializer, TicketSerializer

from django.utils import timezone


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class CartViewSet(viewsets.ModelViewSet):
    queryset = BookingItem.objects.all()
    serializer_class = BookingItemSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [AllowAny()]



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
