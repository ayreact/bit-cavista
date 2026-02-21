from repository import database;
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class Session(database.Base):
    __tablename__ ="session"
    id: int = Column(Integer, autoincrement=True, index=True, primary_key=True)
    session_id: str = Column(String, index=True, nullable=False)
    user_phone: str = Column(String, index=True, nullable=False)
    
    
class BiometricReading(database.Base):
    __tablename__ = "reading"
    id: int = Column(Integer, index=True, primary_key=True, autoincrement=True)
    bpm: int = Column(Integer, index=True)
    hrv: float = Column(Float, index=True)
    spo2: float = Column(Float, index=True)
    temperature: float = Column(Float, index=True)
    timestamp: datetime = Column(DateTime, index=True)
    session_id: str =Column(String, index=True, nullable=False)
    


class ScoredReadingResponse(database.Base):
    __tablename__ = "scored_reading_response"

    id = Column(Integer, primary_key=True, index=True)  # Proper PK

    zone_emoji = Column(Integer, index=True)
    status = Column(String, index=True)
    score = Column(Float, index=True)
    zone = Column(String, index=True)
    zone_label = Column(String, index=True)
    alert = Column(Boolean, index=True)
    nudge_sent = Column(Boolean, index=True)
    session_id = Column(String, index=True)

    # Foreign Keys
    component_id = Column(Integer, ForeignKey("reading_component.id"))
    baseline_id = Column(Integer, ForeignKey("reading_baseline.id"))

    # Relationships
    components = relationship("ReadingComponent", back_populates="scored_responses")
    baseline = relationship("ReadingBaseline", back_populates="scored_responses")

class ReadingComponent(database.Base):
    __tablename__ = "reading_component"

    id = Column(Integer, primary_key=True, index=True)

    heart_rate = Column(JSON)
    hrv = Column(JSON)
    spo2 = Column(JSON)
    temperature = Column(JSON)

    scored_responses = relationship("ScoredReadingResponse", back_populates="components")

class ReadingBaseline(database.Base):
    __tablename__ = "reading_baseline"

    id = Column(Integer, primary_key=True, index=True)

    resting_bpm = Column(Float)
    resting_hrv = Column(Float)
    normal_spo2 = Column(Float)
    normal_temp = Column(Float)

    scored_responses = relationship("ScoredReadingResponse", back_populates="baseline")