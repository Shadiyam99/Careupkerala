from fastapi import FastAPI
from sqlalchemy.orm import Session
from uuid import UUID

from app.hospitals import models as hospital_model
from app.hospitals import schemas as hospital_schemas

def create_hospital_service(db:Session,hospital_data:hospital_schemas.HospitalCreate):
    booking = hospital_model.Hospital( 
        id = hospital_data.id,
        name = hospital_data.name,
        location = hospital_data.location,
        address = hospital_data.address,
        
        
    )
    db.add(hospital)
    db.commit()
    db.refresh(hospital)
    return hospital

def get_all_hospital_service(db:Session):
    return db.query(hospital_model.hospital).all()