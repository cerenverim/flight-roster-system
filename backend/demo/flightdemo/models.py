from django.db import models

class Passenger(models.Model):
  name = models.CharField(max_length=255)
  age = models.IntegerField()
  gender = models.CharField(max_length=100)
  nationality = models.CharField(max_length=255)
  seat_type = models.CharField(max_length=100)
  seat_info = models.CharField(max_length=255)

class Flight(models.Model):
  flight_number = models.CharField(max_length=255)
  flight_info = models.TextField()
  flight_source = models.CharField(max_length=255)
  flight_dest = models.CharField(max_length=255)
  vehicle_type = models.CharField(max_length=255)
  shared_flight = models.BooleanField()

class User(models.Model):
  username = models.CharField(max_length=255)
  password = models.CharField(max_length=255)

class FlightCrew(models.Model):
  pilot_id = models.ForeignKey(User, on_delete=models.CASCADE)

class Crew(models.Model):
  attendant_id = models.CharField(max_length=255)
  attendant_info = models.TextField()
  attendant_type = models.CharField(max_length=255, null=True, blank=True)  #nullable and blank because not all attendants may have a type

class FlightMenu(models.Model):
  dishes = models.TextField()

class FlightRoster(models.Model):
  flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
  crew = models.ForeignKey(Crew, on_delete=models.CASCADE)