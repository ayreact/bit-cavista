from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dtos import readingsDto
from service import readingService
from repository.database import get_db

router = APIRouter(
    prefix="/api",
    tags=["Reading"]
)

@router.post("/reading")
def receive_biometric_reading(
    data: readingsDto.BiometricReadingRequest,
    db: Session = Depends(get_db)
):
    """
    Receives biometric reading from ESP32. Called every 2 seconds.
    Returns calibrating response until 15 readings collected,
    then returns scored response.
    """
    return readingService.process_reading(data, db)


@router.get("/score/{session_id}")
def get_latest_score(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Returns the latest score for frontend polling.
    """
    return readingService.get_latest_score(session_id, db)


@router.get("/history/{session_id}")
def get_score_history(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Returns all scores for chart rendering.
    Array of score objects with timestamps.
    """
    return readingService.get_all_scores(session_id, db)


@router.post("/predict")
def predict_risk(
    data: readingsDto.PredictionsRequest,
    db: Session = Depends(get_db)
):
    """
    What-if risk projection.
    Returns current and projected scores based on specified days.
    """
    return readingService.predict(data, db)
