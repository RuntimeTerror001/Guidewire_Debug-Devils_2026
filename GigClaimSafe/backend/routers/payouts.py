from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from services.payout_service import payout_service
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/initiate")
def initiate(p: schemas.PayoutCreate, db: Session = Depends(get_db)):
    payout = db.query(models.Payout).filter(models.Payout.claim_id == p.claim_id).first()
    if not payout: raise HTTPException(404, "Payout not found in queue")
    
    user = db.query(models.User).filter(models.User.id == payout.user_id).first()
    
    result = payout_service.initiate_mock_payout(payout.amount, p.upi_id, user.name)
    
    if result['success']:
        payout.status = "success"
        payout.txn_id = result['utr']
        payout.razorpay_payout_id = result['payout_id']
        payout.completed_at = datetime.now()
        
        # Notify
        db.add(models.Notification(
            user_id=user.id,
            type="PAYOUT",
            message=f"✅ ₹{payout.amount} credited to {p.upi_id}. TXN: {payout.txn_id}"
        ))
        db.commit()
        return result
    else:
        payout.status = "failed"
        db.commit()
        raise HTTPException(500, "Payout failed")
