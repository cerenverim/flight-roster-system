from rest_framework import serializers
from .models import Passenger, PlacedPassenger

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'

class BasicPassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = ['id', 'name', 'age', 'gender', 'nationality']

class PlacedPassengerSerializer(serializers.ModelSerializer):
    passenger = BasicPassengerSerializer(read_only=True)
    class Meta:
        model = PlacedPassenger
        fields = ['passenger', 'seat_no']

