from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class ComplaintCreate(BaseModel):
    booking_id: UUID
    title: str
    description: str


class ComplaintResponse(BaseModel):
    id: UUID
    booking_id: UUID
    title: str
    description: str
    status: str
    admin_response: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ComplaintAdminUpdate(BaseModel):
    status: str
    admin_response: Optional[str] = None
