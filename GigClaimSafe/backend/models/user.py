from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, index=True)
    platform = Column(String)
    city = Column(String, index=True)
    weekly_earnings = Column(Float)
    work_hours = Column(Float)
    risk_score = Column(Float, default=0.5)
    risk_label = Column(String, default="Moderate")
    upi_id = Column(String, nullable=True)
    role = Column(String, default="worker")  # "worker" or "admin"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
