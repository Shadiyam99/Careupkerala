from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class BookingCreate(BaseModel):
    hospital_id: UUID
    service_id: UUID
    pricing_id: UUID
    scheduled_date: datetime


class BookingResponse(BaseModel):
    id: UUID
    nri_id: UUID
    hospital_id: UUID
    service_id: UUID
    pricing_id: UUID
    companion_id: Optional[UUID]
    status: str
    scheduled_date: datetime
    created_at: datetime


class BookingStatusUpdate(BaseModel):
    status: str


class BookingAssignCompanion(BaseModel):
    companion_id: UUID
