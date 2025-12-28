from sqlalchemy import Column, DateTime, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from middleware.db import Base


class Companion(Base):
    __tablename__ = "companions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True) 
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    password = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=False)
    background_verification = Column(Boolean, default=False)
    id_proof_url = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
