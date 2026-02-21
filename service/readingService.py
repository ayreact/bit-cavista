from fastapi import HTTPException, status
from model import dataModel
from dtos import readingsDto
from repository import database


#receives biometric reading from ESP32. Called every 2 seconds
def get_readings_from_hardware(data,db):
    biometric_reading = dataModel.BiometricReading(bpm=data.bpm, hrv = data.hrv, spo2 = data.spo2, temperature=data.temperature, timestamp = data.timestamp, session_id=data.session_id)
    db.add(biometric_reading)
    db.commit()
    db.refresh(biometric_reading)
    
    return readingsDto.CalibratingReadingResponse(status="calibrating", readings_collected=get_readings_collected(db), readings_needed=get_readings_needed(db), alert=False)


def get_readings_collected(db):
    """
    Returns the total number of scored readings collected.
    """
    count = db.query(dataModel.ScoredReadingResponse).count()
    return count


def get_readings_needed(db):
    """
    Returns the number of BiometricReading records that still need scoring.
    """
    # Subquery: all sessions that have been scored
    scored_session_ids = db.query(dataModel.ScoredReadingResponse.session_id).distinct()

    # Count readings whose session_id is NOT in scored_session_ids
    count = db.query(dataModel.BiometricReading).filter(~dataModel.BiometricReading.session_id.in_(scored_session_ids)).count()
    return count

def get_latest_score(session_id: str, db):
    latest_scored_reading = (
        db.query(dataModel.ScoredReadingResponse)
        .filter(dataModel.ScoredReadingResponse.session_id == session_id)
        .order_by(dataModel.ScoredReadingResponse.id.desc())  # or timestamp.desc() if you add it
        .first()
    )

    if not latest_scored_reading:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No score found for this session"
        )

    return latest_scored_reading


def get_all_scores(session_id,db):
    history_readings = db.query(dataModel.ScoredReadingResponse).filter(dataModel.ScoredReadingResponse.session_id == session_id).all()

    if not history_readings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No history readings found"
        )

    return history_readings

def save_scored_reading(request_data, db):
    # 1️⃣ Save components
    components = dataModel.ReadingComponent(
        heart_rate=[request_data.components.heart_rate.value],
        hrv=[request_data.components.hrv.value],
        spo2=[request_data.components.spo2.value],
        temperature=[request_data.components.temperature.value]
    )
    db.add(components)
    db.commit()
    db.refresh(components)

    # 2️⃣ Save baseline
    baseline = dataModel.ReadingBaseline(
        resting_bpm=request_data.baseline.resting_bpm,
        resting_hrv=request_data.baseline.resting_hrv,
        normal_spo2=request_data.baseline.normal_spo2,
        normal_temp=request_data.baseline.normal_temp
    )
    db.add(baseline)
    db.commit()
    db.refresh(baseline)

    # 3️⃣ Save scored reading
    scored = dataModel.ScoredReadingResponse(
        session_id=request_data.session_id,
        zone=request_data.zone,
        zone_label=request_data.zone_label,
        zone_emoji=request_data.zone_emoji,
        status=request_data.status,
        score=request_data.score,
        alert=request_data.alert,
        nudge_sent=request_data.nudge_sent,
        components=components,
        baseline=baseline
    )

    db.add(scored)
    db.commit()
    db.refresh(scored)

    return scored

def predict(data,db):
    pass