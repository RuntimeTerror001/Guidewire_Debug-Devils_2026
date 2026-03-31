from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum as PyEnum

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

class UserRegister(BaseModel):
    name: str
    platform: str
    city: str
    weekly_earnings: float
    work_hours: float

class UserResponse(BaseModel):
    id: int
    name: str
    platform: str
    city: str
    weekly_earnings: float
    work_hours: float
    risk_score: float
    risk_level: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class RiskScoreResponse(BaseModel):
    user_id: int
    risk_score: float
    risk_level: str
    factors: dict

class PolicySelect(BaseModel):
    user_id: int
    plan_type: str

class PolicyResponse(BaseModel):
    id: int
    user_id: int
    plan_type: str
    coverage_amount: float
    premium: float
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

class MonitorResponse(BaseModel):
    city: str
    weather_rain_probability: float
    aqi: float
    temperature: float
    disruption_triggered: bool
    trigger_reasons: List[str]

class ClaimCreate(BaseModel):
    user_id: int
    trigger_reason: str

class ClaimResponse(BaseModel):
    id: int
    user_id: int
    policy_id: int
    status: ClaimStatus
    trigger_reason: str
    payout_amount: float
    fraud_flag: bool
    fraud_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class PayoutResponse(BaseModel):
    id: int
    claim_id: int
    user_id: int
    amount: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AdminDashboardResponse(BaseModel):
    total_users: int
    total_claims: int
    triggered_disruptions: int
    total_payouts: float
    active_policies: int
    avg_risk_score: float
