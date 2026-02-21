from typing import List
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ReadingComponentDTO(BaseModel):
    id: int
    heart_rate: Optional[list]
    hrv: Optional[list]
    spo2: Optional[list]
    temperature: Optional[list]

    class Config:
        orm_mode = True
        
class ReadingBaselineDTO(BaseModel):
    id: int
    resting_bpm: float
    resting_hrv: float
    normal_spo2: float
    normal_temp: float

    class Config:
        orm_mode = True

class ScoredReading(BaseModel):
    id: int
    zone_emoji: int
    status: str
    score: float
    zone: str
    zone_label: str
    alert: bool
    nudge_sent: bool
    session_id: str

    components: Optional[ReadingComponentDTO]
    baseline: Optional[ReadingBaselineDTO]

    class Config:
        orm_mode = True
        
class ReadingRequest(BaseModel):
    bpm: int
    hrv: float
    spo2: float
    temperature: float
    timestamp: datetime
    session_id: str
    
class CalibratingReadingResponse(BaseModel):
    status: str
    readings_collected: int
    readings_needed: int
    alert: bool
    
    class Config:
        orm_mode = True
    
    
    
    
class PredictionsRequest(BaseModel):
    session_id: str
    days: str