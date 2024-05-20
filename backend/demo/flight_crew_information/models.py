from django.db import models

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

class FlightCrew(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=100)
    nationality = models.CharField(max_length=255)
    languages = models.JSONField()
    vehicle = models.ForeignKey(VehicleType, on_delete=models.PROTECT)
    range = models.IntegerField()
    seniority = models.CharField(max_length=255)
    flight_number = models.JSONField(default=list)