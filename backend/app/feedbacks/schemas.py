from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class FeedbackCreate(BaseModel):
    booking_id: UUID
    nri_id: UUID
    rating: Optional[str] = None
    comment: Optional[str] = None


class FeedbackRead(BaseModel):
    id: UUID
    booking_id: UUID
    nri_id: UUID
    rating: Optional[str]
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
