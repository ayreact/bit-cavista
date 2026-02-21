from fastapi import APIRouter, Depends, status
from service import sessionService
from repository import database
from dtos import sessionDto
from sqlalchemy.orm import Session

session_router = APIRouter()

@session_router.post('/api/session/start', status_code=status.HTTP_201_CREATED, response_model=sessionDto.SessionResponse)
def create_session(data: sessionDto.SessionRequest, db:Session = Depends(database.getDB)):
    return sessionService.create_session(data,db)

