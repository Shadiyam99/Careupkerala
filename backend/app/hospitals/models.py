from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from middleware.db import Base


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    address = Column(String(200), nullable=False)
    phone = Column(String(20), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)