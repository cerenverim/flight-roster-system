from django.db import models

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
  flight_number = models.CharField(null=True, blank=True, max_length=6)



class Flight(models.Model):
  flight_number = models.CharField(primary_key=True, max_length=6)
  flight_info = models.DateTimeField()
  flight_source = models.CharField(max_length=255)
  flight_dest = models.CharField(max_length=255)
  vehicle_type = models.CharField(max_length=255)
  shared_flight = models.JSONField()

  # dish is randomly selected from one of the chefs in flight roster
  flight_menu = models.TextField()

class FlightCrew(models.Model):
  name = models.CharField(max_length=255)
  age = models.IntegerField()
  gender = models.CharField(max_length=100)
  nationality = models.CharField(max_length=255)
  languages = models.JSONField()
  vehicle = models.CharField(max_length=255)
  range = models.IntegerField()
  seniority = models.CharField(max_length=255)
  flight_number = models.CharField(null=True, blank=True, max_length=6)



class CabinCrew(models.Model):
  name = models.CharField(max_length=255)
  age = models.IntegerField()
  gender = models.CharField(max_length=100,)
  nationality = models.CharField(max_length=255)
  languages = models.JSONField()
  attendant_type = models.CharField(max_length=255, null=True, blank=True) # nullable and blank because not all attendants may have a
  flight_number = models.CharField(null=True, blank=True, max_length=6)

  # unlike pilots, attendants can use multiple vehicles
  vehicle = models.JSONField()


# each chef has 2-4 unique dishes
class Dish(models.Model):
  chef_id = models.ForeignKey(CabinCrew, on_delete=models.PROTECT)
  dish = models.TextField()


class User(models.Model):
  username = models.CharField(max_length=255)
  password = models.CharField(max_length=255)