from django.shortcuts import render, HttpResponse, get_object_or_404
from django.shortcuts import get_object_or_404, redirect
from .models import Flight, Passenger, CabinCrew
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def home(request):
    return Response({})



# Required data: "username", "password"
# Register the user, returns their API token and the user object
# returns 400 fails if username already exists
@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password']) #saves the HASHED password for safety
        user.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Required data: "username", "password"
# Logs the user in, returns their API token and the user object
# returns 404 fails if wrong username/pass
@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)

# Requires ["Authorization", "Token {token}] in header for successful request
# returns 403 otherwise
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response({"passed"})

# Listing all of the flights 
class ListFlightsView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        flights = Flight.objects.all().select_related('flight_roster', 'vehicle_type')
        return render(request, 'flights/list.html', {'flights': flights})

# Viewing the flight details
class FlightDetailsView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, flight_number, *args, **kwargs):
        flight = get_object_or_404(Flight, flight_number=flight_number)
        crew = flight.flight_roster.flight_crew_senior.all()  # Extend to other crew as needed
        passengers = flight.flight_roster.flight_passengers.all()
        return render(request, 'flights/detail.html', {'flight': flight, 'crew': crew, 'passengers': passengers})


# adding new passenger to flight
class AddPassengerView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, flight_number, *args, **kwargs):
        return render(request, 'flights/add_passenger.html')

    def post(self, request, flight_number, *args, **kwargs):
        flight = get_object_or_404(Flight, flight_number=flight_number)
        name = request.POST.get('name')
        seat_type = request.POST.get('seat_type')
        special_needs = request.POST.get('special_needs')
        
        if not name or not seat_type:  # Basic validation
            errors = "Name and seat type are required."
            return render(request, 'flights/add_passenger.html', {'errors': errors})

        new_passenger = Passenger(
            name=name,
            seat_type=seat_type,
            special_needs=special_needs,
            flight=flight
        )
        new_passenger.save()
        return redirect('flight_details', flight_number=flight_number)

# registering new crew member
class AddCrewMemberView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return render(request, 'flights/add_crew_member.html')

    def post(self, request, *args, **kwargs):
        name = request.POST.get('name')
        role = request.POST.get('role')

        if not name or not role:  # Basic validation
            errors = "Name and role are required."
            return render(request, 'flights/add_crew_member.html', {'errors': errors})

        new_crew_member = CabinCrew(
            name=name,
            role=role
        )
        new_crew_member.save()
        return redirect('crew-list-view')


# updating flight details such duration, distance etc...
class UpdateFlightView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, flight_number, *args, **kwargs):
        flight = get_object_or_404(Flight, flight_number=flight_number)
        return render(request, 'flights/update_flight.html', {'flight': flight})

    def post(self, request, flight_number, *args, **kwargs):
        flight = get_object_or_404(Flight, flight_number=flight_number)
        flight.date = request.POST.get('date', flight.date)
        flight.duration = request.POST.get('duration', flight.duration)
        flight.distance = request.POST.get('distance', flight.distance)
        flight.save()
        return redirect('flight_details', flight_number=flight_number)

# updating passenger details 
class UpdatePassengerView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, passenger_id, *args, **kwargs):
        passenger = get_object_or_404(Passenger, id=passenger_id)
        return render(request, 'flights/update_passenger.html', {'passenger': passenger})

    def post(self, request, passenger_id, *args, **kwargs):
        passenger = get_object_or_404(Passenger, id=passenger_id)
        passenger.name = request.POST.get('name', passenger.name)
        passenger.seat_type = request.POST.get('seat_type', passenger.seat_type)
        passenger.special_needs = request.POST.get('special_needs', passenger.special_needs)
        passenger.save()
        return redirect('flight_details', flight_number=passenger.flight.flight_number)


# deleting flight based on its number
def delete_flight(request, flight_number):
    flight = get_object_or_404(Flight, flight_number=flight_number)
    flight.delete()
    return redirect('flights-list')

# removing passenger from the flight based on his/her id
def delete_passenger(request, passenger_id):
    passenger = get_object_or_404(Passenger, id=passenger_id)
    flight_number = passenger.flight.flight_number
    passenger.delete()
    return redirect('flight-detail', flight_number=flight_number)

# deleting staff record 
def delete_staff(request, crew_member_id):
    crew_member = get_object_or_404(CabinCrew, id=crew_member_id)
    crew_member.delete()
    return redirect('crew-list-view')