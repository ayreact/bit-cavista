from fastapi import APIRouter, Depends, status
from service import readingService
from repository import database
from sqlalchemy.orm import Session
from dtos import readingsDto

reading_router = APIRouter()

@reading_router.post('/api/reading', response_model=readingsDto.CalibratingReadingResponse, status_code=status.HTTP_201_CREATED)
def create_biometric_reading(data: readingsDto.ReadingRequest, db:Session = Depends(database.getDB)):
    return readingService.get_readings_from_hardware(data,db)

@reading_router.post('/api/reading/scored', response_model=readingsDto.ScoredReading, status_code=status.HTTP_201_CREATED)
def create_scored_readings(data: readingsDto.ScoredReading, db:Session = Depends(database.getDB)):
    return readingService.save_scored_reading(data,db)

@reading_router.get('/api/score/{session_id}', status_code=status.HTTP_200_OK)
def get_latest_score(session_id: str, db:Session = Depends(database.getDB)):
    return readingService.get_latest_score(session_id,db)

@reading_router.get('/api/history/{session_id}', status_code=status.HTTP_200_OK)
def get_history_readings(session_id, db:Session = Depends(database.getDB)):
    return readingService.get_all_scores(session_id,db)

@reading_router.post('/api/predict')
def get_predictions(data: readingsDto.PredictionsRequest, db: Session = Depends(database.getDB)):
    return readingService.predict(data,db);