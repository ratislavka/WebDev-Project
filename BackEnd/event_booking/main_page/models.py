from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    date = models.DateField(null=False, blank=False)
    time = models.TimeField(null=False, blank=False)
    duration = models.IntegerField(default=2)
    genre = models.CharField(max_length=100)

class User(models.Model):
    name = models.CharField(max_length=200)
    surname = models.CharField(max_length=200)
    email = models.EmailField(unique=True)

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    booking_date = models.DateTimeField(null=False, blank=False)
    ticket_count = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=[
        ('waiting', 'waiting'),
        ('paid', 'paid'),
        ('canceled', 'canceled'),
    ], default='waiting')

class Ticket(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    owner_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)

