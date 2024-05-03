from collections import OrderedDict

from django.core.management.base import BaseCommand
from flightdemo.models import Passenger, FlightCrew, CabinCrew, Dish, Roster # if there is error here, try to run .py anyway
from faker import Faker
from faker_food import FoodProvider
import random


class Command(BaseCommand):

    def generate_passengers(self, count=100):

        fake = Faker()
        temp = []
        for i in range(count):
            choice = random.choice([[fake.first_name_male(), fake.last_name_male(), "Male"],
                                    [fake.first_name_female(), fake.last_name_female(), "Female"]])

            person = {"name"         : "{} {}".format(choice[0], choice[1]),
                      "age"          : fake.random_int(min=0, max=80),
                      "gender"       : choice[2],
                      "nationality"  : fake.country(),
                      "seat_type"    : random.choice(["economy", "business"])}

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

            person = {"name"         : "{} {}".format(choice[0], choice[1]),
                      "age"          : fake.random_int(min=18, max=60),
                      "gender"       : choice[2],
                      "nationality"  : fake.country(),
                      "languages"    : random.choice([["English", fake.language_name()],
                                                      ["English"]]),
                      "vehicle"      : random.choice(["single-aisle aircraft",
                                                     "twin-aisle aircraft",
                                                     "regional jet"]),
                      "range"        : random.choice([1500, 3000, 10000]),
                      "seniority"    : fake.random_element(elements=OrderedDict([("Senior", 0.3),
                                                                                 ("Junior", 0.3),
                                                                                 ("Trainee", 0.4)]))}
                      # flight number will be assigned during flight selection

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

            person = {"name"          : "{} {}".format(choice[0], choice[1]),
                      "age"           : fake.random_int(min=18, max=60),
                      "gender"        : choice[2],
                      "nationality"   : fake.country(),
                      "languages"     : random.choice([["English", fake.language_name()],
                                                      ["English"]]),
                      "attendant_type": fake.random_element(elements=OrderedDict([("Senior", 0.2),
                                                                                 ("Junior", 0.7),
                                                                                 ("Chef", 0.1)])),
                      "vehicle"       : fake.random_elements(elements=("single-aisle aircraft",
                                                                       "twin-aisle aircraft",
                                                                       "regional jet"),
                                                                        unique=True)}
                      # flight number will be assigned during flight selection

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

    def generate_Roster(self, count=10):

        # make sure there are enough persons to fill a maximum roster
        # a maximum roster must have:
        #   - 1 senior pilot,
        #   - 1 junior pilot,
        #   - 2 trainee pilot,
        #   - 4 senior attendent,
        #   - 16 junior attendent,
        #   - 2 chef

        fake = Faker()

        senior_pilots = FlightCrew.objects.all().filter(seniority="Senior")
        senior_pilots = list(senior_pilots)

        junior_pilots = FlightCrew.objects.all().filter(seniority="Junior")
        junior_pilots = list(junior_pilots)

        trainee_pilots = FlightCrew.objects.all().filter(seniority="Trainee")
        trainee_pilots = list(trainee_pilots)

        chefs = CabinCrew.objects.all().filter(attendant_type="Chef")
        chefs = list(chefs)

        senior_cabin_crew = CabinCrew.objects.all().filter(attendant_type="Senior")
        senior_cabin_crew = list(senior_cabin_crew)

        junior_cabin_crew = CabinCrew.objects.all().filter(attendant_type="Junior")
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
            number_of_passengers = random.choice([90, 180, 270])
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





