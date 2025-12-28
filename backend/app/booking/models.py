from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from middleware.db import Base


class Booking(Base):
    __tablename__ = "booking"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    nri_id = Column(UUID(as_uuid=True), nullable=False)
    companion_id = Column(UUID(as_uuid=True), nullable=False)
    hospital_id = Column(UUID(as_uuid=True), nullable=False)
    service_id = Column(UUID(as_uuid=True), nullable=False)
    appointment = Column(DateTime, nullable=False)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
