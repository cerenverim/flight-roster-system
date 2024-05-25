from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import FlightCrew
from flight_information.models import VehicleType
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class PilotTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        user = User.objects.create_user(username='testuser', password='testpassword')
        token, created = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)


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

        self.pilot1 = FlightCrew.objects.create(
            name='John Doe',
            age=30,
            gender='Male',
            nationality='US',
            languages=['English', 'Spanish'],
            vehicle=self.vehicle_type,
            max_range=1000,
            seniority=1
        )

        self.pilot2 = FlightCrew.objects.create(
            name='Man Doe',
            age=30,
            gender='Male',
            nationality='US',
            languages=['English', 'Spanish'],
            vehicle=self.vehicle_type2,
            max_range=1000,
            seniority=2
        )


    def test_get_pilot_by_vehicle_type_valid(self):
        url = reverse('get_pilot_by_vehicle_type', args=[self.vehicle_type.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'John Doe')

    def test_get_pilot_by_vehicle_type_invalid(self):
        url = '/api/pilots_api/pilots/a/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_pilot_by_vehicle_type_nonexistant(self):
        url = '/api/pilot_api/pilots/9/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)