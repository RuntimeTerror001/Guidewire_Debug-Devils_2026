from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class FraudFlag(Base):
    __tablename__ = "fraud_flags"
    
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, index=True)
    fraud_type = Column(String, index=True)
    confidence_score = Column(Float, default=0.0)
    flagged_at = Column(DateTime(timezone=True), server_default=func.now())
