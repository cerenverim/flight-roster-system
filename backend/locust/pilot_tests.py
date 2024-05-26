from locust import HttpUser, task, between
import json
from random import randint
class PilotPerformanceTest(HttpUser):
    wait_time = between(1, 5)

    @task(1)
    def get_pilots_vehicle_one(self):
        self.client.get("/api/cabin_api/crew/1/", headers={"Authorization": f"Token {self.token}"})

    @task(1)
    def get_pilots_vehicle_two(self):
        self.client.get("/api/cabin_api/crew/2/", headers={"Authorization": f"Token {self.token}"})

    @task(1)
    def get_pilots_vehicle_two(self):
        self.client.get("/api/cabin_api/crew/A/", headers={"Authorization": f"Token {self.token}"})

    def on_start(self):
        response = self.client.post("/api/users/login", json=dict(username="test", password="test"))
        if not response.status_code == 200:
            raise ValueError
        data = response.json()
        self.token = data.get("token")

    def on_stop(self):
        pass
