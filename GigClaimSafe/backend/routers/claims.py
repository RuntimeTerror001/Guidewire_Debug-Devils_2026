from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from services.fraud_engine import run_all_checks
from datetime import date

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/submit")
def submit_claim(c: schemas.ClaimCreate, db: Session = Depends(get_db)):
    policy = db.query(models.Policy).filter(models.Policy.user_id == c.user_id, models.Policy.status == "ACTIVE").first()
    if not policy: raise HTTPException(404, "No policy")
    
    score, breakdown = run_all_checks(db, c.user_id, c.lat, c.lng, c.city_declared, date.today())
    
    status = "APPROVED" if score < 0.5 else "REJECTED"
    
    claim = models.Claim(
        **c.model_dump(),
        policy_id=policy.id,
        status=status,
        payout_amount=policy.coverage_amount/7 if status == "APPROVED" else 0,
        fraud_score=score,
        fraud_flags=breakdown,
        fraud_status="CLEAN" if status == "APPROVED" else "SUSPICIOUS"
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    
    # Auto-queue Payout
    if status == "APPROVED":
        payout = models.Payout(claim_id=claim.id, user_id=c.user_id, amount=claim.payout_amount)
        db.add(payout)
        db.commit()
        
    return claim
