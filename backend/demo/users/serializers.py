from django.contrib.auth.models import User
from rest_framework import serializers
from cabin_crew_information.models import CabinCrew

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = '__all__'
