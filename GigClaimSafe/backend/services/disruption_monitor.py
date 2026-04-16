import random
from datetime import datetime

CITY_CONFIG = [
    {"city": "Mumbai", "state": "MH"},
    {"city": "Delhi", "state": "DL"},
    {"city": "Bangalore", "state": "KA"},
    {"city": "Chennai", "state": "TN"},
    {"city": "Hyderabad", "state": "TG"},
    {"city": "Kolkata", "state": "WB"},
    {"city": "Pune", "state": "MH"},
    {"city": "Ahmedabad", "state": "GJ"},
]

RAIN_THRESHOLD = 60
AQI_THRESHOLD = 200
TEMP_HIGH = 42
TEMP_LOW = 10


def get_all_cities():
    return CITY_CONFIG


def get_live_conditions(city: str) -> dict:
    seed = hash(city) % 1000
    random.seed(seed + datetime.utcnow().minute)
    rain_prob = random.randint(10, 90)
    aqi = random.randint(55, 280)
    temperature = random.randint(22, 45)
    return {
        "city": city,
        "rain_prob": rain_prob,
        "aqi": aqi,
        "temperature": temperature,
        "timestamp": datetime.utcnow().isoformat(),
    }


def check_disruption(conditions: dict) -> bool:
    if conditions["rain_prob"] > RAIN_THRESHOLD:
        return True
    if conditions["aqi"] > AQI_THRESHOLD:
        return True
    if conditions["temperature"] > TEMP_HIGH or conditions["temperature"] < TEMP_LOW:
        return True
    return False
