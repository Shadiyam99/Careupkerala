from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.payments import services as payment_services
from app.payments import schemas as payment_schemas
from middleware.db import get_db
from typing import List

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create", response_model=payment_schemas.PaymentRead)
def create_payment(
    payment_data: payment_schemas.PaymentCreate,
    db: Session = Depends(get_db),
):
    return payment_services.create_payment_service(db, payment_data)


@router.get("/list", response_model=List[payment_schemas.PaymentRead])
def get_all_payments(db: Session = Depends(get_db)):
    return payment_services.get_all_payments_service(db)
