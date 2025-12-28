from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime

from .models import Companion
from .schemas import CompanionCreate, CompanionRead


def create_companion_service(db: Session, companion_data: CompanionCreate) -> Companion:
    companion = Companion(
        full_name=companion_data.full_name,
        email=companion_data.email,
        password=companion_data.password,
        phone=companion_data.phone,
        id_proof_url=companion_data.id_proof_url
    )
    db.add(companion)
    db.commit()
    db.refresh(companion)
    return companion


def get_all_companions_service(db: Session):
    return db.query(Companion).all()
