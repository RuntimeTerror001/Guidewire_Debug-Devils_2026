from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    policy_id = Column(Integer, index=True)
    disruption_event_id = Column(Integer, index=True, nullable=True)
    status = Column(String, default="PENDING")
    payout_amount = Column(Float, default=0.0)
    fraud_score = Column(Float, default=0.0)
    fraud_flags = Column(JSON, default={})
    fraud_status = Column(String, default="CLEAN")
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    filed_at = Column(DateTime(timezone=True), server_default=func.now())
