# from fastapi import FastAPI
# from sqlalchemy import Column,DateTime,String,TEXT,Boolean
# from sqlalchemy.dialects.postgresql import UUID

# from middleware.db import Base

# class Notification(Base):
#      __tablename__ = "notification"

#      id = Column(UUID(as_uuid = True), primary_key = True) 
#      booking_id = Column(UUID(as_uuid = True), nullable = False)
#      user_id = Column(UUID(as_uuid = True), nullable = False)
#      title = Column(String(255),nullable = False)
#      message = Column(TEXT,nullable=False)
#      is_read = Column(Boolean,nullable=False)
#      created_at = Column(DateTime, nullable = False)

