from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime

from .models import Payment
from .schemas import PaymentCreate, PaymentRead


def create_payment_service(db: Session, payment_data: PaymentCreate) -> Payment:
    payment = Payment(
        nri_id=payment_data.nri_id,
        booking_id=payment_data.booking_id,
        amount=payment_data.amount,
        transaction_id=payment_data.transaction_id,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def get_all_payments_service(db: Session):
    return db.query(Payment).all()
