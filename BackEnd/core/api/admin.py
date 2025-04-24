from django.contrib import admin
from .models import BookingItem, Customer, Event, Ticket 

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'date', 'duration', 'genre', 'price']
    search_field = ['name', 'genre', 'date']

admin.site.register(Customer)

@admin.register(BookingItem)
class BookingItemAdmin(admin.ModelAdmin):
    list_display = ['booking_date', 'event', 'quantity']
    search_fields = ['booking_date', 'event']

admin.site.register(Ticket)
    
