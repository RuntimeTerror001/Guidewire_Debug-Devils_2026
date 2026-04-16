import random

CITY_BASE = {
    "Mumbai": 0.75,
    "Delhi": 0.80,
    "Bangalore": 0.60,
    "Chennai": 0.65,
    "Hyderabad": 0.55,
    "Kolkata": 0.70,
    "Pune": 0.50,
    "Ahmedabad": 0.58,
}


def calculate_risk(city: str, weekly_earnings: int, work_hours: int) -> tuple[float, str, dict[str, float]]:
    city_base = CITY_BASE.get(city, 0.60)
    env_factor = random.uniform(0.12, 0.28)
    earnings_factor = min(weekly_earnings / 10000, 0.2)
    hours_factor = min(work_hours / 80, 0.15)

    score = round(
        (city_base * 0.5) +
        (env_factor * 0.3) +
        (earnings_factor * 0.1) +
        (hours_factor * 0.1),
        2,
    )

    if score < 0.4:
        label = "Low"
    elif score > 0.7:
        label = "High"
    else:
        label = "Medium"

    breakdown = {
        "City Risk": round(city_base * 0.5, 2),
        "Environment": round(env_factor * 0.3, 2),
        "Earnings": round(earnings_factor * 0.1, 2),
        "Work Hours": round(hours_factor * 0.1, 2),
    }
    return score, label, breakdown
