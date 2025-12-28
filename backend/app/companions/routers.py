from fastapi import APIRouter
from sqlalchemy.orm import Session
from .services import create_companion,get_all_bookings
from .schemas import 
from middleware.db import get_db
from typing import List

router = APIRouter(prefix = "/companion",tags = ["Companion"])

@router.post("/create",response_model = BookingRead)
def create_booking(
    booking_data: BookingCreate,
    db:Session = Depends(get_db),
):
return create_booking(db,booking_data)

@router.get("/list",response_model = List[BookingRead])
def get_all_bookings(db:Session = Depends(get_db)):
    return get_all_bookings(db)