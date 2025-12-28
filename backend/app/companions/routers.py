from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.companions import services as companion_services
from app.companions import schemas as companion_schemas
from middleware.db import get_db
from typing import List

router = APIRouter(prefix="/companion", tags=["Companion"])


@router.post("/create", response_model=companion_schemas.CompanionRead)
def create_companion(
    companion_data: companion_schemas.CompanionCreate,
    db: Session = Depends(get_db),
):
    return companion_services.create_companion_service(db, companion_data)


@router.get("/list", response_model=List[companion_schemas.CompanionRead])
def get_all_companions(db: Session = Depends(get_db)):
    return companion_services.get_all_companions_service(db)