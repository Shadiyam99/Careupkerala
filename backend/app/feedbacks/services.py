from fastapi import FastAPI
from sqlalchemy.orm import Session
from uuid import UUID

from app.feedbacks import models as feedback_model
from app.feedbacks import schemas as feedback_schemas

def create_feedback_service(db:Session,feedback_data:feedback_schemas.FeedbackCreate):
    feedback = feedback_model.Feedback( 
        id = feedback_data.id,
        nri_id = feedback_data.nri_id,
        booking_id = feedback_data.booking_id,
        
        
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

def get_all_feedback_service(db:Session):
    return db.query(feedback_model.Feedback).all()