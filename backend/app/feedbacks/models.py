from fastapi import FastAPI
from sqlalchemy import Column,DateTime,String,INT,Text
from sqlalchemy.dialects.postgresql import UUID

from middleware.db import Base

class Feedback(Base):
     __tablename__ = "feedback"

     id = Column(UUID(as_uuid = True), primary_key = True)
     booking_id = Column(UUID(as_uuid = True), nullable = False)
     nri_id = Column(UUID(as_uuid = True), nullable = False)
     rating = Column(INT,nullable=False)
     comments = Column(Text,nullable=False)
     created_at = Column(DateTime, nullable = False)

