from django.urls import path
from . import views


urlpatterns = [
    path('flights/', views.ListFlightsView.as_view(), name='list_flights'),
    path('flights/<str:flight_number>/', views.FlightDetailsView.as_view(), name='flight_details'),
    path('flights/<str:flight_number>/add_passenger/', views.AddPassengerView.as_view(), name='add_passenger'),
    path("", views.home, name="home"),
    path('register', views.register, name="register"),
    path('login', views.login, name="login"),
    path('test_token', views.test_token, name="test_token"),
]