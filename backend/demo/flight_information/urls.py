from django.urls import path
from . import views
from passenger_information.views import AddPassengerView

urlpatterns = [
    path('flights/', views.ListFlightsView.as_view(), name='list_flights'),
    path('flights/<str:flight_number>/', views.FlightDetailsView.as_view(), name='flight_details'),
    path('flights/<str:flight_number>/add_passenger/', AddPassengerView.as_view(), name='add_passenger'),
    path('flights/<str:flight_number>/update/', views.UpdateFlightView.as_view(), name='update_flight'),
    path('flights/<str:flight_number>/delete/', views.DeleteFlightView.as_view(), name='delete_flight'),
]