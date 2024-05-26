from locust import HttpUser, task, between
import json
from random import randint
class LoginPerformanceTest(HttpUser):
    wait_time = between(1, 5)

    @task(1)
    def login_with_correct_credentials(self):
        payload = {
            "username": "test",
            "password": "test"
        }
        self.client.post("/api/users/login", data=json.dumps(payload), headers={"Content-Type": "application/json"})

    @task(1)
    def login_with_incorrect_credentials(self):
        payload = {
            "username": "wrong_username",
            "password": "wrong_password"
        }
        self.client.post("/api/users/login", data=json.dumps(payload), headers={"Content-Type": "application/json"})

    def on_start(self):
        pass

    def on_stop(self):
        pass
