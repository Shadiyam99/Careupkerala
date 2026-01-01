from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


class FeedbackCreate(BaseModel):
    booking_id: UUID
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: UUID
    booking_id: UUID
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
