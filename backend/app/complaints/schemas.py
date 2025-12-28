from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class ComplaintCreate(BaseModel):
    booking_id: UUID
    nri_id: UUID
    admin_id: UUID
    issue: str


class ComplaintRead(BaseModel):
    id: UUID
    booking_id: UUID
    nri_id: UUID
    admin_id: UUID
    issue: str
    status: str
    update_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
