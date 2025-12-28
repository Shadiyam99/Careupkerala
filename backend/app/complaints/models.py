from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from middleware.db import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    booking_id = Column(UUID(as_uuid=True), nullable=False) 
    nri_id = Column(UUID(as_uuid=True), nullable=False)
    admin_id = Column(UUID(as_uuid=True), nullable=False)
    issue = Column(String(100), nullable=False)
    status = Column(String(20), default="pending")
    update_at = Column(DateTime, nullable=False) 
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
