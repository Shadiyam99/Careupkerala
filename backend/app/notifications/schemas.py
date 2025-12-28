from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class NotificationCreate(BaseModel):
    booking_id: UUID
    user_id: UUID
    title: str
    message: str


class NotificationRead(BaseModel):
    id: UUID
    booking_id: UUID
    user_id: UUID
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
