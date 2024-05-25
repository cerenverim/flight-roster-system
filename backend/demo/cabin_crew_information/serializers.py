from rest_framework import serializers
from .models import CabinCrew, Dish

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = '__all__'

class CabinCrewSerializer(serializers.ModelSerializer):
    dishes = DishSerializer(read_only=True, many=True)
    class Meta:
        model = CabinCrew
        fields = '__all__'        