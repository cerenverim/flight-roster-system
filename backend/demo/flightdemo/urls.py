from django.urls import path
from . import views


urlpatterns = [
    path('flights/', ListFlightsView.as_view(), name='list_flights'),
    path("", views.home, name="home"),
    path('register', views.register, name="register"),
    path('login', views.login, name="login"),
    path('test_token', views.test_token, name="test_token"),
]