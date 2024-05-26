from django.urls import path
from .views import get_pilot_by_vehicle_type

urlpatterns = [
    path('pilots/<int:vehicle_type>/', get_pilot_by_vehicle_type, name='get_pilot_by_vehicle_type'),
]
