from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{user_id}")
def get_notifs(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.created_at.desc()).all()

@router.patch("/{id}/read")
def mark_read(id: int, db: Session = Depends(get_db)):
    db.query(models.Notification).filter(models.Notification.id == id).update({"is_read": True})
    db.commit()
    return {"status": "SUCCESS"}
