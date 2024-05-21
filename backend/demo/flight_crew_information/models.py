from django.db import models
from django.contrib.postgres.fields import ArrayField

class FlightCrew(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=100)
    nationality = models.CharField(max_length=255)
    languages = ArrayField(models.CharField(max_length=255))

    vehicle = models.ForeignKey("flight_information.VehicleType", on_delete=models.PROTECT)
    max_range = models.IntegerField()
    seniority = models.IntegerField() # 0 - Trainee, 1 - Junior, 2 - Senior
