from pydantic import BaseModel
from typing import Optional


class SessionRequest(BaseModel):
    session_id: int
    user_phone: str
    

class SessionResponse(BaseModel):
    id: int
    session_id: str
    user_phone: str
    status: Optional[str] = None  # Make 'status' optional
    
    class Config:
        orm_mode: True
        