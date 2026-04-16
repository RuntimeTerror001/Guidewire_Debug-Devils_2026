from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class Payout(Base):
    __tablename__ = "payouts"
    
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, index=True)
    user_id = Column(Integer, index=True)
    amount = Column(Float)
    method = Column(String, default="UPI")
    razorpay_payout_id = Column(String, nullable=True)
    txn_id = Column(String, nullable=True)
    status = Column(String, default="queued")
    initiated_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
