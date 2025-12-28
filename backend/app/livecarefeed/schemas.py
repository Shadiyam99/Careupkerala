from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class LivecarefeedCreate(BaseModel):
    booking_id: UUID
    message: Optional[str] = None
    photo_url: Optional[str] = None


class LivecarefeedRead(BaseModel):
    id: UUID
    booking_id: UUID
    message: Optional[str]
    photo_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
