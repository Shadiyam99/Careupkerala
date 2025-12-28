from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.booking import services as booking_services
from app.booking import schemas as booking_schemas
from middleware.db import get_db
from typing import List

router = APIRouter(prefix="/booking", tags=["Booking"])


@router.post("/create", response_model=booking_schemas.BookingRead)
def create_booking(
    booking_data: booking_schemas.BookingCreate,
    db: Session = Depends(get_db),
):
    return booking_services.create_booking_service(db, booking_data)


@router.get("/list", response_model=List[booking_schemas.BookingRead])
def get_all_bookings(db: Session = Depends(get_db)):
    return booking_services.get_all_bookings_service(db)