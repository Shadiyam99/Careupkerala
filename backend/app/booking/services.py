from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime

from .models import Booking
from .schemas import BookingCreate, BookingRead

def create_booking_service(db: Session, booking_data: BookingCreate) -> Booking:
    booking = Booking(
        nri_id=booking_data.nri_id,
        companion_id=booking_data.companion_id,
        hospital_id=booking_data.hospital_id,
        service_id=booking_data.service_id,
        appointment=booking_data.appointment
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def get_all_bookings_service(db: Session):
    return db.query(Booking).all()