from typing import Union, Optional
from pydantic import BaseModel
from datetime import datetime

# Component and Baseline DTOs
class ComponentScore(BaseModel):
    value: float
    score: float

class ComponentsData(BaseModel):
    heart_rate: ComponentScore
    hrv: ComponentScore
    spo2: ComponentScore
    temperature: ComponentScore

class BaselineData(BaseModel):
    resting_bpm: float
    resting_hrv: float
    normal_spo2: float
    normal_temp: float

# Request DTOs
class ReadingRequest(BaseModel):
    bpm: float
    hrv: float
    spo2: float
    temperature: float
    timestamp: Union[int, datetime]
    session_id: str
    components: ComponentsData  # Required from hardware
    baseline: BaselineData      # Required from hardware

# Alias for backward compatibility
BiometricReadingRequest = ReadingRequest

class PredictionsRequest(BaseModel):
    session_id: str
    days: int

# Response DTOs
class CalibratingReadingResponse(BaseModel):
    status: str = "calibrating"
    readings_collected: int
    readings_needed: int
    alert: bool = False

class ScoredReadingResponse(BaseModel):
    status: str = "scored"
    score: float
    zone: str
    zone_label: str
    zone_emoji: str
    alert: bool = False
    nudge_sent: bool = False
    components: ComponentsData
    baseline: BaselineData

class PredictionsResponse(BaseModel):
    current_score: float
    projected_score: float
    projected_resting_hr_increase_bpm: float
    current_risk_category: str
    projected_risk_category: str
    disclaimer: str = "Statistical projection only. Not a medical diagnosis."