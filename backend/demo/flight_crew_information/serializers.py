from rest_framework import serializers
from .models import FlightCrew

class FlightCrewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightCrew
        fields = '__all__'
