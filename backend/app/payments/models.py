from sqlalchemy import Column, DateTime, String, Numeric
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from middleware.db import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    nri_id = Column(UUID(as_uuid=True), nullable=False)
    booking_id = Column(UUID(as_uuid=True), nullable=False) 
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    transaction_id = Column(String(100), nullable=False)
  

