from django.contrib import admin
from .models import Passenger, Flight, User, FlightCrew, Crew, FlightMenu, FlightRoster

# Registering the models with the admin interface
admin.site.register(Passenger)
admin.site.register(Flight)
admin.site.register(User)
admin.site.register(FlightCrew)
admin.site.register(Crew)
admin.site.register(FlightMenu)
admin.site.register(FlightRoster)
