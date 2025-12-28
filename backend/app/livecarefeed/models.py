from sqlalchemy import Column, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime
from middleware.db import Base


class Livecarefeed(Base):
    __tablename__ = "livecarefeed"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True) 
    booking_id = Column(UUID(as_uuid=True), nullable=False)
    message = Column(Text, nullable=True)
    photo_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)