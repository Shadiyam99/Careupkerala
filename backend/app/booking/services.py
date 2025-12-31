from fastapi import FastAPI
from sqlalchemy.orm import Session
from uuid import UUID

from app.booking import models as booking_model
from app.booking import schemas as booking_schemas

def create_booking_service(db:Session,booking_data:booking_schemas.BookingCreate):
    booking = booking_model.Booking( 
        nri_id = booking_data.nri_id,
        companion_id = booking_data.companion_id,
        hospital_id = booking_data.hospital_id,
        service_id = booking_data.service_id,
        appointment = booking_data.appointment,
        
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def get_all_bookings_service(db:Session):
    return db.query(booking_model.Booking).all()