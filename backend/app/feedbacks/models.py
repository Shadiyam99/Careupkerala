from sqlalchemy import Column, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from middleware.db import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    booking_id = Column(UUID(as_uuid=True), nullable=False)
    nri_id = Column(UUID(as_uuid=True), nullable=False)
    rating = Column(String(10), nullable=True)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

