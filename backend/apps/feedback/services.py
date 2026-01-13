from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from apps.feedback.models import Feedback
from apps.bookings.models import Booking
from apps.feedback.schemas import FeedbackCreate
from apps.notifications.services import create_notification
from uuid import UUID


def create_feedback(db: Session, data: FeedbackCreate, current_user: dict):
    role = current_user.get("role")
    user_id = UUID(current_user.get("user_id"))
    
    if role != "nri":
        raise ValueError("Only NRI users can submit feedback")
    
    booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
    
    if not booking:
        raise ValueError("Booking not found")
    
    if booking.nri_id != user_id:
        raise ValueError("You can only submit feedback for your own bookings")
    
    if booking.status != "completed":
        raise ValueError("Feedback can only be submitted for completed bookings")
    
    existing_feedback = db.query(Feedback).filter(Feedback.booking_id == data.booking_id).first()
    if existing_feedback:
        raise ValueError("Feedback already submitted for this booking")
    
    feedback = Feedback(
        booking_id=data.booking_id,
        nri_user_id=user_id,
        rating=data.rating,
        comment=data.comment
    )
    
    try:
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
    except IntegrityError:
        db.rollback()
        raise ValueError("Feedback already submitted for this booking")

    # Notify Admin
    try:
        from auth.models import Admin
        admin = db.query(Admin).first()
        if admin:
             create_notification(
                db=db,
                user_id=str(admin.id),
                role="admin",
                title="New Feedback Received",
                message=f"Feedback received for booking {booking.id}. Rating: {data.rating}/5",
                related_entity="feedback",
                related_entity_id=feedback.id
            )
    except Exception as e:
        print(f"Failed to send notification: {e}")
    
    return feedback


def get_my_feedback(db: Session, current_user: dict):
    role = current_user.get("role")
    user_id = UUID(current_user.get("user_id"))
    
    if role != "nri":
        raise ValueError("Only NRI users can view their feedback")
    
    feedback_list = db.query(Feedback).filter(
        Feedback.nri_user_id == user_id
    ).order_by(Feedback.created_at.desc()).all()
    
    return feedback_list


def get_all_feedback(db: Session, current_user: dict):
    role = current_user.get("role")
    
    if role != "admin":
        raise ValueError("Only Admin users can view all feedback")
    
    feedback_list = db.query(Feedback).order_by(Feedback.created_at.desc()).all()
    
    return feedback_list
