# tests.py
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import Flight, Location, VehicleType
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token



class FlightTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        user = User.objects.create_user(username='testuser', password='testpassword')
        token, created = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        self.location1 = Location.objects.create(country='USA', city='New York', airport_name='JFK', airport_code='JFK')
        self.location2 = Location.objects.create(country='UK', city='London', airport_name='Heathrow', airport_code='LHR')

        self.vehicle_type = VehicleType.objects.create(
            vehicle_name='Boeing 747',
            vehicle_crew_capacity=10,
            vehicle_pilot_capacity=2,
            vehicle_passenger_capacity=300,
            vehicle_business_seats=20,
            vehicle_seating_plan=3
        )

        self.flight1 = Flight.objects.create(
            flight_number='AA123',
            flight_trainee_limit=2,
            flight_date='2024-05-22T11:22:31Z',
            flight_duration='01:00:00',
            flight_distance=500,
            flight_src=self.location1,
            flight_dest=self.location2,
            vehicle_type=self.vehicle_type,
        )

        self.flight2 = Flight.objects.create(
            flight_number='AA124',
            flight_trainee_limit=3,
            flight_date='2024-05-22T12:22:31Z',
            flight_duration='02:00:00',
            flight_distance=1000,
            flight_src=self.location2,
            flight_dest=self.location1,
            vehicle_type=self.vehicle_type,
        )

    def test_get_all_flights(self):
        url = reverse('list_flights')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['flight_number'], 'AA123')
        self.assertEqual(response.data[1]['flight_number'], 'AA124')

    def test_get_single_flight(self):
        url = reverse('flight_details', args=['AA123'])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['flight_number'], 'AA123')
        self.assertEqual(response.data['flight_trainee_limit'], 2)
        self.assertEqual(response.data['flight_date'], '2024-05-22T11:22:31Z')
        self.assertEqual(response.data['flight_duration'], '01:00:00')
        self.assertEqual(response.data['flight_distance'], 500)
        self.assertEqual(response.data['flight_src'], self.location1.airport_code)
        self.assertEqual(response.data['flight_dest'], self.location2.airport_code)
        self.assertEqual(response.data['vehicle_type'], self.vehicle_type.id)

    def test_get_single_flight_nonexistant(self):
        url = reverse('flight_details', args=['CC999'])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class DownloadRosterTestCase(APITestCase):
    fixtures = ['db_out.json']

    def setUp(self):
        self.client = APIClient()
        user = User.objects.create_user(username='testuser', password='testpassword')
        token, created = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def test_json_download(self):
        url = reverse('download_json', args=['AA103'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')
        self.assertIn('attachment', response['Content-Disposition'])
        self.assertTrue(response.content)

    def test_nosql_download(self):
        url = reverse('download_nosql', args=['AA103'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/bson')
        self.assertIn('attachment', response['Content-Disposition'])
        self.assertTrue(response.content)

    def test_sql_download(self):
        url = reverse('download_sql', args=['AA103'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/db')
        self.assertIn('attachment', response['Content-Disposition'])
        self.assertTrue(response.content)

class RosterCreationTestCases(APITestCase):
    fixtures = ['full_db.json']

    def setUp(self):
        self.client = APIClient()
        user = User.objects.create_user(username='testuser', password='testpassword')
        token, created = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def test_generate_full(self):
        url = reverse('auto_generate_roster', args=['FL0004'])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['flight_crew_junior']), 1)
        self.assertEqual(len(response.data['flight_crew_senior']), 1)
        self.assertEqual(len(response.data['flight_crew_trainee']), 0)

    def test_place_passengers(self):
        url = reverse('auto_generate_roster', args=['FL0004'])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data['flight_passengers']), 18)

class FlightFilterFromTestCases(APITestCase):
    fixtures = ['db_out.json']

    def setUp(self):
        self.client = APIClient()
        user = User.objects.create_user(username='testuser', password='testpassword')
        token, created = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def test_fights_from(self):
        url = reverse('flight_from', args=['SFO'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["flight_number"], "AA105")

    def test_fights_from_invalid_loc(self):
        url = reverse('flight_from', args=['RANDOMLOC'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {"error": "Invalid location code."})

class FlightFilterDateTestCases(APITestCase):
    fixtures = ['db_out.json']

    def setUp(self):
        self.client = APIClient()
        user = User.objects.create_user(username='testuser', password='testpassword')
        token, created = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def test_fights_before(self):
        url = reverse('flight_before', args=['2025-06-01T12:15:00Z'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["flight_number"], "AA103")

    def test_fights_from_invalid(self):
        url = reverse('flight_before', args=['192318931'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Date parameter required"})

class RosterManualTestCases(APITestCase):
    fixtures = ['full_db.json']

    def setUp(self):
        self.client = APIClient()
        user = User.objects.create_user(username='testuser', password='testpassword')
        token, created = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def test_create(self):
        url = reverse('auto_generate_roster', args=['FL0001'])
        data = {
            "pilot_ids": [904, 911],
            "crew_ids": [5805, 5806, 5808, 5809, 5810]
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['flight_crew_junior']), 1)
        self.assertEqual(len(response.data['flight_crew_senior']), 1)
        self.assertEqual(len(response.data['flight_cabin_crew_senior']), 1)
        self.assertEqual(len(response.data['flight_cabin_crew_junior']), 4)
        self.assertEqual(len(response.data['flight_crew_trainee']), 0)

    def test_create_invalid(self):
        url = reverse('auto_generate_roster', args=['FL0001'])
        data = {
            "pilot_ids": [999999, 911], #Invalid pilot id
            "crew_ids": [5805, 5806, 5808, 5809, 5810]
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'message': 'There must be at least one senior and one junior pilot.'})
