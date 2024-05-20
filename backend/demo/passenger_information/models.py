from django.db import models

class Passenger(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=100)
    nationality = models.CharField(max_length=255)
    flight_number = models.JSONField(default=list)

    # if infant(age 0-2) put 1 or 2 parent ids in seat_type
    seat_type = models.JSONField()