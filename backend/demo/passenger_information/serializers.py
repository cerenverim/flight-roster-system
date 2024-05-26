from rest_framework import serializers
from .models import Passenger, PlacedPassenger

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'
    
class PlacedPassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacedPassenger
        fields = '__all__'