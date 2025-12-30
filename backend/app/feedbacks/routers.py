from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.feedbacks import services as feedback_services
from app.feedbacks import schemas as feedback_schemas
from middleware.db import get_db
from typing import List

router = APIRouter(prefix = "/feedback",tags = ["Feedback"])

@router.post("/create",response_model = feedback_schemas.FeedbackRead)
def create_feedback(
    feedback_data: feedback_schemas.FeedbackCreate,
    db:Session = Depends(get_db),
):
    return feedback_services.create_feedback_service(db,feedback_data)

@router.get("/list",response_model = List[feedback_schemas.FeedbackRead])
def get_all_feedback(db:Session = Depends(get_db)):
    return feedback_services.get_all_feedback_service(db)