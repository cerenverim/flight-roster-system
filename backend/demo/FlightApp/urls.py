from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/cabin-crew/', include('cabin_crew_information.urls')),
    path('api/flight-info/', include('flight_information.urls')),
    path('api/passenger-info/', include('passenger_information.urls')),
    path('api/users/', include('users.urls')),
]
