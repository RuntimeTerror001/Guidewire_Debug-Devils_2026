import random
import uuid
from datetime import datetime, date, timedelta
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from database import engine, get_db, SessionLocal
from models import Base, User, Policy, DisruptionEvent, Claim, Payout, Notification, WeatherHistory
from schemas import (
    UserCreate,
    UserResponse,
    RiskScoreResponse,
    PlanResponse,
    SelectPlanRequest,
    AdminTriggerRequest,
    ClaimTriggerRequest,
    ClaimResponse,
    PayoutRequest,
    PayoutResponse,
    AdminStatsResponse,
    ForecastItem,
    FraudLogItem,
    NotificationResponse,
    AdminUserResponse,
)
from services.risk_engine import calculate_risk
from services.disruption_monitor import (
    get_all_cities,
    get_live_conditions,
    check_disruption,
    RAIN_THRESHOLD,
    AQI_THRESHOLD,
    TEMP_HIGH,
    TEMP_LOW,
)
from services.fraud_engine import run_fraud_checks
from services.claim_processor import process_claim
from services.payout_service import initiate_payout
from services.auth_service import get_password_hash

app = FastAPI(title="GigClaimSafe API", version="3.0")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def get_active_policy(db: Session, user_id: int) -> Policy | None:
    return db.scalar(
        select(Policy)
        .where(Policy.user_id == user_id, Policy.status == "ACTIVE")
        .order_by(Policy.id.desc())
    )


def get_plan_catalog() -> list[dict]:
    return [
        {
            "plan_type": "Basic",
            "price": 20,
            "premium": 20,
            "coverage_amount": 1000,
            "features": [
                "Rain disruption coverage",
                "AQI / pollution coverage",
                "Temperature extreme coverage",
                "Instant UPI payout",
                "Fraud protection",
            ],
        },
        {
            "plan_type": "Standard",
            "price": 35,
            "premium": 35,
            "coverage_amount": 2000,
            "features": [
                "Rain disruption coverage",
                "AQI / pollution coverage",
                "Temperature extreme coverage",
                "Instant UPI payout",
                "Fraud protection",
                "Priority claim processing",
            ],
            "popular": True,
        },
        {
            "plan_type": "Premium",
            "price": 50,
            "premium": 50,
            "coverage_amount": 3500,
            "features": [
                "Rain disruption coverage",
                "AQI / pollution coverage",
                "Temperature extreme coverage",
                "Instant UPI payout",
                "Fraud protection",
                "Priority claim processing",
                "24/7 support",
            ],
        },
    ]


def seed_demo_data(db: Session) -> None:
    existing_users = db.scalar(select(func.count()).select_from(User))
    if existing_users:
        return

    cities = [
        {"city": "Mumbai", "state": "MH"},
        {"city": "Delhi", "state": "DL"},
        {"city": "Bangalore", "state": "KA"},
        {"city": "Chennai", "state": "TN"},
        {"city": "Hyderabad", "state": "TG"},
        {"city": "Kolkata", "state": "WB"},
        {"city": "Pune", "state": "MH"},
        {"city": "Ahmedabad", "state": "GJ"},
    ]

    plan_map = {plan["plan_type"]: plan for plan in get_plan_catalog()}
    week_start = date.today() - timedelta(days=date.today().weekday())
    week_end = week_start + timedelta(days=6)

    demo_workers = [
        {"name": "Ravi Kumar", "platform": "Swiggy", "city": "Mumbai", "weekly_earnings": 6000, "work_hours": 42, "upi_id": "ravi@upi", "plan": "Standard"},
        {"name": "Neha Sharma", "platform": "Zomato", "city": "Delhi", "weekly_earnings": 7200, "work_hours": 48, "upi_id": "neha@upi", "plan": "Premium"},
        {"name": "Aman Singh", "platform": "Blinkit", "city": "Bangalore", "weekly_earnings": 5200, "work_hours": 38, "upi_id": "aman@upi", "plan": "Basic"},
        {"name": "Priya S", "platform": "Dunzo", "city": "Chennai", "weekly_earnings": 6300, "work_hours": 44, "upi_id": "priya@upi", "plan": "Standard"},
        {"name": "Siddharth R", "platform": "Zepto", "city": "Hyderabad", "weekly_earnings": 5800, "work_hours": 40, "upi_id": "siddharth@upi", "plan": "Premium"},
    ]

    user_objects: list[User] = []
    for worker in demo_workers:
        score, label, _ = calculate_risk(worker["city"], worker["weekly_earnings"], worker["work_hours"])
        email = f"{worker['name'].lower().replace(' ', '.')}@gigclaimsafe.com"
        user = User(
            email=email,
            password_hash=get_password_hash("Welcome123!"),
            name=worker["name"],
            platform=worker["platform"],
            city=worker["city"],
            weekly_earnings=worker["weekly_earnings"],
            work_hours=worker["work_hours"],
            upi_id=worker["upi_id"],
            role="worker",
            risk_score=score,
            risk_label=label,
            created_at=datetime.utcnow(),
        )
        db.add(user)
        db.flush()
        plan = plan_map[worker["plan"]]
        policy = Policy(
            user_id=user.id,
            plan_type=plan["plan_type"],
            premium=plan["premium"],
            coverage_amount=plan["coverage_amount"],
            week_start=week_start,
            week_end=week_end,
            status="ACTIVE",
            used_amount=random.randint(0, int(plan["coverage_amount"] * 0.3)),
        )
        db.add(policy)
        user_objects.append(user)

    db.commit()

    for index, user in enumerate(user_objects, start=1):
        event = DisruptionEvent(
            city=user.city,
            trigger_type=random.choice(["RAIN", "AQI", "TEMP"]),
            trigger_value=random.randint(65, 180),
            threshold=random.choice([RAIN_THRESHOLD, AQI_THRESHOLD, TEMP_HIGH]),
            triggered_at=datetime.utcnow() - timedelta(days=index),
            is_active=False,
        )
        db.add(event)

    for user in user_objects:
        claim_status = random.choice(["APPROVED", "PENDING", "REJECTED"])
        fraud_status = "CLEAN" if claim_status == "APPROVED" else random.choice(["SUSPICIOUS", "BLOCKED"])
        payout_amount = 0 if claim_status != "APPROVED" else random.choice([750, 900, 1000])
        claim = Claim(
            user_id=user.id,
            policy_id=db.scalar(select(Policy).where(Policy.user_id == user.id).limit(1)).id,
            disruption_event_id=None,
            status=claim_status,
            payout_amount=payout_amount,
            fraud_score=0.0 if fraud_status == "CLEAN" else random.uniform(0.5, 0.85),
            fraud_flags=[] if fraud_status == "CLEAN" else ["SUSPICIOUS_PATTERN"],
            fraud_status=fraud_status,
            lat=19.0,
            lng=72.8,
            filed_at=datetime.utcnow() - timedelta(days=random.randint(1, 7)),
        )
        db.add(claim)
        db.flush()
        if payout_amount > 0:
            payout = Payout(
                claim_id=claim.id,
                user_id=user.id,
                amount=payout_amount,
                method="UPI",
                txn_id=f"GCS-{uuid.uuid4().hex[:10].upper()}",
                status="SUCCESS",
                initiated_at=datetime.utcnow() - timedelta(days=random.randint(1, 7)),
            )
            db.add(payout)
            db.add(Notification(
                user_id=user.id,
                type="PAYOUT",
                message=f"₹{payout_amount} credited to {user.upi_id} ✅ Txn: {payout.txn_id}",
                is_read=False,
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 7)),
            ))

    for city in cities:
        base = random.randint(20, 70)
        for day_offset in range(0, 7):
            history = WeatherHistory(
                city=city["city"],
                date=date.today() - timedelta(days=day_offset),
                rain_prob=random.randint(10, 85),
                aqi=random.randint(40, 240),
                temperature=random.randint(20, 44),
            )
            db.add(history)

    db.commit()


@app.on_event("startup")
def startup_event():
    with SessionLocal() as db:
        seed_demo_data(db)


@app.get("/")
def health_check():
    return {"status": "healthy", "platform": "GigClaimSafe"}


@app.post("/register", response_model=UserResponse)
def register_worker(payload: UserCreate, db: Session = Depends(get_db)):
    score, label, _ = calculate_risk(payload.city, payload.weekly_earnings, payload.work_hours)
    user = User(
        name=payload.name,
        platform=payload.platform,
        city=payload.city,
        weekly_earnings=payload.weekly_earnings,
        work_hours=payload.work_hours,
        upi_id=payload.upi_id,
        risk_score=score,
        risk_label=label,
        created_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return build_user_response(user, db)


@app.get("/worker/{user_id}", response_model=UserResponse)
def get_worker(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Worker not found")
    return build_user_response(user, db)


@app.get("/risk-score/{user_id}", response_model=RiskScoreResponse)
def get_risk_score(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Worker not found")
    return RiskScoreResponse(
        score=user.risk_score,
        label=user.risk_label,
        breakdown={
            "City Risk": round(user.risk_score * 0.45, 2),
            "Workload": round(user.risk_score * 0.30, 2),
            "Environment": round(user.risk_score * 0.25, 2),
        },
    )


@app.get("/plans", response_model=list[PlanResponse])
def list_plans():
    return [PlanResponse(**plan) for plan in get_plan_catalog()]


@app.post("/select-plan", response_model=PlanResponse)
def select_plan(payload: SelectPlanRequest, db: Session = Depends(get_db)):
    user = db.get(User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Worker not found")

    plan = next((plan for plan in get_plan_catalog() if plan["plan_type"] == payload.plan_type), None)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan selected")

    active_policy = get_active_policy(db, user.id)
    if active_policy and active_policy.plan_type == payload.plan_type:
        return PlanResponse(**plan)

    if active_policy:
        active_policy.status = "EXPIRED"
        db.add(active_policy)

    week_start = date.today() - timedelta(days=date.today().weekday())
    week_end = week_start + timedelta(days=6)
    new_policy = Policy(
        user_id=user.id,
        plan_type=plan["plan_type"],
        premium=plan["premium"],
        coverage_amount=plan["coverage_amount"],
        week_start=week_start,
        week_end=week_end,
        status="ACTIVE",
        used_amount=0,
    )
    db.add(new_policy)
    db.commit()
    return PlanResponse(**plan)


@app.get("/monitor")
def get_monitor():
    cities = []
    for city_info in get_all_cities():
        conditions = get_live_conditions(city_info["city"])
        cities.append(
            {
                "city": conditions["city"],
                "state": city_info["state"],
                "rain_prob": conditions["rain_prob"],
                "aqi": conditions["aqi"],
                "temperature": conditions["temperature"],
                "status": "ACTIVE" if check_disruption(conditions) else "NORMAL",
            }
        )
    return {
        "cities": cities,
        "thresholds": {
            "rain": {"normal": "<40%", "warning": "40-60%", "critical": ">60%"},
            "aqi": {"normal": "<100", "warning": "100-200", "critical": ">200"},
            "temperature": {"normal": "10-40°", "warning": "40-42°", "critical": ">42°"},
        },
    }


@app.get("/disruptions/active")
def active_disruptions(db: Session = Depends(get_db)):
    events = db.scalars(select(DisruptionEvent).where(DisruptionEvent.is_active == True)).all()
    return [
        {
            "id": event.id,
            "city": event.city,
            "trigger_type": event.trigger_type,
            "trigger_value": event.trigger_value,
            "threshold": event.threshold,
            "triggered_at": event.triggered_at,
        }
        for event in events
    ]


@app.post("/trigger-claim", response_model=ClaimResponse)
def trigger_claim(payload: ClaimTriggerRequest, db: Session = Depends(get_db)):
    user = db.get(User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Worker not found")

    policy = get_active_policy(db, user.id)
    if not policy:
        raise HTTPException(status_code=400, detail="No active insurance plan found")

    event = db.scalar(
        select(DisruptionEvent)
        .where(DisruptionEvent.city == user.city, DisruptionEvent.is_active == True)
        .order_by(DisruptionEvent.triggered_at.desc())
    )
    if not event:
        raise HTTPException(status_code=400, detail="No active disruption event in your city")

    fraud_score, fraud_flags, fraud_status = run_fraud_checks(user, payload.lat, payload.lng, db)
    status, payout_amount = process_claim(policy, event.trigger_type, fraud_status)

    claim = Claim(
        user_id=user.id,
        policy_id=policy.id,
        disruption_event_id=event.id,
        status=status,
        payout_amount=payout_amount,
        fraud_score=fraud_score,
        fraud_flags=fraud_flags,
        fraud_status=fraud_status,
        lat=payload.lat,
        lng=payload.lng,
        filed_at=datetime.utcnow(),
    )
    db.add(claim)
    if status == "APPROVED" and payout_amount > 0:
        policy.used_amount += payout_amount
        db.add(policy)
    db.commit()
    db.refresh(claim)
    response = ClaimResponse.from_orm(claim)

    if status == "APPROVED" and payout_amount > 0:
        payout = db.scalar(select(Payout).where(Payout.claim_id == claim.id))
        if not payout:
            payout = initiate_payout(claim, user, db)
        response.payout_id = payout.id

    return response


@app.get("/claims", response_model=list[ClaimResponse])
def list_claims(db: Session = Depends(get_db)):
    claims = db.scalars(select(Claim).order_by(Claim.filed_at.desc())).all()
    return [ClaimResponse.from_orm(claim) for claim in claims]


@app.get("/claims/{user_id}", response_model=list[ClaimResponse])
def user_claims(user_id: int, db: Session = Depends(get_db)):
    claims = db.scalars(select(Claim).where(Claim.user_id == user_id).order_by(Claim.filed_at.desc())).all()
    return [ClaimResponse.from_orm(claim) for claim in claims]


@app.post("/payout/initiate", response_model=PayoutResponse)
def payout_initiate(payload: PayoutRequest, db: Session = Depends(get_db)):
    claim = db.get(Claim, payload.claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    if claim.status != "APPROVED":
        raise HTTPException(status_code=400, detail="Only approved claims can be paid out")

    existing = db.scalar(select(Payout).where(Payout.claim_id == claim.id))
    if existing:
        return PayoutResponse.from_orm(existing)

    user = db.get(User, claim.user_id)
    payout = initiate_payout(claim, user, db)
    return PayoutResponse.from_orm(payout)


@app.get("/payouts", response_model=list[PayoutResponse])
def all_payouts(db: Session = Depends(get_db)):
    payouts = db.scalars(select(Payout).order_by(Payout.initiated_at.desc())).all()
    return [PayoutResponse.from_orm(p) for p in payouts]


@app.get("/payouts/{user_id}", response_model=list[PayoutResponse])
def user_payouts(user_id: int, db: Session = Depends(get_db)):
    payouts = db.scalars(select(Payout).where(Payout.user_id == user_id).order_by(Payout.initiated_at.desc())).all()
    return [PayoutResponse.from_orm(p) for p in payouts]


@app.get("/notifications/{user_id}", response_model=list[NotificationResponse])
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    notifications = db.scalars(select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc())).all()
    return [NotificationResponse.from_orm(notif) for notif in notifications]


@app.patch("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    notification = db.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return NotificationResponse.from_orm(notification)


def build_user_response(user: User, db: Session) -> UserResponse:
    policy = get_active_policy(db, user.id)
    return UserResponse(
        id=user.id,
        name=user.name,
        platform=user.platform,
        city=user.city,
        weekly_earnings=user.weekly_earnings,
        work_hours=user.work_hours,
        upi_id=user.upi_id,
        risk_score=user.risk_score,
        risk_label=user.risk_label,
        created_at=user.created_at,
        plan_type=policy.plan_type if policy else None,
        premium=policy.premium if policy else None,
        coverage_amount=policy.coverage_amount if policy else None,
        policy_status=policy.status if policy else None,
        used_amount=policy.used_amount if policy else None,
    )


# Mount routers
from routers import auth
app.include_router(auth.router, prefix="/auth", tags=["authentication"])

# Protect admin endpoints with authentication
from services.auth_service import get_current_admin_user

@app.get("/admin/stats", response_model=AdminStatsResponse)
def admin_stats(current_admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    total_workers = db.scalar(select(func.count()).select_from(User)) or 0
    active_policies = db.scalar(select(func.count()).select_from(Policy).where(Policy.status == "ACTIVE")) or 0
    premium_collected = db.scalar(select(func.sum(Policy.premium))) or 0
    total_payouts = db.scalar(select(func.sum(Payout.amount))) or 0
    loss_ratio = round((total_payouts / premium_collected) * 100, 1) if premium_collected else 0.0
    fraud_blocked = db.scalar(select(func.count()).select_from(Claim).where(Claim.fraud_status == "BLOCKED")) or 0
    return AdminStatsResponse(
        total_workers=total_workers,
        active_policies=active_policies,
        premium_collected=premium_collected,
        total_payouts=total_payouts,
        loss_ratio=loss_ratio,
        fraud_blocked=fraud_blocked,
    )


@app.get("/admin/fraud-log", response_model=list[FraudLogItem])
def admin_fraud_log(current_admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    claims = db.scalars(select(Claim).where(Claim.fraud_status != "CLEAN").order_by(Claim.filed_at.desc())).all()
    return [FraudLogItem.from_orm(claim) for claim in claims]


@app.get("/admin/forecast", response_model=list[ForecastItem])
def admin_forecast(current_admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    forecast = []
    for city_info in get_all_cities():
        active = db.scalar(select(func.count()).select_from(DisruptionEvent).where(DisruptionEvent.city == city_info["city"], DisruptionEvent.is_active == True)) or 0
        risk = min(0.95, 0.25 + active * 0.15 + random.uniform(0, 0.35))
        forecast.append(
            ForecastItem(
                city=city_info["city"],
                disruption_risk=f"{int(risk * 100)}%",
                expected_claims=max(3, active * 2 + random.randint(1, 5)),
                estimated_liability=round((active * 700 + random.randint(2000, 4500))),
            )
        )
    return forecast


@app.post("/admin/trigger")
def admin_trigger(
    payload: AdminTriggerRequest,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    event = DisruptionEvent(
        city=payload.city,
        trigger_type=payload.trigger_type,
        trigger_value=payload.trigger_value,
        threshold=payload.threshold,
        triggered_at=datetime.utcnow(),
        is_active=True,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return {
        "message": "Disruption triggered",
        "event_id": event.id,
        "city": event.city,
        "trigger_type": event.trigger_type,
    }


@app.get("/admin/workers", response_model=list[AdminUserResponse])
def admin_get_all_workers(current_admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Get all workers with their stats for admin dashboard"""
    users = db.scalars(select(User)).all()
    result = []

    for user in users:
        # Get user's claims count
        claims_count = db.scalar(select(func.count()).select_from(Claim).where(Claim.user_id == user.id)) or 0

        # Get user's total payouts
        total_payouts = db.scalar(select(func.sum(Payout.amount)).select_from(Payout).where(Payout.user_id == user.id)) or 0.0

        # Get active policy
        active_policy = get_active_policy(db, user.id)

        result.append(AdminUserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            platform=user.platform,
            city=user.city,
            weekly_earnings=user.weekly_earnings,
            work_hours=user.work_hours,
            risk_score=user.risk_score,
            risk_label=user.risk_label,
            role=user.role,
            is_active=user.is_active,
            created_at=user.created_at,
            last_login=user.last_login,
            total_claims=claims_count,
            total_payouts=total_payouts,
            active_policy=active_policy.plan_type if active_policy else None
        ))

    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
