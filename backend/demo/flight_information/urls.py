from django.urls import path
from . import views

urlpatterns = [
    path('flights/', views.ListFlightsView.as_view(), name='list_flights'),
    path('flights/<str:flight_number>/', views.FlightDetailsView.as_view(), name='flight_details'),
    path('flights/<str:flight_number>/roster', views.RosterView.as_view(), name='roster_details'),
    path('flights/<str:flight_number>/auto_generate_roster', views.auto_generate_roster, name='generate_roster_automatically'),
]