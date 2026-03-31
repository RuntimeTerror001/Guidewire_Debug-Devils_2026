from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Enum
from sqlalchemy.sql import func
from database import Base
from enum import Enum as PyEnum
from datetime import datetime

class RiskLevel(str, PyEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class PlanType(str, PyEnum):
    BASIC = "basic"
    STANDARD = "standard"
    PREMIUM = "premium"

class ClaimStatus(str, PyEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    platform = Column(String)  # Uber, Swiggy, Ola Delivery, etc.
    city = Column(String, index=True)
    weekly_earnings = Column(Float)
    work_hours = Column(Float)
    risk_score = Column(Float, default=0.5)
    risk_level = Column(Enum(RiskLevel), default=RiskLevel.MEDIUM)
    location_lat = Column(Float, default=0.0)
    location_lon = Column(Float, default=0.0)
    fraud_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    plan_type = Column(Enum(PlanType))
    coverage_amount = Column(Float)
    premium = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    policy_id = Column(Integer, index=True)
    status = Column(Enum(ClaimStatus), default=ClaimStatus.PENDING)
    trigger_reason = Column(String)  # rain, aqi, temperature, etc.
    payout_amount = Column(Float, default=0.0)
    fraud_flag = Column(Boolean, default=False)
    fraud_score = Column(Float, default=0.0)
    location_at_claim = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DisruptionEvent(Base):
    __tablename__ = "disruption_events"
    
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True)
    event_type = Column(String)  # weather, aqi, temperature
    severity = Column(Float)
    affected_users = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Payout(Base):
    __tablename__ = "payouts"
    
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, index=True)
    user_id = Column(Integer, index=True)
    amount = Column(Float)
    status = Column(String, default="completed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
