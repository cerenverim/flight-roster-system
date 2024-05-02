from django.db import models, IntegrityError


# user: admin
# password: admin

# currently using JSONfield to represent arrays
# field could also be represented with,
# django.contrib.postgres.fields gives ArrayField and is specific to PostgreaSQL

# a flight must have:
#   - 1 senior pilot,
#   - 1 junior pilot,
#   - 0-2 trainee pilot,
#   - 1-4 senior attendent,
#   - 4-16 junior attendent,
#   - 0-2 chef

# must not go over vehicle seat limit

# does the authorization system need to be robust?
# Can we just store username and password in an unsafe way?

# roster information is found by finding all the occupants with the matching flight number and
# counting them to see if they match the constraints

# constraint enforcement planned to be implemented in business logic

class Passenger(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=100)
    nationality = models.CharField(max_length=255)

    # if infant(age 0-2) put 1 or 2 parent ids in seat_type
    seat_type = models.JSONField()


class FlightCrew(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=100)
    nationality = models.CharField(max_length=255)
    languages = models.JSONField()
    vehicle = models.CharField(max_length=255)
    range = models.IntegerField()
    seniority = models.CharField(max_length=255)


class CabinCrew(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=100, )
    nationality = models.CharField(max_length=255)
    languages = models.JSONField()
    attendant_type = models.CharField(max_length=255, null=True, blank=True)  # nullable and blank because not all attendants may have a
    # unlike pilots, attendants can use multiple vehicles
    vehicle = models.JSONField()


class Roster(models.Model):
    # TODO: there can be multiple senior and junior pilots on a roster
    flight_crew_junior = models.ForeignKey(FlightCrew, related_name="flight_crew_junior", on_delete=models.PROTECT)
    flight_crew_senior = models.ForeignKey(FlightCrew, related_name="flight_crew_senior", on_delete=models.PROTECT)

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


class VehicleType(models.Model):
    vehicle_name = models.CharField(max_length=255)
    vehicle_capacity = models.IntegerField()

    # the id of the seating plan determines the type of seating  plan
    # that will be used for this vehicle

    # might change into class in the future
    vehicle_seating_plan = models.IntegerField()

    # standart menu for every vehicle type
    # chef specialty menus will be ADDED to the standart menu when chef is assigned
    vehicle_menu = models.TextField(blank=True, null=True)


class SharedFlightInfo(models.Model):
    shared_flight_number = models.CharField(max_length=255)
    shared_flight_company = models.CharField(max_length=255)
    connecting_flight = models.ForeignKey('Flight', blank=True, null=True, on_delete=models.CASCADE)


class Flight(models.Model):
    flight_number = models.CharField(primary_key=True, max_length=6)
    flight_roster = models.ForeignKey(Roster, on_delete=models.CASCADE)
    flight_info = models.DateTimeField()

    flight_src_country = models.CharField(max_length=255)
    flight_src_city = models.CharField(max_length=255)
    flight_src_airport_name = models.CharField(max_length=255)
    flight_src_airport_code = models.CharField(max_length=6)

    flight_dest_country = models.CharField(max_length=255)
    flight_dest_city = models.CharField(max_length=255)
    flight_dest_airport_name = models.CharField(max_length=255)
    flight_dest_airport_code = models.CharField(max_length=6)

    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.PROTECT)
    shared_flight = models.ForeignKey(SharedFlightInfo, on_delete=models.CASCADE, blank=True, null=True)

    # consists of standart menu from vehicleType and cheft specialty dishes
    # dish is randomly selected from one of the chefs in flight roster

    # maybe not necessary?
    # alternative: at business logic level, flight menu is created by adding
    # chef dishes + standart menu using CRUD operations dynamically
    flight_menu = models.TextField()


# each chef has 2-4 unique dishes
class Dish(models.Model):
    chef_id = models.ForeignKey(CabinCrew, on_delete=models.PROTECT)
    dish = models.TextField()


class User(models.Model):
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
