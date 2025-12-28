from fastapi import FastAPI
from sqlalchemy import Column,DateTime,String
from sqlalchemy.dialects.postgresql import UUID

from middleware.db import Base

class Notification(Base):
     __tablename__ = "notification"

     id = Column(UUID(as_uuid = True), primary_key = True) 
     booking_id = Column(UUID(as_uuid = True), nullable = False)
     user_id = Column(UUID(as_uuid = True), nullable = False)
     title = Column(String(255),nullable = False)
     message = 
     is_read = 
     created_at = Column(DateTime, nullable = False)

