from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class LivecarefeedCreate(BaseModel):
    id: UUID
    booking_id: UUID
    

class LivecarefeedRead(BaseModel):
    id: UUID
    booking_id: UUID
    message: str
    photo_url: str
    timestamp: str
