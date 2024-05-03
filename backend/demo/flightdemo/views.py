from django.shortcuts import render, HttpResponse
from django.shortcuts import get_object_or_404
from .models import Flight, Passenger

# Create your views here.
def home(request):
    return HttpResponse("Backend Demo")

# Listing all of the flights 
def list_flights(request):
    flights = Flight.objects.all().select_related('flight_roster', 'vehicle_type')
    return render(request, 'flights/list.html', {'flights': flights})

# reviewing flight details
def flight_details(request, flight_number):
    flight = get_object_or_404(Flight, flight_number=flight_number)
    crew = flight.flight_roster.flight_crew_senior.all()  # Extend to other crew as needed
    passengers = flight.flight_roster.flight_passengers.all()
    return render(request, 'flights/detail.html', {'flight': flight, 'crew': crew, 'passengers': passengers})