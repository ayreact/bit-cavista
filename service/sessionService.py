from fastapi import HTTPException, status
from model import dataModel
from repository import database

# starts a new measurement session
def create_session(data, db):
    # Check if session already exists
    session_model = db.query(dataModel.Session).filter(
        dataModel.Session.session_id == data.session_id
    ).first()
    
    if session_model:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Session ID already exists'
        )
    
    # Validate input data
    if not data or data.user_phone is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='User phone is required'
        )
    
    # Create new session
    session_model = dataModel.Session(
        session_id=data.session_id,
        user_phone=data.user_phone
    )
    db.add(session_model)
    db.commit()
    db.refresh(session_model)
    
    # Return response matching SessionResponse model
    return {
        "status": "session_started",
        "session_id": session_model.session_id
    }