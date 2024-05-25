from django.urls import path
from . import views

urlpatterns = [
    path('crew/<int:vehicle_type>/', views.get_crew_by_vehicle_type, name='get_crew_by_vehicle_type'),
]