from datetime import date, datetime, timedelta
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from models import Claim, WeatherHistory

CITY_BOUNDS = {
    "Mumbai": (18.85, 19.15, 72.75, 73.05),
    "Delhi": (28.5, 28.9, 76.8, 77.3),
    "Bangalore": (12.85, 13.15, 77.45, 77.85),
    "Chennai": (13.0, 13.2, 80.2, 80.35),
    "Hyderabad": (17.35, 17.55, 78.35, 78.6),
    "Kolkata": (22.5, 22.8, 88.2, 88.5),
    "Pune": (18.4, 18.7, 73.7, 74.1),
    "Ahmedabad": (23.0, 23.15, 72.55, 72.75),
}


def run_fraud_checks(user, claim_lat, claim_lng, db: Session):
    flags = []
    score = 0.0
    today = date.today()

    if claim_lat is not None and claim_lng is not None and user.city in CITY_BOUNDS:
        bounds = CITY_BOUNDS[user.city]
        if not (bounds[0] <= claim_lat <= bounds[1] and bounds[2] <= claim_lng <= bounds[3]):
            flags.append("GPS_SPOOF")
            score += 0.35

    duplicate_count = db.scalar(
        select(func.count())
        .select_from(Claim)
        .where(Claim.user_id == user.id, func.date(Claim.filed_at) == today)
    ) or 0
    if duplicate_count > 0:
        flags.append("DUPLICATE_CLAIM")
        score += 0.20

    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_count = db.scalar(
        select(func.count())
        .select_from(Claim)
        .where(Claim.user_id == user.id, Claim.filed_at >= week_ago)
    ) or 0
    if recent_count >= 3:
        flags.append("VELOCITY_ABUSE")
        score += 0.15

    history = db.scalar(
        select(WeatherHistory)
        .where(WeatherHistory.city == user.city, WeatherHistory.date == today)
        .limit(1)
    )
    if history and history.rain_prob < 40 and history.aqi < 150:
        flags.append("FAKE_WEATHER_CLAIM")
        score += 0.30

    fraud_status = (
        "BLOCKED" if score >= 0.8 else
        "SUSPICIOUS" if score >= 0.5 else
        "CLEAN"
    )
    return round(score, 2), flags, fraud_status
