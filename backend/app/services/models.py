from fastapi import FastAPI
from sqlalchemy import Column,DateTime,String
from sqlalchemy.dialects.postgresql import UUID

from middleware.db import Base

class Services(Base):
     __tablename__ = "services"

     id = Column(UUID(as_uuid = True), primary_key = True)
     service_type = Column(String(100),nullable = False)
     base_price = 
     description = 
     update_at = Column(DateTime, nullable = False)


