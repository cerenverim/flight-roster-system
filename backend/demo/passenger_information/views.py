from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Passenger
from .serializers import PassengerSerializer
from flight_information.models import Flight


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

# Removing passenger from the flight based on his/her id
class DeletePassengerView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, passenger_id, *args, **kwargs):
        passenger = get_object_or_404(Passenger, id=passenger_id)
        passenger.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)