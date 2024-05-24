from django.db import models

from cabin_crew_information.models import CabinCrew
from cabin_crew_information.models import Dish
from flight_crew_information.models import FlightCrew
from passenger_information.models import PlacedPassenger


class Location(models.Model):
    country = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    airport_name = models.CharField(max_length=255)
    airport_code = models.CharField(max_length=3, primary_key=True)


class SharedFlightInfo(models.Model):
    shared_flight_number = models.CharField(max_length=6, primary_key=True)
    shared_flight_company = models.CharField(max_length=255)


class VehicleType(models.Model):
    vehicle_name = models.CharField(max_length=255)
    vehicle_crew_capacity = models.IntegerField()
    vehicle_pilot_capacity = models.IntegerField()
    vehicle_passenger_capacity = models.IntegerField()
    vehicle_business_seats = models.IntegerField()
    vehicle_seating_plan = models.IntegerField()

    std_menu = models.ManyToManyField(Dish)


class Roster(models.Model):
    flight_crew_junior = models.ManyToManyField(FlightCrew, related_name="flight_crew_junior")
    flight_crew_senior = models.ManyToManyField(FlightCrew, related_name="flight_crew_senior")
    # enforce limit on business logic level
    flight_crew_trainee = models.ManyToManyField(FlightCrew, related_name="flight_crew_trainee", blank=True)  # [0..2]


    flight_cabin_crew_senior = models.ManyToManyField(CabinCrew,
                                                      related_name="flight_cabin_crew_senior", blank=True)  # [1..4]
    flight_cabin_crew_junior = models.ManyToManyField(CabinCrew,
                                                      related_name="flight_cabin_crew_junior", blank=True)  # [4..16]
    flight_cabin_crew_chef = models.ManyToManyField(CabinCrew,
                                                    related_name="flight_cabin_crew_chef", blank=True)  # [0..2]
    flight_passengers = models.ManyToManyField(PlacedPassenger, related_name="flight_passengers", blank=True)  # [0..*]

    flight_menu = models.ManyToManyField(Dish, blank=True) # This is the final menu (standard + the crews)


class Flight(models.Model):
    flight_number = models.CharField(max_length=6, primary_key=True)
    flight_roster = models.OneToOneField(Roster, blank=True, null=True, on_delete=models.CASCADE)

    flight_trainee_limit = models.IntegerField()

    flight_date = models.DateTimeField()
    flight_duration = models.DurationField()
    flight_distance = models.IntegerField()

    flight_src = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="flight_source")
    flight_dest = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="flight_destination")

    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.PROTECT)
    shared_flight = models.OneToOneField(SharedFlightInfo, blank=True, null=True, on_delete=models.CASCADE)
