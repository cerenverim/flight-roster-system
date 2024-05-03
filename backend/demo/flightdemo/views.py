from django.shortcuts import render, HttpResponse
from django.shortcuts import get_object_or_404, redirect
from .models import Flight, Passenger, CabinCrew

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

# adding flight and creating instance from POST
def add_flight(request):
    if request.method == 'POST':
        new_flight = Flight(flight_number=request.POST.get('flight_number'),)
        new_flight.save()
        return redirect('some-view-name')
    return render(request, 'flights/add_flight.html')

# adding new passenger to flight
def add_passenger(request, flight_number):
    if request.method == 'POST':
        flight = get_object_or_404(Flight, flight_number=flight_number)
        new_passenger = Passenger(
            name=request.POST.get('name'),
            seat_type=request.POST.get('seat_type'),
            special_needs=request.POST.get('special_needs'),
            flight=flight
        )
        new_passenger.save()
        return redirect('flight-detail', flight_number=flight_number)
    return render(request, 'flights/add_passenger.html')

# registering new crew member
def add_crew_member(request):
    if request.method == 'POST':
        new_crew_member = CabinCrew(
            name=request.POST.get('name'),
            role=request.POST.get('role')
        )
        new_crew_member.save()
        return redirect('crew-list-view')
    return render(request, 'flights/add_crew_member.html')


# updating flight details such duration, distance etc...
def update_flight(request, flight_number):
    flight = get_object_or_404(Flight, flight_number=flight_number)
    if request.method == 'POST':
        flight.date = request.POST.get('date', flight.date)
        flight.duration = request.POST.get('duration', flight.duration)
        flight.distance = request.POST.get('distance', flight.distance)
        flight.save()
        return redirect('flight-detail', flight_number=flight_number)
    return render(request, 'flights/update_flight.html', {'flight': flight})

# updating passenger details 
def update_passenger(request, passenger_id):
    passenger = get_object_or_404(Passenger, id=passenger_id)
    if request.method == 'POST':
        passenger.name = request.POST.get('name', passenger.name)
        passenger.seat_type = request.POST.get('seat_type', passenger.seat_type)
        passenger.special_needs = request.POST.get('special_needs', passenger.special_needs)
        passenger.save()
        return redirect('flight-detail', flight_number=passenger.flight.flight_number)
    return render(request, 'flights/update_passenger.html', {'passenger': passenger})
