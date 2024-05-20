from rest_framework import serializers
from cabin_crew_information.models import CabinCrew

class CabinCrewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CabinCrew
        fields = '__all__'        