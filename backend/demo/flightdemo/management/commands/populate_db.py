from django.core.management.base import BaseCommand
from flightdemo.models import Passenger # if there is error here, try to run .py anyway
from faker import Faker
import random


class Command(BaseCommand):
    args = '<foo bar ...>'
    help = 'our help string comes here'

    def generate_passengers(self, flight_number="0001", count=100, id_start=0):

        fake = Faker()
        temp = []
        for i in range(count):
            choice = random.choice([[fake.name_male(), "Male"], [fake.name_female(), "Female"]])

            person = {"name"         : choice[0],
                      "age"          : fake.random_int(min=0, max=80),
                      "gender"       : choice[1],
                      "nationality"  : fake.country(),
                      "flight_number": ("FL" + flight_number),
                      "seat_type"    : random.choice(["economy", "business"])}

            temp.append(person)

        # put generated information in database to generate IDs for passengers
        for x in temp:

            passenger = Passenger(name=x["name"],
                                  age=x["age"],
                                  gender=x["gender"],
                                  nationality=x["nationality"],
                                  seat_type=x["seat_type"],
                                  flight_number=x["flight_number"])

            passenger.save()

            all_passengers = Passenger.objects.all()

            # Potential list of parents
            parents_m = list(filter(lambda x: x.age >= 18 and x.gender == "Male", all_passengers))
            parents_f = list(filter(lambda x: x.age >= 18 and x.gender == "Female", all_passengers))

            # potentially in the future infant should also inherit surname of one of the parents
            def assign_parents(x):
                if x.age <= 2:
                    parent1 = fake.random_elements(elements=parents_m, unique=True, length=1)[0]
                    parent2 = fake.random_elements(elements=parents_f, unique=True, length=1)[0]

                    x.seat_type = [parent1.id, parent2.id]

                    # infant inherits one of parents' nationality
                    x.nationality = random.choice([parent1.nationality, parent2.nationality])

                    x.save()

                return x

            # assign every infant a unique parent couple
            person_list = list(map(assign_parents, all_passengers))

            # DEBUG
            # print(person_list)

    def add_arguments(self, parser):
        parser.add_argument('persons')
        parser.add_argument('flight_number', nargs='?', default="0001")
        parser.add_argument('count', type=int, nargs='?', default=100)
        parser.add_argument('id_start', type=int, nargs='?', default=0)

    def handle(self, *args, **options):

        if options["persons"] == "Passenger":
            if options["id_start"]:
                self.generate_passengers(options["flight_number"], options["count"], options["id_start"])
            else:
                self.generate_passengers(options["flight_number"], options["count"])
        # WIP
        # elif args[0] == "FlightCrew":

        # elif args[0] == "CabinCrew":

        # elif args[0] == "Dish":





