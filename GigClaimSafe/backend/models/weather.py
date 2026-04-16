from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from sqlalchemy.sql import func
from database import Base

class WeatherHistory(Base):
    __tablename__ = "weather_history"
    
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True)
    date = Column(Date, index=True)
    rain_prob = Column(Float)
    aqi = Column(Float)
    temperature = Column(Float)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

