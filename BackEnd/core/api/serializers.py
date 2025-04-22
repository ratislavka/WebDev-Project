from api.models import BookingCart, Ticket, BookingItem
from rest_framework import serializers
from django.contrib.auth.models import User


class EventSerializer(serializers.Serializer):
    name = serializers.CharField()
    location = serializers.CharField()
    date = serializers.DateField()
    duration = serializers.FloatField()
    genre = serializers.CharField()
    price = serializers.IntegerField()
    image = serializers.ImageField()


class CustomerSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    name = serializers.CharField()
    surname = serializers.CharField()
    email = serializers.EmailField()


class BookingCartSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    booking_date = serializers.DateTimeField(read_only=True)
    cart_total = serializers.SerializerMethodField()
    cart_items = serializers.SerializerMethodField()

    def get_cart_model(self, obj):
        return obj.get_cart_total()
    
    def get_cart_items(self, obj):
        return obj.get_cart_items()

    class Meta:
        model = BookingCart
        fields = ['id', 'customer', 'booking_date', 'cart_total', 'cart_items']


class BookingItemSerializer(serializers.ModelSerializer):
    booking = BookingCartSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    quantity = serializers.IntegerField()
    complete = serializers.BooleanField()
    total = serializers.SerializerMethodField()

    def get_total(self, obj):
        return obj.get_total()
    
    class Meta:
        model = BookingItem
        fields = ['booking', 'event', 'quantity', 'complete', 'total']


class TicketSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    booking_item = BookingItemSerializer(read_only=True)
    status = serializers.BooleanField()

    class Meta:
        model = Ticket
        fields = ['customer', 'booking_item', 'status']