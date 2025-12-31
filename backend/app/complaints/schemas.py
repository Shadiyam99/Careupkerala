from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ComplaintCreate(BaseModel):
    id: UUID
    booking_id: UUID
    admin_id: UUID
    nri_id: UUID
    

class ComplaintRead(BaseModel):
    id: UUID
    nri_id: UUID
    booking_id: UUID
    admin_id: UUID
    issue: str
    status: str
    note: str
    status: str 
    updated_at: datetime
    created_at: datetime