from rest_framework import serializers
from flight_information.models import Flight, SharedFlightInfo, Roster
from cabin_crew_information.serializers import DishSerializer, CabinCrewSerializer
from flight_crew_information.serializers import FlightCrewSerializer
from passenger_information.serializers import PlacedPassengerSerializer


class SharedFlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedFlightInfo
        fields = '__all__'

class FlightSerializer(serializers.ModelSerializer):
    shared_flight = SharedFlightSerializer(read_only=True)

    class Meta:
        model = Flight
        fields = '__all__'

class RosterSerializer(serializers.ModelSerializer):
    flight_crew_junior = FlightCrewSerializer(read_only=True, many=True)
    flight_crew_senior = FlightCrewSerializer(read_only=True, many=True)
    flight_crew_trainee = FlightCrewSerializer(read_only=True, many=True)

    flight_cabin_crew_senior = CabinCrewSerializer(read_only=True, many=True)
    flight_cabin_crew_junior = CabinCrewSerializer(read_only=True, many=True)
    flight_cabin_crew_chef = CabinCrewSerializer(read_only=True, many=True)

    flight_passengers = PlacedPassengerSerializer(read_only=True, many=True)

    flight_menu = DishSerializer(read_only=True, many=True)

    class Meta:
        model = Roster
        fields = ['flight_crew_junior', 'flight_crew_senior', 'flight_crew_trainee', 'flight_cabin_crew_senior',
                  'flight_cabin_crew_junior', 'flight_cabin_crew_chef', 'flight_passengers', 'flight_menu']