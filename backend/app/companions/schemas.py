from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class CompanionCreate(BaseModel):
    full_name: str
    email: str
    password: str
    phone: str
    id_proof_url: str


class CompanionRead(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: str
    background_verification: bool
    id_proof_url: str
    created_at: datetime

    class Config:
        from_attributes = True
