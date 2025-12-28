from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime

from .models import Services
from .schemas import ServiceCreate, ServiceRead


def create_service_service(db: Session, service_data: ServiceCreate) -> Services:
    service = Services(
        service_type=service_data.service_type,
        base_price=service_data.base_price,
        description=service_data.description,
        updated_at=datetime.utcnow()
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def get_all_services_service(db: Session):
    return db.query(Services).all()
