from django.contrib.postgres.fields import ArrayField
from django.db import models


class Dish(models.Model):
    dish = models.CharField(max_length=255)


class CabinCrew(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=100)
    nationality = models.CharField(max_length=255)
    languages = ArrayField(models.CharField(max_length=255))

    attendant_type = models.IntegerField() # 0 - Chef, 1 - Regular, 2 - Chief
    seniority = models.IntegerField() # 0 - Chef, 1 - Junior, 2 - Senior
    vehicle = models.ManyToManyField("flight_information.VehicleType")
    dishes = models.ManyToManyField(Dish)




