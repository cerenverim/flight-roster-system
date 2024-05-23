from rest_framework import serializers
from flight_information.models import Flight, SharedFlightInfo


class SharedFlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedFlightInfo
        fields = '__all__'

class FlightSerializer(serializers.ModelSerializer):
    shared_flight = SharedFlightSerializer(read_only=True)

    class Meta:
        model = Flight
        fields = '__all__'