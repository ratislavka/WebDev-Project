from api.models import Ticket, BookingItem, Customer
from rest_framework import serializers
from django.contrib.auth.models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'password']

    def create(self, validated_data):
        user = User(
            username = validated_data['username'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username']


class EventSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    location = serializers.CharField()
    date = serializers.DateField()
    duration = serializers.FloatField()
    genre = serializers.CharField()
    price = serializers.IntegerField()
    image = serializers.ImageField()


class CustomerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = UserSerializer(read_only=True)

class BookingItemSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    booking_date = serializers.DateTimeField()
    quantity = serializers.IntegerField()
    total = serializers.SerializerMethodField()
    cart_model = serializers.SerializerMethodField()
    cart_items = serializers.SerializerMethodField()

    def get_total(self, obj):
        return obj.get_total()

    def get_cart_model(self, obj):
        return obj.get_cart_total()

    def get_cart_items(self, obj):
        return obj.get_cart_items()
    
    class Meta:
        model = BookingItem
        fields = ['id', 'customer', 'booking_date', 'event', 'quantity', 'total', 'cart_model', 'cart_items']


class TicketSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    booking_item = BookingItemSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = ['customer', 'booking_item']