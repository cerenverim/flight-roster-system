from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Flight
from .serializers import FlightSerializer, RosterSerializer

# Listing all of the flights
class ListFlightsView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        flights = Flight.objects.all().select_related('flight_roster', 'vehicle_type').order_by('flight_number')
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Viewing the flight details
class FlightDetailsView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, flight_number, *args, **kwargs):
        flight = get_object_or_404(Flight, flight_number=flight_number)
        serializer = FlightSerializer(flight)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_roster_by_flight(request, flight_id):
    try:
        flight = Flight.objects.get(flight_number=flight_id)
    except Flight.DoesNotExist:
        return Response({"detail": "Flight not found."}, status=status.HTTP_404_NOT_FOUND)

    if flight.flight_roster is None:
        return Response({"detail": "Roster not found."}, status=status.HTTP_404_NOT_FOUND)

    roster = flight.flight_roster
    serializer = RosterSerializer(roster)
    return Response(serializer.data, status=status.HTTP_200_OK)