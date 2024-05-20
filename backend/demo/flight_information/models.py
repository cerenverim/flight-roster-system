from django.db import models
from flight_crew_information.models import VehicleType, FlightCrew
from cabin_crew_information.models import CabinCrew
from passenger_information.models import Passenger

class SharedFlightInfo(models.Model):
    shared_flight_number = models.CharField(max_length=255)
    shared_flight_company = models.CharField(max_length=255)
    connecting_flight = models.ForeignKey('Flight', blank=True, null=True, on_delete=models.CASCADE)

class Roster(models.Model):
    # TODO: there can be multiple senior and junior pilots on a roster
    flight_crew_junior = models.ForeignKey(FlightCrew, related_name="flight_crew_junior", on_delete=models.DO_NOTHING)
    flight_crew_senior = models.ForeignKey(FlightCrew, related_name="flight_crew_senior", on_delete=models.DO_NOTHING)

    # enforce limit on business logic level

    flight_crew_trainee = models.ManyToManyField(FlightCrew, blank=True, related_name="flight_crew_trainee")  # [0..2]
    flight_cabin_crew_senior = models.ManyToManyField(CabinCrew, related_name="flight_cabin_crew_senior")  # [1..4]
    flight_cabin_crew_junior = models.ManyToManyField(CabinCrew, related_name="flight_cabin_crew_junior")  # [4..16]
    flight_cabin_crew_chef = models.ManyToManyField(CabinCrew, blank=True, related_name="flight_cabin_crew_chef")  # [0..2]
    flight_passengers = models.ManyToManyField(Passenger, blank=True, related_name="flight_passengers")  # [0..*]

    """
  
  should roster be deleted automatically if referenced staff is missing? 
  
  def delete(self, *args, **kwargs):
    try:
      # Check if critical constraint fails

      if (self.flight_cabin_crew_senior.count() < 1 or
          self.flight_cabin_crew_junior.count() < 4):

        # If any constraint fails, delete the roster instance
        super(Roster, self).delete(*args, **kwargs)

    except IntegrityError:
      # Handle IntegrityError if any
      pass
      
    """

class Flight(models.Model):
    flight_number = models.CharField(max_length=6)
    flight_roster = models.ForeignKey(Roster, on_delete=models.CASCADE)

    flight_date = models.DateTimeField()
    flight_duration = models.DurationField()
    flight_distance = models.IntegerField()

    flight_src_country = models.CharField(max_length=255)
    flight_src_city = models.CharField(max_length=255)
    flight_src_airport_name = models.CharField(max_length=255)
    flight_src_airport_code = models.CharField(max_length=3)

    flight_dest_country = models.CharField(max_length=255)
    flight_dest_city = models.CharField(max_length=255)
    flight_dest_airport_name = models.CharField(max_length=255)
    flight_dest_airport_code = models.CharField(max_length=3)

    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.PROTECT)
    shared_flight = models.ForeignKey(SharedFlightInfo, on_delete=models.CASCADE, blank=True, null=True)

    # consists of standart menu from vehicleType and chef specialty dishes
    # dish is randomly selected from one of the chefs in flight roster

    # maybe not necessary?
    # alternative: at business logic level, flight menu is created by adding
    # chef dishes + standart menu using CRUD operations dynamically
    flight_menu = models.TextField()


