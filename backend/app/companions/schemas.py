from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class CompanionCreate(BaseModel):
    id: UUID
    full_name: str
    email: str  
    password: str
    phone: str
    

class CompanionRead(BaseModel):
    id: UUID
    full_name: str
    email: str  
    password: str
    phone: str
    background_verification: str
    id_proof_url: str
    skils: str
    latitude: str
    longitude: str
    created_at: datetime

