from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import CabinCrew, Dish
from flight_information.models import VehicleType
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class CrewTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        user = User.objects.create_user(username='testuser', password='testpassword')
        token, created = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        self.dish1 = Dish.objects.create(dish='Pasta')
        self.dish2 = Dish.objects.create(dish='Salad')
        self.dish3 = Dish.objects.create(dish='Cake')


        self.vehicle_type = VehicleType.objects.create(
            vehicle_name='Boeing 747',
            vehicle_crew_capacity=10,
            vehicle_pilot_capacity=2,
            vehicle_passenger_capacity=300,
            vehicle_business_seats=20,
            vehicle_seating_plan=3
        )

        self.vehicle_type2 = VehicleType.objects.create(
            vehicle_name='Supreme Vehicle',
            vehicle_crew_capacity=10,
            vehicle_pilot_capacity=2,
            vehicle_passenger_capacity=300,
            vehicle_business_seats=20,
            vehicle_seating_plan=3
        )

        self.vehicle_type.std_menu.add(self.dish1, self.dish2)
        self.vehicle_type2.std_menu.add(self.dish3)


        self.crew1 = CabinCrew.objects.create(
            name='John Doe',
            age=30,
            gender='Male',
            nationality='US',
            seniority=1,
            languages=["Turkish"]
        )

        self.crew1.vehicle.add(self.vehicle_type)
        self.crew1.vehicle.add(self.vehicle_type2)

        self.crew2 = CabinCrew.objects.create(
            name='Jane Smith',
            age=25,
            gender='Female',
            nationality='UK',
            seniority=2,
            languages=["English"]
        )


        self.crew2.vehicle.add(self.vehicle_type2)


    def test_get_crew_by_vehicle_type_valid(self):
        url = reverse('get_crew_by_vehicle_type', args=[self.vehicle_type.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'John Doe')

    def test_get_crew_by_vehicle_type_invalid(self):
        url = '/api/cabin_api/crew/a/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_crew_by_vehicle_type_nonexistant(self):
        url = '/api/cabin_api/crew/9/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)