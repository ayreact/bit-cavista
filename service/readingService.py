from fastapi import HTTPException, status
from model import dataModel
from dtos import readingsDto
from config import settings
import httpx

CALIBRATION_THRESHOLD = settings.CALIBRATION_THRESHOLD
AI_SERVICE_URL = settings.AI_SERVICE_URL

ZONE_THRESHOLDS = [
    (70, "GREEN", "Thriving", "🟢"),
    (50, "YELLOW", "Caution", "🟡"),
    (30, "ORANGE", "Elevated Risk", "🟠"),
    (0, "RED", "Critical Strain", "🔴"),
]

COMPONENT_WEIGHTS = {'heart_rate': 0.30, 'hrv': 0.25, 'spo2': 0.30, 'temperature': 0.15}


def process_reading(data: readingsDto.BiometricReadingRequest, db):
    """Process incoming biometric reading from hardware."""
    biometric_reading = dataModel.BiometricReading(
        bpm=data.bpm,
        hrv=data.hrv,
        spo2=data.spo2,
        temperature=data.temperature,
        timestamp=data.timestamp,
        session_id=data.session_id
    )
    db.add(biometric_reading)
    db.commit()
    db.refresh(biometric_reading)
    
    readings_collected = get_session_readings_count(data.session_id, db)
    
    if readings_collected < CALIBRATION_THRESHOLD:
        return readingsDto.CalibratingReadingResponse(
            status="calibrating",
            readings_collected=readings_collected,
            readings_needed=CALIBRATION_THRESHOLD,
            alert=False
        )
    
    overall_score = calculate_overall_score(data.components)
    zone, zone_label, zone_emoji = get_zone_info(overall_score)
    
    return readingsDto.ScoredReadingResponse(
        status="scored",
        score=round(overall_score, 1),
        zone=zone,
        zone_label=zone_label,
        zone_emoji=zone_emoji,
        alert=overall_score < 30,
        nudge_sent=False,
        components=data.components,
        baseline=data.baseline
    )


def get_session_readings_count(session_id: str, db) -> int:
    """Returns the count of readings for a specific session."""
    return db.query(dataModel.BiometricReading).filter(
        dataModel.BiometricReading.session_id == session_id
    ).count()


def calculate_overall_score(components: readingsDto.ComponentsData) -> float:
    """Weighted composite score from individual components."""
    return (
        components.heart_rate.score * COMPONENT_WEIGHTS['heart_rate'] +
        components.hrv.score * COMPONENT_WEIGHTS['hrv'] +
        components.spo2.score * COMPONENT_WEIGHTS['spo2'] +
        components.temperature.score * COMPONENT_WEIGHTS['temperature']
    )


def get_zone_info(score: float) -> tuple:
    """Return zone, label, and emoji based on score."""
    for threshold, zone, label, emoji in ZONE_THRESHOLDS:
        if score >= threshold:
            return zone, label, emoji


def get_all_scores(session_id: str, db):
    """Returns all readings for chart rendering."""
    readings = (
        db.query(dataModel.BiometricReading)
        .filter(dataModel.BiometricReading.session_id == session_id)
        .order_by(dataModel.BiometricReading.id.asc())
        .all()
    )

    if not readings:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No readings found for this session")

    if len(readings) < CALIBRATION_THRESHOLD:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Still calibrating. {len(readings)}/{CALIBRATION_THRESHOLD} readings collected.")

    return [
        {
            "timestamp": r.timestamp,
            "bpm": r.bpm,
            "hrv": r.hrv,
            "spo2": r.spo2,
            "temperature": r.temperature
        }
        for r in readings
    ]


def predict(data: readingsDto.PredictionsRequest, db):
    """What-if risk projection - calls external AI service."""
    readings_count = get_session_readings_count(data.session_id, db)
    if readings_count < CALIBRATION_THRESHOLD:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough readings for prediction")

    latest_reading = db.query(dataModel.BiometricReading).filter(
        dataModel.BiometricReading.session_id == data.session_id
    ).order_by(dataModel.BiometricReading.id.desc()).first()

    ai_payload = {
        "session_id": data.session_id,
        "days": data.days,
        "latest_reading": {
            "bpm": latest_reading.bpm,
            "hrv": latest_reading.hrv,
            "spo2": latest_reading.spo2,
            "temperature": latest_reading.temperature
        }
    }

    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(f"{AI_SERVICE_URL}/api/predict", json=ai_payload)
            response.raise_for_status()
            ai_response = response.json()
            
            return readingsDto.PredictionsResponse(
                current_score=ai_response.get("current_score"),
                projected_score=ai_response.get("projected_score"),
                projected_resting_hr_increase_bpm=ai_response.get("projected_resting_hr_increase_bpm"),
                current_risk_category=ai_response.get("current_risk_category"),
                projected_risk_category=ai_response.get("projected_risk_category"),
                disclaimer=ai_response.get("disclaimer", "Statistical projection only. Not a medical diagnosis.")
            )
    except httpx.TimeoutException:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="AI service timeout")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="AI service error")
    except Exception:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="AI service unavailable")