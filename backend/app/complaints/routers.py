from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.complaints import services as complaint_services
from app.complaints import schemas as complaint_schemas
from middleware.db import get_db
from typing import List

router = APIRouter(prefix="/complaints", tags=["Complaints"])


@router.post("/create", response_model=complaint_schemas.ComplaintRead)
def create_complaint(
    complaint_data: complaint_schemas.ComplaintCreate,
    db: Session = Depends(get_db),
):
    return complaint_services.create_complaint_service(db, complaint_data)


@router.get("/list", response_model=List[complaint_schemas.ComplaintRead])
def get_all_complaints(db: Session = Depends(get_db)):
    return complaint_services.get_all_complaints_service(db)
