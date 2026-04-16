from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    platform: str
    city: str
    weekly_earnings: int
    work_hours: int
    upi_id: str
    role: Optional[str] = "worker"


class AdminCreateRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    platform: Optional[str] = "Admin"
    city: Optional[str] = "System"
    weekly_earnings: Optional[int] = 0
    work_hours: Optional[int] = 0
    upi_id: Optional[str] = None
    role: Optional[str] = "admin"


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    platform: str
    city: str
    weekly_earnings: int
    work_hours: int
    upi_id: str
    risk_score: float
    risk_label: str
    role: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    plan_type: Optional[str] = None
    premium: Optional[int] = None
    coverage_amount: Optional[int] = None
    policy_status: Optional[str] = None
    used_amount: Optional[int] = None

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class AdminUserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    platform: str
    city: str
    weekly_earnings: int
    work_hours: int
    risk_score: float
    risk_label: str
    role: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    total_claims: int = 0
    total_payouts: float = 0.0
    active_policy: Optional[str] = None

    model_config = {"from_attributes": True}


class RiskScoreResponse(BaseModel):
    score: float
    label: str
    breakdown: dict[str, float]


class PlanResponse(BaseModel):
    plan_type: str
    price: int
    premium: int
    coverage_amount: int
    features: List[str]
    popular: Optional[bool] = False


class SelectPlanRequest(BaseModel):
    user_id: int
    plan_type: str


class AdminTriggerRequest(BaseModel):
    city: str
    trigger_type: str
    trigger_value: int
    threshold: int


class ClaimTriggerRequest(BaseModel):
    user_id: int
    lat: float
    lng: float


class ClaimResponse(BaseModel):
    id: int
    user_id: int
    policy_id: int
    disruption_event_id: Optional[int]
    status: str
    payout_amount: int
    fraud_score: float
    fraud_flags: List[str]
    fraud_status: str
    lat: Optional[float]
    lng: Optional[float]
    filed_at: datetime
    payout_id: Optional[int] = None

    model_config = {"from_attributes": True}


class PayoutRequest(BaseModel):
    claim_id: int


class PayoutResponse(BaseModel):
    id: int
    claim_id: int
    user_id: int
    amount: int
    method: str
    txn_id: str
    status: str
    initiated_at: datetime

    model_config = {"from_attributes": True}


class AdminStatsResponse(BaseModel):
    total_workers: int
    active_policies: int
    premium_collected: int
    total_payouts: int
    loss_ratio: float
    fraud_blocked: int


class ForecastItem(BaseModel):
    city: str
    disruption_risk: str
    expected_claims: int
    estimated_liability: int


class FraudLogItem(BaseModel):
    id: int
    user_id: int
    policy_id: int
    fraud_score: float
    fraud_flags: List[str]
    fraud_status: str
    status: str
    filed_at: datetime

    model_config = {"from_attributes": True}


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
