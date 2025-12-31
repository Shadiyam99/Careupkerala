from fastapi import FastAPI
from sqlalchemy.orm import Session
from uuid import UUID

from app.complaints import models as complaint_model
from app.complaints import schemas as complaint_schemas

def create_complaint_service(db:Session,complaint_data:complaint_schemas.ComplaintCreate):
    complaint = complaint_data.Complaint( 
        id = complaint_data.id,
        nri_id = complaint_data.nri_id,
        booking_id = complaint_data.booking_id,
        admin_id = complaint_data.admin_id,
        
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint

def get_all_complaint_service(db:Session):
    return db.query(complaint_model.Complaint).all()