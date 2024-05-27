from django.urls import path
from . import views

urlpatterns = [
    path('flights/', views.ListFlightsView.as_view(), name='list_flights'),
    path('flights/<str:flight_number>/', views.FlightDetailsView.as_view(), name='flight_details'),
    path('flights/<str:flight_id>/roster/', views.get_roster_by_flight, name='get_roster_by_flight'),
    path('flights/<str:flight_number>/auto_generate_roster/', views.auto_generate_roster, name='auto_generate_roster'),
    path('flights/<str:flight_number>/manual_generate_roster/', views.manual_generate_roster, name='auto_generate_roster'),
    path('flights/<str:flight_id>/roster/json', views.download_json, name='download_json'),
    path('flights/<str:flight_id>/roster/nosql', views.download_nosql, name='download_nosql'),
    path('flights/<str:flight_id>/roster/sql', views.download_sql, name='download_sql'),
    path('flights/<str:flight_number>/delete_roster/', views.delete_roster, name='delete_roster'),
]