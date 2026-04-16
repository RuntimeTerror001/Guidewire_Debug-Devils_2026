import sys
sys.path.insert(0, '.')
from database import SessionLocal
from models import User
from services.auth_service import get_password_hash

db = SessionLocal()
try:
    # Create admin user
    admin = User(
        email="admin@gigclaimsafe.com",
        password_hash=get_password_hash("Admin@123"),
        name="Admin User",
        platform="Web",
        city="Mumbai",
        weekly_earnings=0,
        work_hours=0,
        upi_id="admin@upi",
        role="admin",
        risk_score=0.0,
        risk_label="Admin",
        is_active=True
    )
    db.add(admin)
    db.commit()
    print(f"✓ Admin created: {admin.email}")
finally:
    db.close()
