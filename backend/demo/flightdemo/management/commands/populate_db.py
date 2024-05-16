import time
from datetime import timedelta
from math import log10
from collections import OrderedDict

from django.core.management.base import BaseCommand
from django.utils import timezone
from flightdemo.models import Flight, Passenger, FlightCrew, CabinCrew, Dish, Roster, VehicleType, SharedFlightInfo # if there is error here, try to run .py anyway
from faker import Faker
from faker_food import FoodProvider
import random

from geopy.geocoders import Nominatim
from geopy import distance

import airportsdata

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
                      "seat_type": fake.random_element(elements=OrderedDict([("Economy", 0.9),
                                                                             ("Business", 0.1)]))}

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
                parent1 = fake.random_elements(elements=parents_m, unique=True, length=1)[0]
                parent2 = fake.random_elements(elements=parents_f, unique=True, length=1)[0]

                x.seat_type = [parent1.id, parent2.id]

                # infant inherits one of parents' nationality
                x.nationality = parent1.nationality

                new_name = x.name.split()

                new_name[1] = parent1.name.split()[1]

                x.name = "{} {}".format(new_name[0], new_name[1])

                x.save()

            return x

        # assign every infant a unique parent couple
        person_list = list(map(assign_parents, all_passengers))

        # DEBUG
        # print(person_list)

    def generate_flightCrew(self, count=100):

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
                      "seniority": fake.random_element(elements=OrderedDict([("Senior", 0.3),
                                                                             ("Junior", 0.3),
                                                                             ("Trainee", 0.4)]))}

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
                                     range=x["range"],
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
                      "attendant_type": fake.random_element(elements=OrderedDict([("Senior", 0.2),
                                                                                  ("Junior", 0.7),
                                                                                  ("Chef", 0.1)])),
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
                                   attendant_type=x["attendant_type"],
                                   vehicle=x["vehicle"])
            cabin_crew.save()

    def generate_Dish(self):

        fake = Faker()
        fake.add_provider(FoodProvider)

        temp = []

        chefs = CabinCrew.objects.all().filter(attendant_type="Chef")

        if len(chefs) == 0:
            return "there are no chefs in the cabin crew\n"

        for chef in chefs:
            number_of_dishes = fake.random_int(min=2, max=4)

            foods = fake.random_elements([fake.dish(), fake.dish(), fake.dish(), fake.dish()],
                                         length=number_of_dishes, unique=True)
            for food in foods:
                food = {"chef_id": chef, "dish": food}

                temp.append(food)

        # DEBUG
        # print(temp)

        for x in temp:
            dish = Dish(chef_id=x["chef_id"], dish=x["dish"])

            dish.save()

    def generate_Roster(self, count=10, flight_number="FL0001"):

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

        senior_pilots = FlightCrew.objects.all().filter(seniority="Senior",
                                                        vehicle=selected_vehicle.id)
        senior_pilots = list(senior_pilots)

        junior_pilots = FlightCrew.objects.all().filter(seniority="Junior",
                                                        vehicle=selected_vehicle.id)
        junior_pilots = list(junior_pilots)

        trainee_pilots = FlightCrew.objects.all().filter(seniority="Trainee",
                                                         vehicle=selected_vehicle.id)
        trainee_pilots = list(trainee_pilots)

        chefs = CabinCrew.objects.all().filter(vehicle__contains=[selected_vehicle.id],
                                               attendant_type="Chef")
        chefs = list(chefs)

        senior_cabin_crew = CabinCrew.objects.all().filter(vehicle__contains=[selected_vehicle.id],
                                                           attendant_type="Senior")
        senior_cabin_crew = list(senior_cabin_crew)

        junior_cabin_crew = CabinCrew.objects.all().filter(vehicle__contains=[selected_vehicle.id],
                                                           attendant_type="Junior")
        junior_cabin_crew = list(junior_cabin_crew)

        passengers = Passenger.objects.all()
        passengers = list(passengers)

        for i in range(count):

            roster_senior_pilot = random.choice(senior_pilots)
            roster_junior_pilot = random.choice(junior_pilots)

            number_of_trainees = fake.random_int(min=0, max=2)
            roster_trainees = fake.random_elements(trainee_pilots, length=number_of_trainees, unique=True)

            number_of_seniors = fake.random_int(min=1, max=4)
            roster_seniors = fake.random_elements(senior_cabin_crew, length=number_of_seniors, unique=True)

            number_of_juniors = fake.random_int(min=4, max=16)
            roster_juniors = fake.random_elements(junior_cabin_crew, length=number_of_juniors, unique=True)

            number_of_chefs = fake.random_int(min=0, max=2)
            roster_chefs = fake.random_elements(chefs, length=number_of_chefs, unique=True)

            # the choice is between plane capacities (accounting for parents)
            number_of_passengers = (selected_vehicle.vehicle_capacity-10)
            roster_passengers = fake.random_elements(passengers, length=number_of_passengers, unique=True)

            for passenger in roster_passengers:

                if passenger.age <= 2:
                    parent1_ID = passenger.seat_type[0]
                    parent2_ID = passenger.seat_type[1]

                    parent1 = Passenger.objects.get(pk=parent1_ID)
                    parent2 = Passenger.objects.get(pk=parent2_ID)

                    if parent1 not in roster_passengers:
                        roster_passengers.append(parent1)

                    if parent2 not in roster_passengers:
                        roster_passengers.append(parent2)

            roster_senior_pilot.flight_number.append(flight_number)
            roster_senior_pilot.save()
            roster_junior_pilot.flight_number.append(flight_number)
            roster_junior_pilot.save()

            for trainee in roster_trainees:
                trainee.flight_number.append(flight_number)
                trainee.save()

            for senior in roster_seniors:
                senior.flight_number.append(flight_number)
                senior.save()

            for junior in roster_juniors:
                junior.flight_number.append(flight_number)
                junior.save()

            for chef in roster_chefs:
                chef.flight_number.append(flight_number)
                chef.save()

            for passenger in roster_passengers:
                passenger.flight_number.append(flight_number)
                passenger.save()

            random.shuffle(roster_passengers)

            roster = Roster(flight_crew_junior=roster_junior_pilot,
                            flight_crew_senior=roster_senior_pilot)
            roster.save()

            roster.flight_crew_trainee.set(roster_trainees)
            roster.flight_cabin_crew_junior.set(roster_juniors)
            roster.flight_cabin_crew_senior.set(roster_seniors)
            roster.flight_cabin_crew_chef.set(roster_chefs)
            roster.flight_passengers.set(roster_passengers)

            roster.save()

    def rosterize(self):

        total_passengers = len(Passenger.objects.all())
        flight_number_count = 0

        for i in range(int(total_passengers * 0.005)):
            flight_number = "FL{}{}".format("0" * (4 - (int(log10(flight_number_count + 1)) + 1)),
                                            (flight_number_count + 1))

            self.generate_Roster(1, flight_number)

            flight_number_count = flight_number_count + 1

        Passenger.objects.all().filter(flight_number=[]).delete()

    def generate_database(self):

        self.generate_passengers(5000)
        self.load_vehicle_types()
        self.generate_flightCrew(100)
        self.generate_cabinCrew(300)
        self.generate_Dish()
        self.rosterize()
        self.plan_flight_for_rosters()


    def delete_database(self):
        SharedFlightInfo.objects.all().delete()
        Flight.objects.all().delete()
        Roster.objects.all().delete()
        FlightCrew.objects.all().delete()
        VehicleType.objects.all().delete()
        Dish.objects.all().delete()
        CabinCrew.objects.all().delete()
        Passenger.objects.all().delete()

    def load_vehicle_types(self):

        vehicle = VehicleType(vehicle_name="single-aisle aircraft",
                              vehicle_capacity=200,
                              vehicle_seating_plan=0,
                              vehicle_menu="Brownie")
        vehicle.save()

        vehicle = VehicleType(vehicle_name="twin-aisle aircraft",
                              vehicle_capacity=300,
                              vehicle_seating_plan=1,
                              vehicle_menu="Bread Roll")
        vehicle.save()

        vehicle = VehicleType(vehicle_name="regional jet",
                              vehicle_capacity=100,
                              vehicle_seating_plan=3,
                              vehicle_menu="Baklava")
        vehicle.save()

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
        airport_data = []

        with open('airport_geodata.txt', 'r', encoding='utf-8') as file:
            for line in file:
                city, country, code, latitude, longitude = line.strip().split("_")

                airport_dict = {
                    'City'     : city,
                    'Country'  : country,
                    'Code'     : code,
                    'Latitude' : latitude,
                    'Longitude': longitude
                }

                airport_data.append(airport_dict)

        return airport_data

    def round_to_nearest_15_minutes(self, dt):
        # Round down to the nearest 15-minute interval
        rounded_minute = (dt.minute // 15) * 15

        return dt.replace(minute=rounded_minute, second=0, microsecond=0)

    def generate_Flight(self, airport_data, flight_number_count):

        turkish_airports     = list(filter(lambda airport: airport['Country'] == 'Turkey', airport_data))
        non_turkish_airports = list(filter(lambda airport: airport['Country'] != 'Turkey', airport_data))

        fake = Faker()

        flight_number = "FL{}{}".format("0" * (4 - (int(log10(flight_number_count)) + 1)), flight_number_count)

        flight_roster = Roster.objects.all()[flight_number_count-1]

        flight_type = random.choice(["International", "Domestic"])

        if flight_type == "International":
            airport1 = random.choice(turkish_airports)
            airport2 = random.choice(non_turkish_airports)
        else:
            airport1, airport2 = fake.random_elements(turkish_airports, unique=True, length=2)

        flight_date = timezone.make_aware(self.round_to_nearest_15_minutes(fake.future_datetime()), timezone=timezone.utc)

        flight_distance = int(distance.distance((airport1["Latitude"], airport1["Longitude"]),
                                                (airport2["Latitude"], airport2["Longitude"])).km)

        flight_duration = timedelta(days=0, hours=0, minutes=((flight_distance // 10) // 15) * 15)

        airports = airportsdata.load('IATA')
        try:
            airport1_name = airports[airport1["Code"]]["name"]
            airport2_name = airports[airport2["Code"]]["name"]
        except KeyError:
            airport1_name = "undefined"
            airport2_name = "undefined"

        vehicle_type = flight_roster.flight_crew_senior.vehicle

        flight = Flight(flight_number=flight_number,
                        flight_roster=flight_roster,

                        flight_src_country=airport1["Country"],
                        flight_src_city=airport1["City"],
                        flight_src_airport_name=airport1_name,
                        flight_src_airport_code=airport1["Code"],

                        flight_date=flight_date,
                        flight_duration=flight_duration,
                        flight_distance=flight_distance,

                        flight_dest_country=airport2["Country"],
                        flight_dest_city=airport2["City"],
                        flight_dest_airport_name=airport2_name,
                        flight_dest_airport_code=airport2["Code"],

                        vehicle_type=vehicle_type,
                        shared_flight=None)

        flight.save()

        return flight_number_count

    def shared_flight_info_set(self):

        fake = Faker()

        shared_flight_companies = ["SkyLink Airways",
                                   "AeroVista Airlines",
                                   "Blue Horizon Flights",
                                   "Phoenix Air Express",
                                   "StarGlide Aviation"]

        shared_initials = ["SL", "AV", "BH", "PA", "SG"]

        flights = list(Flight.objects.all())

        for i in range(int(len(flights) * 0.2)):
            random_select = random.randint(0, 4)

            # UPTO 4 digits
            random_shared_number = fake.random_number(digits=4)
            shared_flight_number = "{}{}{}".format(shared_initials[random_select],
                                                   "0" * (4 - int(log10(random_shared_number) + 1)),
                                                   random_shared_number)

            random_flight, random_connecting_flight = fake.random_elements(flights, unique=True, length=2)

            shared_flight_company = shared_flight_companies[random_select]

            shared_flight_info = SharedFlightInfo(shared_flight_number=shared_flight_number,
                                                  shared_flight_company=shared_flight_company,
                                                  connecting_flight=random_connecting_flight)

            shared_flight_info.save()

            random_flight.shared_flight = shared_flight_info

            random_flight.save()

    def plan_flight_for_rosters(self):

        airport_data = self.load_airport_data()

        roster_count = len(Roster.objects.all())

        for i in range(roster_count):
            self.generate_Flight(airport_data, roster_count-i)

        self.shared_flight_info_set()


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
        elif options["persons"] == "Rosterize":
            self.rosterize()
        elif options["persons"] == "generate_database":
            self.generate_database()
        elif options["persons"] == "delete_database":
            self.delete_database()


