from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import FlightCrew
from .serializers import FlightCrewSerializer

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_pilot_by_vehicle_type(request, vehicle_type):
    try:
        vehicle_type = int(vehicle_type)
    except ValueError:
        return Response({"detail": "Invalid vehicle type."}, status=status.HTTP_400_BAD_REQUEST)

    flight_crews = FlightCrew.objects.filter(vehicle_id=vehicle_type)
    serializer = FlightCrewSerializer(flight_crews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
