from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services import services as service_services
from app.services import schemas as service_schemas
from middleware.db import get_db
from typing import List

router = APIRouter(prefix="/services", tags=["Services"])


@router.post("/create", response_model=service_schemas.ServiceRead)
def create_service(
    service_data: service_schemas.ServiceCreate,
    db: Session = Depends(get_db),
):
    return service_services.create_service_service(db, service_data)


@router.get("/list", response_model=List[service_schemas.ServiceRead])
def get_all_services(db: Session = Depends(get_db)):
    return service_services.get_all_services_service(db)
