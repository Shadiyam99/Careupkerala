from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class HospitalCreate(BaseModel):
    id: UUID
    name: str
    location: str
    address: str
    

class HospitalRead(BaseModel):
    id: UUID
    name: str
    location: str
    address: str
    phone: str 
    created_at: datetime

