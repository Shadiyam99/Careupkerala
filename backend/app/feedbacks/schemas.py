from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class FeedbackCreate(BaseModel):
    nri_id: UUID
    id: UUID
    booking_id: UUID
    

class FeedbackRead(BaseModel):
    id: UUID
    nri_id: UUID
    booking_id: UUID
    rating: int
    comments: str
    created_at: datetime


