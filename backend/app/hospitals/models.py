from fastapi import FastAPI
from sqlalchemy import Column,DateTime,String
from sqlalchemy.dialects.postgresql import UUID

from middleware.db import Base

class hospital(Base):
    __tablename__ = "hospitals"

    id = Column(UUID(as_uuid = True), primary_key = True)
    name = Column(String(100),nullable = False)
    location = Column(String(100),nullable = False)
    address = Column(String(200),nullable = False)
    phone = Column(String(20),nullable = False)
    created_at = Column(DateTime, nullable = False)