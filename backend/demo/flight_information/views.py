from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from cabin_crew_information.models import CabinCrew
from passenger_information.serializers import PassengerSerializer
from .models import Flight, Roster
from flight_crew_information.models import FlightCrew
from .serializers import FlightSerializer, RosterSerializer, RosterSerializer
from rest_framework.decorators import api_view
from passenger_information.models import Passenger, PlacedPassenger
import random, math
from faker import Faker

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
    

def assign_seats_helper(flight, flight_number, type):
    
    allPlaced = []

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
            pas = PlacedPassenger()
            pas.seat_no = seat
            pas.passenger = passenger
            pas.save()
            allPlaced.append(pas)
        
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
                    pas = PlacedPassenger()
                    pas.seat_no = available_seat_numbers.pop(0)
                    pas.passenger = passenger
                    pas.save()
                    allPlaced.append(pas)
                    processed_passengers.add(passenger)
    
    for passenger in assigned_passengers:
        pas = PlacedPassenger()
        pas.seat_no = passenger.seat_no
        pas.passenger = passenger
        pas.save()
        allPlaced.append(pas)   
    
    return allPlaced

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def auto_generate_roster(request, flight_number):
    flight = get_object_or_404(Flight, flight_number=flight_number)
    if flight.flight_roster != None:
        return Response({"message":"Roster already exists!"}, status=status.HTTP_200_OK)
    businessPlaced = assign_seats_helper(flight, flight_number,1)
    economyPlaced = assign_seats_helper(flight, flight_number,0)
    placed_passengers = businessPlaced + economyPlaced

    selected_vehicle = flight.vehicle_type

    # 0 - Trainee, 1 - Junior, 2 - Senior

    senior_pilots = FlightCrew.objects.all().filter(seniority=2,
                                                    vehicle=selected_vehicle.id)
    senior_pilots = list(senior_pilots)

    junior_pilots = FlightCrew.objects.all().filter(seniority=1,
                                                    vehicle=selected_vehicle.id)
    junior_pilots = list(junior_pilots)

    trainee_pilots = FlightCrew.objects.all().filter(seniority=0,
                                                        vehicle=selected_vehicle.id)
    trainee_pilots = list(trainee_pilots)

    # 0 - Chef, 1 - Junior, 2 - Senior

    chefs = CabinCrew.objects.all().filter(vehicle=selected_vehicle,
                                            seniority=0)
    chefs = list(chefs)

    senior_cabin_crew = CabinCrew.objects.all().filter(vehicle=selected_vehicle,
                                                        seniority=2)
    senior_cabin_crew = list(senior_cabin_crew)

    junior_cabin_crew = CabinCrew.objects.all().filter(vehicle=selected_vehicle,
                                                        seniority=1)
    junior_cabin_crew = list(junior_cabin_crew)

    # must contain one senior and one junior pilots
    roster_senior_pilot = random.choice(senior_pilots)
    roster_junior_pilot = random.choice(junior_pilots)

    pilot_limit = selected_vehicle.vehicle_pilot_capacity - 2

    fake = Faker()

    number_of_trainees = fake.random_int(min=0, max=min(pilot_limit, flight.flight_trainee_limit))
    roster_trainees = fake.random_elements(trainee_pilots, length=number_of_trainees, unique=True)

    pilot_limit -= number_of_trainees

    number_of_junior_pilots = fake.random_int(min=0, max=math.ceil(pilot_limit / 2))
    roster_junior_pilots = fake.random_elements(junior_pilots, length=number_of_junior_pilots, unique=True)

    # list(set()) ensures all unique objects

    roster_junior_pilots.append(roster_junior_pilot)
    roster_junior_pilots = list(set(roster_junior_pilots))

    pilot_limit -= math.ceil(pilot_limit / 2)

    number_of_senior_pilots = fake.random_int(min=0, max=pilot_limit)
    roster_senior_pilots = fake.random_elements(senior_pilots, length=number_of_senior_pilots, unique=True)

    roster_senior_pilots.append(roster_senior_pilot)
    roster_senior_pilots = list(set(roster_senior_pilots))

    # at least one senior and 4 junior cabin crew

    min_cabin_senior = random.choice(senior_cabin_crew)

    number_of_juniors = fake.random_int(min=4, max=4)
    min_cabin_junior = fake.random_elements(junior_cabin_crew, length=number_of_juniors, unique=True)

    cabin_limit = selected_vehicle.vehicle_crew_capacity - 5

    number_of_seniors = fake.random_int(min=0, max=min(3, cabin_limit))
    roster_senior_cabin = fake.random_elements(senior_cabin_crew, length=number_of_seniors, unique=True)

    roster_senior_cabin.append(min_cabin_senior)
    roster_senior_cabin = list(set(roster_senior_cabin))

    cabin_limit -= number_of_seniors

    number_of_juniors = fake.random_int(min=0, max=min(12, cabin_limit))
    roster_junior_cabin = fake.random_elements(junior_cabin_crew, length=number_of_juniors, unique=True)

    roster_junior_cabin = min_cabin_junior + roster_junior_cabin

    roster_junior_cabin = list(set(roster_junior_cabin))

    cabin_limit -= number_of_juniors

    number_of_chefs = fake.random_int(min=0, max=min(2, cabin_limit))
    roster_chefs = fake.random_elements(chefs, length=number_of_chefs, unique=True)

    flight_menu = []

    # chef specialities added to flight menu
    for chef in roster_chefs:
        for dish in chef.dishes.all():
            flight_menu.append(dish)

    # add one standard menu assigned to selected vehicle type
    flight_menu.append(selected_vehicle.std_menu.all().first())

    flight_menu = list(set(flight_menu))

    roster = Roster()
    roster.save()

    roster_junior_pilot_ids = [pilot.id for pilot in roster_junior_pilots]
    roster_senior_pilot_ids = [pilot.id for pilot in roster_senior_pilots]
    roster_trainee_ids = [trainee.id for trainee in roster_trainees]
    roster_senior_cabin_ids = [cabin.id for cabin in roster_senior_cabin]
    roster_junior_cabin_ids = [cabin.id for cabin in roster_junior_cabin]
    roster_chef_ids = [chef.id for chef in roster_chefs]
    roster_placed_passenger_ids = [passenger.id for passenger in placed_passengers]
    flight_menu_ids = [menu.id for menu in flight_menu]

    roster.flight_crew_junior.set(roster_junior_pilot_ids)
    roster.flight_crew_senior.set(roster_senior_pilot_ids)
    roster.flight_crew_trainee.set(roster_trainee_ids)
    roster.flight_cabin_crew_senior.set(roster_senior_cabin_ids)
    roster.flight_cabin_crew_junior.set(roster_junior_cabin_ids)
    roster.flight_cabin_crew_chef.set(roster_chef_ids)
    roster.flight_passengers.set(roster_placed_passenger_ids)
    roster.flight_menu.set(flight_menu_ids)

    roster.save()

    flight.flight_roster = roster

    flight.save()

    serializer = RosterSerializer(roster)
    return Response(serializer.data, status=status.HTTP_200_OK)
