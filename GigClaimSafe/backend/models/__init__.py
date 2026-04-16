from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(128), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    name = Column(String(128), nullable=False)
    platform = Column(String(64), nullable=False)
    city = Column(String(64), nullable=False)
    weekly_earnings = Column(Float, nullable=False)
    work_hours = Column(Float, nullable=False)
    upi_id = Column(String(128), nullable=True)
    role = Column(String(32), nullable=False, default="worker")
    is_active = Column(Boolean, default=True)
    risk_score = Column(Float, nullable=False, default=0.0)
    risk_label = Column(String(32), nullable=False, default="Low")
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    policies = relationship("Policy", back_populates="user", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="user", cascade="all, delete-orphan")
    payouts = relationship("Payout", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_type = Column(String(32), nullable=False)
    premium = Column(Integer, nullable=False)
    coverage_amount = Column(Integer, nullable=False)
    week_start = Column(Date, nullable=False)
    week_end = Column(Date, nullable=False)
    status = Column(String(32), nullable=False, default="ACTIVE")
    used_amount = Column(Integer, nullable=False, default=0)

    user = relationship("User", back_populates="policies")
    claims = relationship("Claim", back_populates="policy")


class DisruptionEvent(Base):
    __tablename__ = "disruption_events"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(64), nullable=False)
    trigger_type = Column(String(16), nullable=False)
    trigger_value = Column(Integer, nullable=False)
    threshold = Column(Integer, nullable=False)
    triggered_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    claims = relationship("Claim", back_populates="disruption_event")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=False)
    disruption_event_id = Column(Integer, ForeignKey("disruption_events.id"), nullable=True)
    status = Column(String(32), nullable=False)
    payout_amount = Column(Integer, nullable=False, default=0)
    fraud_score = Column(Float, nullable=False, default=0.0)
    fraud_flags = Column(JSON, nullable=False, default=list)
    fraud_status = Column(String(32), nullable=False, default="CLEAN")
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    filed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="claims")
    policy = relationship("Policy", back_populates="claims")
    disruption_event = relationship("DisruptionEvent", back_populates="claims")
    payout = relationship("Payout", back_populates="claim", uselist=False)


class Payout(Base):
    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    method = Column(String(32), nullable=False)
    txn_id = Column(String(64), nullable=False)
    status = Column(String(32), nullable=False)
    initiated_at = Column(DateTime, default=datetime.utcnow)

    claim = relationship("Claim", back_populates="payout")
    user = relationship("User", back_populates="payouts")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(32), nullable=False)
    message = Column(String(256), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class WeatherHistory(Base):
    __tablename__ = "weather_history"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(64), nullable=False)
    date = Column(Date, nullable=False)
    rain_prob = Column(Integer, nullable=False)
    aqi = Column(Integer, nullable=False)
    temperature = Column(Integer, nullable=False)
