from django.db import models


class Passenger(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=100)
    nationality = models.CharField(max_length=255)

    flight_id = models.CharField(max_length=6)

    seat_no = models.IntegerField(blank=True, null=True)
    seat_type = models.IntegerField()  # 0 - Economy, 1 - Business
    # If age 0-2, this is parent info. If not, this is affiliated passenger
    affiliated_passenger = models.ManyToManyField('self', blank=True)

class PlacedPassenger(models.Model):
    passenger = models.OneToOneField(Passenger, on_delete=models.PROTECT)
    seat_no = models.IntegerField()