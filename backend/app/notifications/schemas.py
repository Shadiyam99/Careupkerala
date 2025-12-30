from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class NotificationCreate(BaseModel):
    id: UUID
    booking_id: UUID
    user_id: UUID
    title: str
    
    

class NotificationRead(BaseModel):
    id: UUID
    booking_id: UUID
    user_id: UUID
    title: str
    message: str
    is_read:str
    created_at:datetime