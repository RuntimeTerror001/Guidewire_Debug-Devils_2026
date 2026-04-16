from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/simulate-disruption")
def simulate(s: schemas.DisruptionSimulate, db: Session = Depends(get_db)):
    # Deactivate old
    db.query(models.DisruptionEvent).filter(models.DisruptionEvent.city == s.city).update({"is_active": False})
    
    event = models.DisruptionEvent(
        city=s.city,
        trigger_type=s.type,
        trigger_value=s.value,
        threshold=0.6 if s.type == "RAIN" else 350,
        is_active=True
    )
    db.add(event)
    db.commit()
    
    # Notify users
    workers = db.query(models.User).filter(models.User.city == s.city).all()
    for w in workers:
        notif = models.Notification(
            user_id=w.id,
            type="DISRUPTION",
            message=f"🚨 {s.type} Alert in {s.city}! Your protection is active."
        )
        db.add(notif)
    db.commit()
    return {"status": "SUCCESS", "event_id": event.id}

@router.get("/dashboard")
def admin_stats(db: Session = Depends(get_db)):
    return {
        "kpis": {"active_policies": 120, "loss_ratio": 22.5},
        "heatmap": [{"city": "Mumbai", "claims": 45}]
    }
