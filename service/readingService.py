from fastapi import HTTPException, status
from model import dataModel
from dtos import readingsDto
from config import settings
import httpx

CALIBRATION_THRESHOLD = settings.CALIBRATION_THRESHOLD
AI_SERVICE_URL = settings.AI_SERVICE_URL

def process_reading(data: readingsDto.BiometricReadingRequest, db):
    """
    Process incoming biometric reading from hardware.
    Returns calibrating response until threshold reached, then scored response.
    """
    # Save the biometric reading
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
    
    # Get readings count for this session
    readings_collected = get_session_readings_count(data.session_id, db)
    
    # Check if still calibrating
    if readings_collected < CALIBRATION_THRESHOLD:
        return readingsDto.CalibratingReadingResponse(
            status="calibrating",
            readings_collected=readings_collected,
            readings_needed=CALIBRATION_THRESHOLD,
            alert=False
        )
    
    # Use hardware-provided components and baseline
    components = data.components
    baseline = data.baseline
    
    overall_score = calculate_overall_score(components)
    zone, zone_label, zone_emoji = get_zone_info(overall_score)
    alert = overall_score < 30
    
    return readingsDto.ScoredReadingResponse(
        status="scored",
        score=round(overall_score, 1),
        zone=zone,
        zone_label=zone_label,
        zone_emoji=zone_emoji,
        alert=alert,
        nudge_sent=False,
        components=components,
        baseline=baseline
    )


def get_session_readings_count(session_id: str, db) -> int:
    """Returns the count of readings for a specific session."""
    return db.query(dataModel.BiometricReading).filter(
        dataModel.BiometricReading.session_id == session_id
    ).count()


def calculate_overall_score(components: readingsDto.ComponentsData) -> float:
    """Weighted composite score from individual components."""
    weights = {'heart_rate': 0.30, 'hrv': 0.25, 'spo2': 0.30, 'temperature': 0.15}
    return (
        components.heart_rate.score * weights['heart_rate'] +
        components.hrv.score * weights['hrv'] +
        components.spo2.score * weights['spo2'] +
        components.temperature.score * weights['temperature']
    )


def get_zone_info(score: float) -> tuple:
    """Return zone, label, and emoji based on score."""
    if score >= 70:
        return "GREEN", "Thriving", "🟢"
    elif score >= 50:
        return "YELLOW", "Caution", "🟡"
    elif score >= 30:
        return "ORANGE", "Elevated Risk", "🟠"
    return "RED", "Critical Strain", "🔴"


def get_latest_score(session_id: str, db):
    """Returns the latest calculated score for a session."""
    latest_reading = (
        db.query(dataModel.BiometricReading)
        .filter(dataModel.BiometricReading.session_id == session_id)
        .order_by(dataModel.BiometricReading.id.desc())
        .first()
    )

    if not latest_reading:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No readings found for this session")

    readings_count = get_session_readings_count(session_id, db)
    if readings_count < CALIBRATION_THRESHOLD:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Still calibrating. {readings_count}/{CALIBRATION_THRESHOLD} readings collected.")

    # For GET endpoint, we need stored component/baseline data
    # Return basic score info from stored readings
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST, 
        detail="Use POST /api/reading endpoint with hardware data for scored responses"
    )


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

    # Return raw readings data for charting
    return [
        {
            "timestamp": reading.timestamp,
            "bpm": reading.bpm,
            "hrv": reading.hrv,
            "spo2": reading.spo2,
            "temperature": reading.temperature
        }
        for reading in readings
    ]


def predict(data: readingsDto.PredictionsRequest, db):
    """What-if risk projection - calls external AI service."""
    readings_count = get_session_readings_count(data.session_id, db)
    if readings_count < CALIBRATION_THRESHOLD:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough readings for prediction")

    # Get latest reading
    latest_reading = db.query(dataModel.BiometricReading).filter(
        dataModel.BiometricReading.session_id == data.session_id
    ).order_by(dataModel.BiometricReading.id.desc()).first()

    # Prepare payload for AI service
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
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"AI service unavailable: {str(e)}")