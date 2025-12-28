from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional


class ServiceCreate(BaseModel):
    service_type: str
    base_price: Decimal
    description: Optional[str] = None


class ServiceRead(BaseModel):
    id: UUID
    service_type: str
    base_price: Decimal
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
