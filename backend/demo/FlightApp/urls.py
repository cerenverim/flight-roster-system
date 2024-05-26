from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/cabin_api/', include('cabin_crew_information.urls')),
    path('api/pilot_api/', include('flight_crew_information.urls')),
    path('api/flights_api/', include('flight_information.urls')),
    path('api/passenger_api/', include('passenger_information.urls')),
    path('api/users/', include('users.urls')),
]
