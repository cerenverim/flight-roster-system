from django.shortcuts import render, HttpResponse, get_object_or_404
from django.shortcuts import get_object_or_404, redirect
from .models import Flight, Passenger, CabinCrew
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CabinCrewSerializer, FlightSerializer, PassengerSerializer, UserSerializer
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

# Adding new passenger to flight
class AddPassengerView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, flight_number, *args, **kwargs):
        flight = get_object_or_404(Flight, flight_number=flight_number)
        serializer = PassengerSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(flight=flight)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Registering new crew member
class AddCrewMemberView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CabinCrewSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Updating flight details such as duration, distance, etc.
class UpdateFlightView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, flight_number, *args, **kwargs):
        flight = get_object_or_404(Flight, flight_number=flight_number)
        serializer = FlightSerializer(flight, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Updating passenger details
class UpdatePassengerView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, passenger_id, *args, **kwargs):
        passenger = get_object_or_404(Passenger, id=passenger_id)
        serializer = PassengerSerializer(passenger, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Deleting flight based on its number
class DeleteFlightView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, flight_number, *args, **kwargs):
        flight = get_object_or_404(Flight, flight_number=flight_number)
        flight.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Removing passenger from the flight based on his/her id
class DeletePassengerView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, passenger_id, *args, **kwargs):
        passenger = get_object_or_404(Passenger, id=passenger_id)
        passenger.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Deleting staff record
class DeleteStaffView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, crew_member_id, *args, **kwargs):
        crew_member = get_object_or_404(CabinCrew, id=crew_member_id)
        crew_member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)