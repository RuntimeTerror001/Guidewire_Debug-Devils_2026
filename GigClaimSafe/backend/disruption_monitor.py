import random

WEATHER_THRESHOLDS = {
    "rain_probability": 0.6,  # Trigger if > 60%
}

AQI_THRESHOLDS = {
    "severe": 400,
}

TEMPERATURE_THRESHOLDS = {
    "extreme_hot": 48,
    "extreme_cold": 5,
}

def simulate_weather_data(city: str) -> dict:
    """Simulate weather data for a city."""
    rain_probability = random.uniform(0, 1)
    return {
        "city": city,
        "rain_probability": rain_probability,
        "wind_speed": random.uniform(0, 40),
        "visibility": random.uniform(100, 10000),
    }

def simulate_aqi_data(city: str) -> dict:
    """Simulate AQI data for a city."""
    aqi_value = random.uniform(50, 500)
    
    if aqi_value < 50:
        category = "Good"
    elif aqi_value < 100:
        category = "Satisfactory"
    elif aqi_value < 200:
        category = "Moderately Polluted"
    elif aqi_value < 300:
        category = "Poor"
    elif aqi_value < 400:
        category = "Very Poor"
    else:
        category = "Severe"
    
    return {
        "city": city,
        "aqi": aqi_value,
        "category": category,
        "pm25": random.uniform(10, 400),
        "pm10": random.uniform(20, 500),
    }

def simulate_temperature_data(city: str) -> dict:
    """Simulate temperature data for a city."""
    temperature = random.uniform(5, 48)
    feels_like = temperature + random.uniform(-3, 3)
    
    return {
        "city": city,
        "temperature": temperature,
        "feels_like": feels_like,
        "humidity": random.uniform(20, 95),
        "dew_point": random.uniform(0, 30),
    }

def check_disruption_triggers(rain_probability: float, aqi: float, temperature: float) -> dict:
    """
    Check if disruption triggers are met.
    Returns: {triggered: bool, reasons: list}
    """
    triggered = False
    reasons = []
    
    if rain_probability > WEATHER_THRESHOLDS["rain_probability"]:
        triggered = True
        reasons.append(f"Heavy rain probability: {rain_probability:.1%}")
    
    if aqi > AQI_THRESHOLDS["severe"]:
        triggered = True
        reasons.append(f"Severe AQI level: {aqi:.0f}")
    
    if temperature > TEMPERATURE_THRESHOLDS["extreme_hot"]:
        triggered = True
        reasons.append(f"Extreme heat: {temperature:.1f}°C")
    
    if temperature < TEMPERATURE_THRESHOLDS["extreme_cold"]:
        triggered = True
        reasons.append(f"Extreme cold: {temperature:.1f}°C")
    
    return {
        "triggered": triggered,
        "reasons": reasons
    }

def get_monitor_data(city: str) -> dict:
    """Get complete disruption monitoring data for a city."""
    weather = simulate_weather_data(city)
    aqi_data = simulate_aqi_data(city)
    temp_data = simulate_temperature_data(city)
    
    disruption = check_disruption_triggers(
        weather["rain_probability"],
        aqi_data["aqi"],
        temp_data["temperature"]
    )
    
    return {
        "city": city,
        "rain_probability": weather["rain_probability"],
        "aqi": aqi_data["aqi"],
        "aqi_category": aqi_data["category"],
        "temperature": temp_data["temperature"],
        "disruption_triggered": disruption["triggered"],
        "trigger_reasons": disruption["reasons"],
        "timestamp": "now"
    }
