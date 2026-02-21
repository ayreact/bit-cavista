from pydantic import BaseModel



class SessionRequest(BaseModel):
    session_id: int
    user_phone: str
    
class SessionResponse(BaseModel):
    status: str
    session_id: str
    
    class Config:
        orm_mode = True
    
