import math
import time
from datetime import timedelta
from math import log10
from collections import OrderedDict

from django.core.management.base import BaseCommand
from django.utils import timezone 
import datetime as dt 


from faker import Faker
from faker_food import FoodProvider
import random

from geopy.geocoders import Nominatim
from geopy import distance

import airportsdata

from cabin_crew_information.models import CabinCrew, Dish
from flight_crew_information.models import FlightCrew
from flight_information.models import VehicleType, Roster, Flight, SharedFlightInfo, Location
from passenger_information.models import Passenger, PlacedPassenger


class Command(BaseCommand):

    def generate_passengers(self, count=100):

        fake = Faker()
        temp = []
        for i in range(count):
            choice = random.choice([[fake.first_name_male(), fake.last_name_male(), "Male"],
                                    [fake.first_name_female(), fake.last_name_female(), "Female"]])

            person = {"name": "{} {}".format(choice[0], choice[1]),
                      "age": fake.random_int(min=0, max=80),
                      "gender": choice[2],
                      "nationality": fake.country(),
                      # 0 - Economy, 1 - Business
                      "seat_type": fake.random_element(elements=OrderedDict([(0, 0.7),
                                                                             (1, 0.3)]))}

            temp.append(person)

        # put generated information in database to generate IDs for passengers
        for x in temp:
            passenger = Passenger(name=x["name"],
                                  age=x["age"],
                                  gender=x["gender"],
                                  nationality=x["nationality"],
                                  seat_type=x["seat_type"])

            passenger.save()

        all_passengers = Passenger.objects.all()

        # Potential list of parents
        parents_m = list(filter(lambda x: x.age >= 18 and x.gender == "Male", all_passengers))
        parents_f = list(filter(lambda x: x.age >= 18 and x.gender == "Female", all_passengers))

        def assign_parents(x):
            if x.age <= 2:
                parent = fake.random_elements(elements=parents_m, unique=True, length=1)[0]

                x.seat_type = parent.seat_type

                x.save()

                x.affiliated_passenger.set([parent])

                parent.affiliated_passenger.add(x)

                # infant inherits one of parents' nationality
                x.nationality = parent.nationality

                new_name = x.name.split()

                new_name[1] = parent.name.split()[1]

                x.name = "{} {}".format(new_name[0], new_name[1])

                x.save()

            return x

        # DEBUG
        # print(list(all_passengers))

        # assign every infant a unique parent couple
        person_list = list(map(assign_parents, all_passengers))

        # DEBUG
        # print(person_list)

    def generate_flightCrew(self, count=100):

        # fake data generator
        fake = Faker()
        temp = []
        for i in range(count):
            choice = random.choice([[fake.first_name_male(), fake.last_name_male(), "Male"],
                                    [fake.first_name_female(), fake.last_name_female(), "Female"]])

            person = {"name": "{} {}".format(choice[0], choice[1]),
                      "age": fake.random_int(min=18, max=60),
                      "gender": choice[2],
                      "nationality": fake.country(),
                      "languages": random.choice([["English", fake.language_name()],
                                                  ["English"]]),
                      "vehicle": random.choice(VehicleType.objects.all()),
                      "range": random.choice([1500, 3000, 10000]),
                      # 0 - Trainee, 1 - Junior, 2 - Senior
                      "seniority": fake.random_element(elements=OrderedDict([(2, 0.3),
                                                                             (1, 0.3),
                                                                             (0, 0.4)]))}

            temp.append(person)

        # DEBUG
        # print(temp)

        for x in temp:
            flight_crew = FlightCrew(name=x["name"],
                                     age=x["age"],
                                     gender=x["gender"],
                                     nationality=x["nationality"],
                                     languages=x["languages"],
                                     vehicle=x["vehicle"],
                                     max_range=x["range"],
                                     seniority=x["seniority"])

            flight_crew.save()

    def generate_cabinCrew(self, count=100):

        fake = Faker()
        temp = []

        for i in range(count):
            choice = random.choice([[fake.first_name_male(), fake.last_name_male(), "Male"],
                                    [fake.first_name_female(), fake.last_name_female(), "Female"]])

            person = {"name": "{} {}".format(choice[0], choice[1]),
                      "age": fake.random_int(min=18, max=60),
                      "gender": choice[2],
                      "nationality": fake.country(),
                      "languages": random.choice([["English", fake.language_name()],
                                                  ["English"]]),
                      # 0 - Chef, 1 - Junior, 2 - Senior
                      "seniority": fake.random_element(elements=OrderedDict([(2, 0.2),
                                                                             (1, 0.7),
                                                                             (0, 0.1)])),
                      "vehicle": fake.random_elements(elements=list(VehicleType.objects.values_list("id", flat=True)),
                                                      unique=True)}

            temp.append(person)

        # DEBUG
        # print(temp)

        for x in temp:
            cabin_crew = CabinCrew(name=x["name"],
                                   age=x["age"],
                                   gender=x["gender"],
                                   nationality=x["nationality"],
                                   languages=x["languages"],
                                   seniority=x["seniority"])
            cabin_crew.save()

            cabin_crew.vehicle.set(x["vehicle"])

            cabin_crew.save()

    def generate_Dish(self):

        fake = Faker()
        fake.add_provider(FoodProvider)

        # 0 for chef type
        chefs = CabinCrew.objects.all().filter(seniority=0)

        if len(chefs) == 0:
            return "there are no chefs in the cabin crew\n"

        for chef in chefs:
            number_of_dishes = fake.random_int(min=2, max=4)

            # choose between 2 and 4 different dishes
            foods = fake.random_elements([fake.dish(), fake.dish(), fake.dish(), fake.dish()],
                                         length=number_of_dishes, unique=True)
            dishes = []

            for food in foods:

                dish = Dish.objects.all().filter(dish=food).first()

                # if dish type already exists
                if not dish:
                    dish = Dish(dish=food)
                    dish.save()
                dishes.append(dish)

            chef.dishes.set(dishes)

    def generate_Roster(self, flight):

        # make sure there are enough persons to fill a maximum roster
        # a maximum roster must have:
        #   - 1 senior pilot,
        #   - 1 junior pilot,
        #   - 2 trainee pilot,
        #   - 4 senior attendent,
        #   - 16 junior attendent,
        #   - 2 chef

        fake = Faker()

        selected_vehicle = random.choice(VehicleType.objects.all())

        # 0 - Trainee, 1 - Junior, 2 - Senior

        senior_pilots = FlightCrew.objects.all().filter(seniority=2,
                                                        vehicle=selected_vehicle.id)
        senior_pilots = list(senior_pilots)

        junior_pilots = FlightCrew.objects.all().filter(seniority=1,
                                                        vehicle=selected_vehicle.id)
        junior_pilots = list(junior_pilots)

        trainee_pilots = FlightCrew.objects.all().filter(seniority=0,
                                                         vehicle=selected_vehicle.id)
        trainee_pilots = list(trainee_pilots)

        # 0 - Chef, 1 - Junior, 2 - Senior

        chefs = CabinCrew.objects.all().filter(vehicle=selected_vehicle,
                                               seniority=0)
        chefs = list(chefs)

        senior_cabin_crew = CabinCrew.objects.all().filter(vehicle=selected_vehicle,
                                                           seniority=2)
        senior_cabin_crew = list(senior_cabin_crew)

        junior_cabin_crew = CabinCrew.objects.all().filter(vehicle=selected_vehicle,
                                                           seniority=1)
        junior_cabin_crew = list(junior_cabin_crew)

        # 0 - Economy, 1 - Business
        passengers_business = Passenger.objects.all().filter(flight_id="", seat_type=1)

        passengers_economy = Passenger.objects.all().filter(flight_id="", seat_type=0)

        # must contain one senior and one junior pilots
        roster_senior_pilot = random.choice(senior_pilots)
        roster_junior_pilot = random.choice(junior_pilots)

        pilot_limit = selected_vehicle.vehicle_pilot_capacity - 2

        # plane has unique trainee limit
        number_of_trainees = fake.random_int(min=0, max=min(pilot_limit, flight.flight_trainee_limit))
        roster_trainees = fake.random_elements(trainee_pilots, length=number_of_trainees, unique=True)

        pilot_limit -= number_of_trainees

        number_of_junior_pilots = fake.random_int(min=0, max=math.ceil(pilot_limit / 2))
        roster_junior_pilots = fake.random_elements(junior_pilots, length=number_of_junior_pilots, unique=True)

        # list(set()) ensures all unique objects

        roster_junior_pilots.append(roster_junior_pilot)
        roster_junior_pilots = list(set(roster_junior_pilots))

        pilot_limit -= math.ceil(pilot_limit / 2)

        number_of_senior_pilots = fake.random_int(min=0, max=pilot_limit)
        roster_senior_pilots = fake.random_elements(senior_pilots, length=number_of_senior_pilots, unique=True)

        roster_senior_pilots.append(roster_senior_pilot)
        roster_senior_pilots = list(set(roster_senior_pilots))

        # at least one senior and 4 junior cabin crew

        min_cabin_senior = random.choice(senior_cabin_crew)

        number_of_juniors = fake.random_int(min=4, max=4)
        min_cabin_junior = fake.random_elements(junior_cabin_crew, length=number_of_juniors, unique=True)

        cabin_limit = selected_vehicle.vehicle_crew_capacity - 5

        number_of_seniors = fake.random_int(min=0, max=min(3, cabin_limit))
        roster_senior_cabin = fake.random_elements(senior_cabin_crew, length=number_of_seniors, unique=True)

        roster_senior_cabin.append(min_cabin_senior)
        roster_senior_cabin = list(set(roster_senior_cabin))

        cabin_limit -= number_of_seniors

        number_of_juniors = fake.random_int(min=0, max=min(12, cabin_limit))
        roster_junior_cabin = fake.random_elements(junior_cabin_crew, length=number_of_juniors, unique=True)

        roster_junior_cabin = min_cabin_junior + roster_junior_cabin

        roster_junior_cabin = list(set(roster_junior_cabin))

        cabin_limit -= number_of_juniors

        number_of_chefs = fake.random_int(min=0, max=min(2, cabin_limit))
        roster_chefs = fake.random_elements(chefs, length=number_of_chefs, unique=True)

        flight_menu = []

        # chef specialities added to flight menu
        for chef in roster_chefs:
            for dish in chef.dishes.all():
                flight_menu.append(dish)

        # add one standard menu assigned to selected vehicle type
        flight_menu.append(selected_vehicle.std_menu.all().first())

        flight_menu = list(set(flight_menu))

        passengers_business = fake.random_elements(list(passengers_business),
                                                   length=selected_vehicle.vehicle_business_seats,
                                                   unique=True)
        passengers_economy = fake.random_elements(list(passengers_economy),
                                                   length=selected_vehicle.vehicle_passenger_capacity - selected_vehicle.vehicle_business_seats,
                                                   unique=True)

        passengers = passengers_economy + passengers_business

        # the choice is between plane passenger capacities
        number_of_passengers = selected_vehicle.vehicle_passenger_capacity

        roster_passengers = fake.random_elements(list(passengers), length=number_of_passengers, unique=True)

        for passenger in roster_passengers:

            if passenger.age <= 2:
                parent = passenger.affiliated_passenger.all().first()

                if parent not in roster_passengers:

                    replaced_passenger_index = random.randrange(number_of_passengers)

                    # find passenger with not dependents
                    while roster_passengers[replaced_passenger_index].affiliated_passenger.all().first() is not None \
                            and roster_passengers[replaced_passenger_index].affiliated_passenger.all().first().seat_type != parent.seat_type:
                        replaced_passenger_index = random.randrange(number_of_passengers)

                    roster_passengers[replaced_passenger_index] = parent

                    # remove seat assignment from other plane
                    if PlacedPassenger.objects.all().filter(passenger=parent):
                        PlacedPassenger.objects.all().filter(passenger=parent).delete()
                        parent.seat_no = None

        for passenger in roster_passengers:

            passenger.flight_id = flight.flight_number
            passenger.save()

        placed_passengers = []

        # assign seats for plane
        for i in range(1, len(roster_passengers) + 1):

            passenger = roster_passengers[i-1]
            placed_passenger = PlacedPassenger(passenger=passenger,
                                               seat_no=i)
            placed_passenger.save()
            placed_passengers.append(placed_passenger)

            passenger.seat_no = i
            passenger.save()

        random.shuffle(roster_passengers)

        roster = Roster()
        roster.save()

        roster_junior_pilot_ids = [pilot.id for pilot in roster_junior_pilots]
        roster_senior_pilot_ids = [pilot.id for pilot in roster_senior_pilots]
        roster_trainee_ids = [trainee.id for trainee in roster_trainees]
        roster_senior_cabin_ids = [cabin.id for cabin in roster_senior_cabin]
        roster_junior_cabin_ids = [cabin.id for cabin in roster_junior_cabin]
        roster_chef_ids = [chef.id for chef in roster_chefs]
        roster_placed_passenger_ids = [passenger.id for passenger in placed_passengers]
        flight_menu_ids = [menu.id for menu in flight_menu]

        roster.flight_crew_junior.set(roster_junior_pilot_ids)
        roster.flight_crew_senior.set(roster_senior_pilot_ids)
        roster.flight_crew_trainee.set(roster_trainee_ids)
        roster.flight_cabin_crew_senior.set(roster_senior_cabin_ids)
        roster.flight_cabin_crew_junior.set(roster_junior_cabin_ids)
        roster.flight_cabin_crew_chef.set(roster_chef_ids)
        roster.flight_passengers.set(roster_placed_passenger_ids)
        roster.flight_menu.set(flight_menu_ids)

        roster.save()

        flight.flight_roster = roster

        flight.save()

    def generate_database(self):

        self.generate_passengers(2000)
        self.load_vehicle_types()
        self.generate_flightCrew(100)
        self.generate_cabinCrew(700)
        self.generate_Dish()
        self.load_airport_data()
        for flight_count in range(1, 11):
            self.auto_full_flight(flight_count)
        Passenger.objects.all().filter(flight_id="").delete()

    def delete_database(self):
        PlacedPassenger.objects.all().delete()
        SharedFlightInfo.objects.all().delete()
        Flight.objects.all().delete()
        Roster.objects.all().delete()
        FlightCrew.objects.all().delete()
        VehicleType.objects.all().delete()
        Dish.objects.all().delete()
        CabinCrew.objects.all().delete()
        Passenger.objects.all().delete()


    def load_vehicle_types(self):
        if not VehicleType.objects.all().filter(vehicle_name="single-aisle aircraft"):

            brownie_dish = Dish.objects.all().filter(dish="Brownie")
            if not brownie_dish:
                dish = Dish(dish="Brownie")
                dish.save()
                brownie_dish = dish

            vehicle = VehicleType(vehicle_name="twin-aisle aircraft",
                                  vehicle_passenger_capacity=180,
                                  vehicle_crew_capacity=20,
                                  vehicle_pilot_capacity=8,
                                  vehicle_business_seats=60,
                                  vehicle_seating_plan=0)
            vehicle.save()

            vehicle.std_menu.set([brownie_dish])
            vehicle.save()

        if not VehicleType.objects.all().filter(vehicle_name="twin-aisle aircraft"):

            bread_roll_dish = Dish.objects.all().filter(dish="Bread Roll")
            if not bread_roll_dish:
                dish = Dish(dish="Bread Roll")
                dish.save()
                bread_roll_dish = dish

            vehicle = VehicleType(vehicle_name="single-aisle aircraft",
                                  vehicle_passenger_capacity=80,
                                  vehicle_crew_capacity=12,
                                  vehicle_pilot_capacity=4,
                                  vehicle_business_seats=20,
                                  vehicle_seating_plan=1)
            vehicle.save()

            vehicle.std_menu.set([bread_roll_dish])
            vehicle.save()

        if not VehicleType.objects.all().filter(vehicle_name="regional jet"):

            baklava_dish = Dish.objects.all().filter(dish="Baklava")
            if not baklava_dish:
                dish = Dish(dish="Baklava")
                dish.save()
                baklava_dish = dish

            vehicle = VehicleType(vehicle_name="regional jet",
                                  vehicle_passenger_capacity=20,
                                  vehicle_crew_capacity=6,
                                  vehicle_pilot_capacity=2,
                                  vehicle_business_seats=20,
                                  vehicle_seating_plan=2)
            vehicle.save()

            vehicle.std_menu.set([baklava_dish])
            vehicle.save()

    # not in use
    def extract_place_info(self):

        cities = []
        countries = []
        codes = []

        with open('airports.txt', 'r', encoding='utf-8') as file:
            for line in file:
                parts = line.strip().split()
                city, country, code = ' '.join(parts[:-2]), parts[-2], parts[-1]

                cities.append(city)
                countries.append(country)
                codes.append(code)

        return cities, countries, codes

    # not in use
    def write_latitude_longitude(self, cities, countries, codes):

        city_coords = []
        geolocator = Nominatim(user_agent="my_app")

        for city, country, code in zip(cities, countries, codes):
            location = geolocator.geocode(city)

            if location:
                latitude = location.latitude
                longitude = location.longitude

                coords = "{}_{}_{}_{}_{}\n".format(city, country, code, latitude, longitude)
                city_coords.append(coords)
            else:
                print(f"Location not found for {city}")

            # Delay for 1 second before making the next request
            time.sleep(1)

        with open('airport_geodata.txt', 'w') as file:
            for coords in city_coords:
                file.write(coords)

    def load_airport_data(self):

        # data already loaded
        if len(Location.objects.all()) > 0:
            return

        airport_data = []

        with open('airport_geodata.txt', 'r', encoding='utf-8') as file:
            for line in file:
                city, country, code, latitude, longitude = line.strip().split("_")

                airport_dict = {
                    'City': city,
                    'Country': country,
                    'Code': code,
                    'Latitude': latitude,
                    'Longitude': longitude
                }

                airport_data.append(airport_dict)

        airports = airportsdata.load('IATA')
        for data in airport_data:

            try:
                airport_name = airports[data["Code"]]["name"]
            except KeyError:
                airport_name = "undefined"

            location = Location(country=data["Country"],
                                city=data["City"],
                                airport_name=airport_name,
                                airport_code=data["Code"])

            location.save()
        Location.objects.all().filter(airport_name="undefined").delete()

    def round_to_nearest_15_minutes(self, dt):
        # Round down to the nearest 15-minute interval
        rounded_minute = (dt.minute // 15) * 15

        return dt.replace(minute=rounded_minute, second=0, microsecond=0)

    def generate_Flight(self, flight_number_count):

        fake = Faker()

        flight_number = "FL{}{}".format("0" * (4 - (int(log10(flight_number_count)) + 1)), flight_number_count)

        flight_date = timezone.make_aware(self.round_to_nearest_15_minutes(fake.future_datetime()),
                                          timezone=dt.timezone.utc)

        # inactive distance algorithm, duration scales with distance so its deactivated

        """flight_distance = int(distance.distance((airport1["Latitude"], airport1["Longitude"]),
                                                   (airport2["Latitude"], airport2["Longitude"])).km)
    
        flight_duration = timedelta(days=0, hours=0, minutes=((flight_distance // 10) // 15) * 15)"""

        location_src, location_dest = fake.random_elements(list(Location.objects.all()), length=2, unique=True)

        vehicle_type = random.choice(VehicleType.objects.all())

        flight = Flight(flight_number=flight_number,
                        flight_roster=None,
                        flight_trainee_limit=random.randrange(3),

                        flight_src=location_src,

                        flight_date=flight_date,
                        flight_duration=timedelta(days=0, hours=0, minutes=0),
                        flight_distance=0,

                        flight_dest=location_dest,

                        vehicle_type=vehicle_type,
                        shared_flight=None)

        flight.save()

        return flight_number


    def generate_shared_flight_info(self, flight):

        fake = Faker()

        shared_flight_companies = ["SkyLink Airways",
                                   "AeroVista Airlines",
                                   "Blue Horizon Flights",
                                   "Phoenix Air Express",
                                   "StarGlide Aviation"]

        shared_initials = ["SL", "AV", "BH", "PA", "SG"]

        number_of_flights = len(list(Flight.objects.all()))

        random_select = random.randint(0, 4)

        # UPTO 4 digits
        random_shared_number = fake.random_number(digits=4)
        shared_flight_number = "{}{}{}".format(shared_initials[random_select],
                                               "0" * (4 - int(log10(random_shared_number) + 1)),
                                               random_shared_number)

        shared_flight_company = shared_flight_companies[random_select]

        shared_flight_info = SharedFlightInfo(shared_flight_number=shared_flight_number,
                                              shared_flight_company=shared_flight_company)

        shared_flight_info.save()

        flight.shared_flight = shared_flight_info

        flight.save()

    def auto_full_flight(self, flight_number_count):

        flight_number = self.generate_Flight(flight_number_count)

        flight = Flight.objects.all().filter(flight_number=flight_number).first()

        coin_flip = random.randint(0, 1)

        if coin_flip:
            self.generate_shared_flight_info(flight)

        self.generate_Roster(flight)

    def add_arguments(self, parser):
        parser.add_argument('persons')
        parser.add_argument('count', type=int, nargs='?', default=100)

        # parser.add_argument('flight_number', nargs='?', default="0001")

        # WIP
        # parser.add_argument('id_start', type=int, nargs='?', default=0)

    def handle(self, *args, **options):

        if options["persons"] == "Passenger":
            self.generate_passengers(options["count"])

        elif options["persons"] == "FlightCrew":
            self.generate_flightCrew(options["count"])

        elif options["persons"] == "CabinCrew":
            self.generate_cabinCrew(options["count"])

        elif options["persons"] == "Dish":
            self.generate_Dish()

        elif options["persons"] == "Roster":
            self.generate_Roster(options["count"])
        elif options["persons"] == "generate_database":
            self.generate_database()
        elif options["persons"] == "delete_database":
            self.delete_database()
