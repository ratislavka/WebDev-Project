from django.contrib import admin
from .models import BookingCart, BookingItem, Customer, Event, Ticket 

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'genre', 'date']
    search_field = ['name', 'genre', 'date']

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'surname', 'email']
    search_field = ['name', 'surname', 'email']

@admin.register(BookingCart)
class BookingCart(admin.ModelAdmin):
    list_display = ['customer', 'booking_date']
    search_fields = ['customer', 'booking_date']

@admin.register(BookingItem)
class BookingItemAdmin(admin.ModelAdmin):
    list_display = ['booking', 'event', 'quantity', 'complete']
    search_fields = ['booking', 'event']

admin.site.register(Ticket)
    
