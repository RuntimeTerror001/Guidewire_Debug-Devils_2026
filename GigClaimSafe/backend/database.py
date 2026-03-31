from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Using SQLite for simplicity - can switch to PostgreSQL by changing the DATABASE_URL
DATABASE_URL = "sqlite:///./gigclaimsafe.db"
# For PostgreSQL: DATABASE_URL = "postgresql://user:password@localhost/gigclaimsafe"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
