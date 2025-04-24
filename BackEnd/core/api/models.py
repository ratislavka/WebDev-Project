from django.db import models
from django.contrib.auth.models import User

# Movie, Theatre, Concert, etc.
class Event(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    date = models.DateField(null=False, blank=False)
    duration = models.IntegerField(null=False, blank=False)
    genre = models.CharField(max_length=100)
    price = models.IntegerField(null=False, blank=False)
    image = models.ImageField(upload_to='events/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.date}"

# Customer == User
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

# BookingItem == Cart
class BookingItem(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    booking_date = models.DateTimeField(auto_now_add=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)

    @property
    def get_total(self):
        total = self.event.price * self.quantity
        return total

    @property
    def get_cart_total(self):
        bookings = BookingItem.objects.all()
        total = sum([item.get_total for item in bookings])
        return total

    @property
    def get_cart_items(self):
        bookings = BookingItem.objects.filter(customer=self.customer)
        total = sum([item.quantity for item in bookings])
        return total
    
    def __str__(self):
        return f"Booking_id - {str(self.id)} x {self.event.name} x {self.quantity} "


class Ticket(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    booking_item = models.ForeignKey(BookingItem, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.customer.name} - {self.booking_item.event.name}- {self.booking_item.quantity}"
