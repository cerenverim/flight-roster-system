from django.urls import path
from . import views

urlpatterns = [
    path('flights/', views.ListFlightsView.as_view(), name='list_flights'),
    path('flights/<str:flight_number>/', views.FlightDetailsView.as_view(), name='flight_details'),
    path('flights/<str:flight_number>/assign_seats', views.assign_seats, name='flight_details'),
]