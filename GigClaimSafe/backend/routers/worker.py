from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from datetime import datetime, timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/onboard")
def onboard(p: schemas.PolicyCreate, db: Session = Depends(get_db)):
    plan_meta = {
        'BASIC': {'premium': 35, 'coverage': 2000},
        'STANDARD': {'premium': 75, 'coverage': 5000},
        'PREMIUM': {'premium': 150, 'coverage': 12000}
    }
    meta = plan_meta.get(p.plan_type.upper(), plan_meta['STANDARD'])
    
    policy = models.Policy(
        user_id=p.user_id,
        plan_type=p.plan_type.upper(),
        premium=meta['premium'],
        coverage_amount=meta['coverage'],
        week_start=datetime.now(),
        week_end=datetime.now() + timedelta(days=7),
        status="ACTIVE"
    )
    db.add(policy)
    db.commit()
    return {"status": "ONBOARDED", "policy_id": policy.id}

@router.get("/{user_id}/dashboard")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    policy = db.query(models.Policy).filter(models.Policy.user_id == user_id, models.Policy.status == "ACTIVE").first()
    
    # Live alert logic (Simplified)
    event = db.query(models.DisruptionEvent).filter(models.DisruptionEvent.is_active == True).first()
    
    return {
        "user": user,
        "policy": policy,
        "live_alert": event,
        "stats": {"recovered": 1200, "gap": 300}
    }
