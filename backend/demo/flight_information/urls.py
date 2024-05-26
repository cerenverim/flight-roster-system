from django.urls import path
from . import views

urlpatterns = [
    path('flights/', views.ListFlightsView.as_view(), name='list_flights'),
    path('flights/<str:flight_number>/', views.FlightDetailsView.as_view(), name='flight_details'),
    path('flights/<str:flight_id>/roster/', views.get_roster_by_flight, name='get_roster_by_flight'),
    path('flights/<str:flight_number>/auto_generate_roster/', views.auto_generate_roster, name='auto_generate_roster'),
    path('flights/<str:flight_number>/delete_roster/', views.delete_roster, name='delete_roster'),
]