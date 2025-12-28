from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime

from .models import Feedback
from .schemas import FeedbackCreate, FeedbackRead


def create_feedback_service(db: Session, feedback_data: FeedbackCreate) -> Feedback:
    feedback = Feedback(
        booking_id=feedback_data.booking_id,
        nri_id=feedback_data.nri_id,
        rating=feedback_data.rating,
        comment=feedback_data.comment
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def get_all_feedbacks_service(db: Session):
    return db.query(Feedback).all()
