from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime

from .models import Hospital
from .schemas import HospitalCreate, HospitalRead


def create_hospital_service(db: Session, hospital_data: HospitalCreate) -> Hospital:
    hospital = Hospital(
        name=hospital_data.name,
        location=hospital_data.location,
        address=hospital_data.address,
        phone=hospital_data.phone,
    )
    db.add(hospital)
    db.commit()
    db.refresh(hospital)
    return hospital


def get_all_hospitals_service(db: Session):
    return db.query(Hospital).all()
