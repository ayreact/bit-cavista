from fastapi import HTTPException, status
from ai_engine.api import CardioTwinAPI
from model import dataModel
from dtos import readingsDto
from config import settings

CALIBRATION_THRESHOLD = settings.CALIBRATION_THRESHOLD

ZONE_THRESHOLDS = [
    (70, "GREEN", "Thriving", "🟢"),
    (50, "YELLOW", "Caution", "🟡"),
    (30, "ORANGE", "Elevated Risk", "🟠"),
    (0, "RED", "Critical Strain", "🔴"),
]

COMPONENT_WEIGHTS = {'heart_rate': 0.30, 'hrv': 0.25, 'spo2': 0.30, 'temperature': 0.15}
api = CardioTwinAPI()

def process_reading(data: readingsDto.BiometricReadingRequest):
    """Process incoming biometric reading from hardware."""
    return api.process_reading(data.dict())



def get_all_scores(session_id: str):
    """Returns all readings for chart rendering."""
    return api.get_history(session_id)

def get_latest_score(session_id):
    return api.get_score(session_id)
    
def get_history(session_id):
    return api.get_history(session_id)

def predict(data):
    return api.predict(data.session_id, data.days)