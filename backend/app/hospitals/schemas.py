from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class HospitalCreate(BaseModel):
    name: str
    location: str
    address: str
    phone: str


class HospitalRead(BaseModel):
    id: UUID
    name: str
    location: str
    address: str
    phone: str
    created_at: datetime

    class Config:
        from_attributes = True
