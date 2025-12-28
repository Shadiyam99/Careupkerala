from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from decimal import Decimal


class PaymentCreate(BaseModel):
    nri_id: UUID
    booking_id: UUID
    amount: Decimal
    transaction_id: str


class PaymentRead(BaseModel):
    id: UUID
    nri_id: UUID
    booking_id: UUID
    amount: Decimal
    status: str
    created_at: datetime
    transaction_id: str

    class Config:
        from_attributes = True
