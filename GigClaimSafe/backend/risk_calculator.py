import random
from models import RiskLevel

CITY_RISK_MAP = {
    "Mumbai": 0.7,
    "Delhi": 0.6,
    "Bangalore": 0.4,
    "Hyderabad": 0.5,
    "Chennai": 0.55,
    "Kolkata": 0.65,
    "Pune": 0.45,
    "Ahmedabad": 0.5,
    "Jaipur": 0.48,
    "Lucknow": 0.58,
}

def calculate_risk_score(city: str, weekly_earnings: float, work_hours: float) -> tuple:
    """
    Calculate risk score and level based on city, earnings, and work hours.
    Returns: (risk_score: float, risk_level: RiskLevel)
    """
    # Base risk from city
    base_risk = CITY_RISK_MAP.get(city, 0.5)
    
    # Environmental factor (simulated)
    weather_factor = random.uniform(0.0, 0.2)
    pollution_factor = random.uniform(0.0, 0.15)
    
    # Work intensity factor
    work_intensity = (work_hours / 50) * 0.15 if work_hours > 0 else 0
    
    # Earnings risk factor (lower earnings = higher risk)
    earnings_factor = max(0, (10000 - weekly_earnings) / 10000) * 0.1
    
    # Calculate final risk score
    risk_score = min(1.0, base_risk + weather_factor + pollution_factor + work_intensity + earnings_factor)
    
    # Determine risk level
    if risk_score < 0.3:
        risk_level = RiskLevel.LOW
    elif risk_score < 0.7:
        risk_level = RiskLevel.MEDIUM
    else:
        risk_level = RiskLevel.HIGH
    
    return risk_score, risk_level

def get_city_risk_base(city: str) -> float:
    """Get base risk value for a city."""
    return CITY_RISK_MAP.get(city, 0.5)

def recalculate_user_risk_profile(city: str, weekly_earnings: float, work_hours: float) -> dict:
    """Generate detailed risk profile for a user."""
    base_risk = CITY_RISK_MAP.get(city, 0.5)
    weather_factor = random.uniform(0.0, 0.2)
    pollution_factor = random.uniform(0.0, 0.15)
    work_intensity = (work_hours / 50) * 0.15 if work_hours > 0 else 0
    earnings_factor = max(0, (10000 - weekly_earnings) / 10000) * 0.1
    
    risk_score, risk_level = calculate_risk_score(city, weekly_earnings, work_hours)
    
    return {
        "risk_score": risk_score,
        "risk_level": risk_level.value,
        "factors": {
            "city_base": base_risk,
            "weather_factor": weather_factor,
            "pollution_factor": pollution_factor,
            "work_intensity": work_intensity,
            "earnings_factor": earnings_factor
        }
    }
