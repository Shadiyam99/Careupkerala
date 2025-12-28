from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class BookingCreate(BaseModel):
    nri_id: UUID
    companion_id: UUID
    hospital_id: UUID
    service_id: UUID
    appointment: datetime

class BookingRead(BaseModel):
    id: UUID
    nri_id: UUID
    companion_id: UUID
    hospital_id: UUID
    service_id: UUID
    appointment: datetime
    status: str 
    created_at: datetime



