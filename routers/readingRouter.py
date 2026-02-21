from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from dtos import readingsDto
from service import readingService, sessionService
from repository.database import get_db
import httpx
from dotenv import load_dotenv
import os
from twilio.rest import Client
from ai_engine.fastapi_app import ReadingRequest
from ai_engine.api import CardioTwinAPI


load_dotenv()
# Load Twilio credentials
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
SMS_NUMBER = os.getenv("TWILIO_SMS_NUMBER")
WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")

client = Client(ACCOUNT_SID, AUTH_TOKEN)
ai = CardioTwinAPI()


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
    return readingService.process_reading(data)


@router.get("/score/{session_id}")
def get_latest_score(session_id: str):
    """
    Returns the latest score for frontend polling.
    """
    return readingService.get_latest_score(session_id)


@router.get("/history/{session_id}")
def get_score_history(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Returns all scores for chart rendering.
    Array of score objects with timestamps.
    """
    return readingService.get_all_scores(session_id)



def send_alert(request: readingsDto.MessageRequest):
    """
    Sends SMS or WhatsApp alert using Twilio
    """

    try:
        if request.channel.lower() == "sms":
            message = client.messages.create(
                body=request.message,
                from_=SMS_NUMBER,
                to=request.to_phone
            )

        elif request.channel.lower() == "whatsapp":
            message = client.messages.create(
                body=request.message,
                from_=WHATSAPP_NUMBER,
                to=f"whatsapp:{request.to_phone}"
            )

        else:
            raise HTTPException(status_code=400, detail="Invalid channel. Use 'sms' or 'whatsapp'.")

        return {
            "status": "sent",
            "sid": message.sid,
            "channel": request.channel
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict")
def process_reading(request: ReadingRequest, db: Session = Depends(get_db)):
    result = ai.predict(request)
    
    print(f"ai result: {result}")
    
    if result.get("nudge_sent"):
        exisiting_session = sessionService.fetch_session(request.session_id,db)
        message = ai.get_nudge_message()
        message_request = readingsDto.MessageRequest(to_phone=exisiting_session.user_phone, message= message, channel ="whatsapp")
        send_alert(message_request)
        return result
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='an error occurred with ai service')