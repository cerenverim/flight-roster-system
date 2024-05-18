from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Flight, Passenger, CabinCrew


class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['username', 'password']
        


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'

class CabinCrewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CabinCrew
        fields = '__all__'        