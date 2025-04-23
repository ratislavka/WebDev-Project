from django.contrib import admin
from .models import BookingItem, Customer, Event, Ticket 

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    search_field = ['name', 'genre', 'date']

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'surname', 'email']
    search_field = ['name', 'surname', 'email']

@admin.register(BookingItem)
class BookingItemAdmin(admin.ModelAdmin):
    list_display = ['booking_date', 'event', 'quantity', 'complete']
    search_fields = ['booking_date', 'event']

admin.site.register(Ticket)
    
