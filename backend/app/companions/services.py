from fastapi import FastAPI
from sqlalchemy.orm import Session
from uuid import UUID

from app.companions import models as companion_model
from app.companions import schemas as companion_schemas

def create_companion_service(db:Session,companion_data:companion_schemas.CompanionCreate):
    companion = companion_model.Companion( 
       id= companion_data.id,
       full_name = companion_data.full_name,
       email = companion_data.email,
       password= companion_data.password,
       phone = companion_data.phone,
        
    )
    db.add(companion)
    db.commit()
    db.refresh(companion)
    return companion

def get_all_companion_service(db:Session):
    return db.query(companion_model.Companion).all()