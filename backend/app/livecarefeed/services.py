from fastapi import FastAPI
from sqlalchemy.orm import Session
from uuid import UUID

from app.livecarefeed import models as livecarefeed_model
from app.livecarefeed import schemas as livecarefeed_schemas

def create_livecarefeed_service(db:Session,livecarefeed_data:livecarefeed_schemas.LivecarefeedCreate):
    livecarefeed = livecarefeed_model.Livecarefeed( 
        id = livecarefeed_data.id,
        booking_id = livecarefeed_data.booking_id,
        message = livecarefeed_data.message,
        photo_url = livecarefeed_data.photo_url,
        timestamp = livecarefeed_data.timestamp,
        
    )
    db.add(livecarefeed)
    db.commit()
    db.refresh(livecarefeed)
    return livecarefeed

def get_all_livecarefeed_service(db:Session):
    return db.query(livecarefeed_model.Livecarefeed).all()