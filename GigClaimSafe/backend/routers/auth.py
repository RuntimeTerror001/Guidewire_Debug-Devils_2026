from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models, schemas
from services.auth_service import (
    authenticate_user,
    get_password_hash,
    create_access_token,
    get_current_user,
    get_current_admin_user,
    get_current_worker_user
)
from services.risk_scorer import calculate_risk

router = APIRouter()

@router.post("/register", response_model=schemas.TokenResponse)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Calculate risk score
    score, label = calculate_risk(user_data.city, user_data.weekly_earnings, user_data.work_hours)

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = models.User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.name,
        platform=user_data.platform,
        city=user_data.city,
        weekly_earnings=user_data.weekly_earnings,
        work_hours=user_data.work_hours,
        upi_id=user_data.upi_id,
        risk_score=score,
        risk_label=label,
        role=user_data.role or "worker"
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create access token
    access_token = create_access_token(data={"sub": db_user.email})

    return schemas.TokenResponse(
        access_token=access_token,
        user=schemas.UserResponse.from_orm(db_user)
    )

@router.post("/login", response_model=schemas.TokenResponse)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login
    user.last_login = func.now()
    db.commit()

    access_token = create_access_token(data={"sub": user.email})

    return schemas.TokenResponse(
        access_token=access_token,
        user=schemas.UserResponse.from_orm(user)
    )

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return schemas.UserResponse.from_orm(current_user)

@router.get("/admin-exists")
def admin_exists(db: Session = Depends(get_db)):
    admin_count = db.query(models.User).filter(models.User.role == "admin").count()
    return {"admin_exists": admin_count > 0}

@router.post("/create-first-admin", response_model=schemas.UserResponse)
def create_first_admin(user_data: schemas.AdminCreateRequest, db: Session = Depends(get_db)):
    existing_admin = db.query(models.User).filter(models.User.role == "admin").first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin user already exists")

    hashed_password = get_password_hash(user_data.password)
    db_user = models.User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.name,
        platform=user_data.platform,
        city=user_data.city,
        weekly_earnings=user_data.weekly_earnings,
        work_hours=user_data.work_hours,
        upi_id=user_data.upi_id,
        risk_score=0.0,
        risk_label="Admin",
        role="admin",
        is_active=True
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return schemas.UserResponse.from_orm(db_user)

@router.post("/admin/create-admin")
def create_admin_user(
    user_data: schemas.UserCreate,
    current_admin: models.User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Admin endpoint to create new admin users"""
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    score, label = calculate_risk(user_data.city, user_data.weekly_earnings, user_data.work_hours)

    hashed_password = get_password_hash(user_data.password)
    db_user = models.User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.name,
        platform=user_data.platform,
        city=user_data.city,
        weekly_earnings=user_data.weekly_earnings,
        work_hours=user_data.work_hours,
        upi_id=user_data.upi_id,
        risk_score=score,
        risk_label=label,
        role="admin"
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "Admin user created successfully", "user_id": db_user.id}
