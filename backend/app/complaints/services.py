from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime

from .models import Complaint
from .schemas import ComplaintCreate, ComplaintRead


def create_complaint_service(db: Session, complaint_data: ComplaintCreate) -> Complaint:
    complaint = Complaint(
        booking_id=complaint_data.booking_id,
        nri_id=complaint_data.nri_id,
        admin_id=complaint_data.admin_id,
        issue=complaint_data.issue,
        update_at=datetime.utcnow()
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint


def get_all_complaints_service(db: Session):
    return db.query(Complaint).all()
