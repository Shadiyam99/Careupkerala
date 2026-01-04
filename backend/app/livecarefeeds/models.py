# from fastapi import FastAPI
# from sqlalchemy import Column,DateTime,String,Text,TIMESTAMP
# from sqlalchemy.dialects.postgresql import UUID

# from middleware.db import Base

# class Livecarefeed(Base):
#      __tablename__ = "livecarefeed"

#      id = Column(UUID(as_uuid = True), primary_key = True) 
#      booking_id = Column(UUID(as_uuid = True), nullable = False)
#      message = Column(Text,nullable=False)
#      phtot_url = Column(Text,nullable=False)
#      timestamp = Column(TIMESTAMP,nullable=False)