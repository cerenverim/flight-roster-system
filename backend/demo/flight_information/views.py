from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from passenger_information.serializers import PassengerSerializer
from .models import Flight
from .serializers import FlightSerializer
from rest_framework.decorators import api_view
from passenger_information.models import Passenger

# Listing all of the flights
class ListFlightsView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        flights = Flight.objects.all().select_related('flight_roster', 'vehicle_type')
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

def assign_seats_helper(flight, flight_number, type):
    
    # Get all passengers for the flight
    passengers = Passenger.objects.filter(flight_id=flight_number)
    passengers = passengers.filter(seat_type=type)

    # Separate passengers who need seat assignments
    unassigned_passengers = passengers.filter(seat_no__isnull=True)
    assigned_passengers = passengers.exclude(seat_no__isnull=True)
    
    business = flight.vehicle_type.vehicle_business_seats
    total_seats = 0
    if(type == 0):
        total_seats = flight.vehicle_type.vehicle_passenger_capacity
    else:
        total_seats = flight.vehicle_type.vehicle_business_seats
    
    assigned_seat_numbers = assigned_passengers.values_list('seat_no', flat=True)
    
    # Generate available seat numbers
    available_seat_numbers = []
    if(type == 0):
        available_seat_numbers = [i for i in range(1, total_seats + 1) if i > business and i not in assigned_seat_numbers]
    else:
        available_seat_numbers = [i for i in range(1, total_seats + 1) if i not in assigned_seat_numbers]

    def assign_consecutive_seats(passenger_group):
        assigned_seats = []
        seats_needed = len(passenger_group)
        
        # Try assigning consecutive seats
        consecutive_sequence = []
        for seat in available_seat_numbers:
            if len(consecutive_sequence) == 0 or seat == consecutive_sequence[-1] + 1:
                consecutive_sequence.append(seat)
            else:
                consecutive_sequence = [seat]
            
            if len(consecutive_sequence) == seats_needed:
                assigned_seats = consecutive_sequence[:]
                break
        
        # If consecutive assignment failed, try assigning seats with skips
        if not assigned_seats:
            for _ in range(seats_needed):
                if available_seat_numbers:
                    assigned_seats.append(available_seat_numbers.pop(0))
                else:
                    # No available consecutive seats, return False
                    return False
        
        # Assign seats to passengers
        for passenger, seat in zip(passenger_group, assigned_seats):
            passenger.seat_no = seat
            passenger.save()
        
        # Return True indicating successful assignment
        return True
    
    # Assign seats to unassigned passengers
    processed_passengers = set()
    for passenger in unassigned_passengers:
        if passenger.age > 2:
            if passenger in processed_passengers:
                continue
            if passenger.affiliated_passenger.exists():
                affiliated_passengers = passenger.affiliated_passenger.filter(seat_no__isnull=True)
                passenger_group = list(affiliated_passengers) + [passenger]
                if assign_consecutive_seats(passenger_group):
                    processed_passengers.update(passenger_group)
            else:
                if available_seat_numbers:
                    passenger.seat_no = available_seat_numbers.pop(0)
                    passenger.save()
                    processed_passengers.add(passenger)
    
    # Serialize the updated passengers

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def assign_seats(request, flight_number):
    # Get the flight
    flight = get_object_or_404(Flight, flight_number=flight_number)
    assign_seats_helper(flight, flight_number,1)
    assign_seats_helper(flight, flight_number,0)
    return Response({"message": "Seats assigned successfully"}, status=status.HTTP_200_OK)
