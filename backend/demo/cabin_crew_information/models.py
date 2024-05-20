from django.db import models

class CabinCrew(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=100, )
    nationality = models.CharField(max_length=255)
    languages = models.JSONField()
    attendant_type = models.CharField(max_length=255, null=True, blank=True)  # nullable and blank because not all attendants may have a
    # unlike pilots, attendants can use multiple vehicles
    vehicle = models.JSONField()
    flight_number = models.JSONField(default=list)

# each chef has 2-4 unique dishes
class Dish(models.Model):
    chef_id = models.ForeignKey(CabinCrew, on_delete=models.PROTECT)
    dish = models.TextField()
