from fastapi import HTTPException, status
from model import dataModel
from repository import database

database.Base.metadata.create_all(bind=database.engine)


#starts a new measurement sessionn
def create_session(data,db):
    session_model = db.query(dataModel.Session).filter(dataModel.Session.session_id == data.session_id).first()
    if session_model:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Session ID already exists')
    else:
        if not data or data.user_phone is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='not request data found')
        session_model = dataModel.Session(session_id = data.session_id, user_phone = data.user_phone)
        db.add(session_model)
        db.commit()
        db.refresh(session_model)
        return session_model
        