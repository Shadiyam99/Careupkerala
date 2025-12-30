from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.hospitals import services as hospital_services
from app.hospitals import schemas as hospital_schemas
from middleware.db import get_db
from typing import List

router = APIRouter(prefix = "/hospital",tags = ["Hospital"])

@router.post("/create",response_model = hospital_schemas.HospitalRead)
def create_hospital(
    hospital_data: hospital_schemas.HospitalCreate,
    db:Session = Depends(get_db),
):
    return hospital_services.create_hospital_service(db,hospital_data)

@router.get("/list",response_model = List[hospital_schemas.HospitalRead])
def get_all_hospital(db:Session = Depends(get_db)):
    return hospital_services.get_all_hospital_service(db)