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