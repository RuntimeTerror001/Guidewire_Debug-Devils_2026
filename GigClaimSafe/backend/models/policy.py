from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    plan_type = Column(String)
    premium = Column(Float)
    coverage_amount = Column(Float)
    week_start = Column(DateTime(timezone=True))
    week_end = Column(DateTime(timezone=True))
    status = Column(String, default="ACTIVE")
    used_amount = Column(Float, default=0.0)
