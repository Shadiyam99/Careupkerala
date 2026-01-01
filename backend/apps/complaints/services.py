from sqlalchemy.orm import Session
from apps.complaints.models import Complaint
from apps.bookings.models import Booking
from apps.complaints.schemas import ComplaintCreate, ComplaintAdminUpdate
from uuid import UUID
from datetime import datetime


def create_complaint(db: Session, data: ComplaintCreate, current_user: dict):
    role = current_user.get("role")
    user_id = UUID(current_user.get("user_id"))
    
    if role != "nri":
        raise ValueError("Only NRI users can create complaints")
    
    booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
    
    if not booking:
        raise ValueError("Booking not found")
    
    if booking.nri_id != user_id:
        raise ValueError("You can only create complaints for your own bookings")
    
    complaint = Complaint(
        booking_id=data.booking_id,
        nri_user_id=user_id,
        title=data.title,
        description=data.description
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    
    return complaint


def get_my_complaints(db: Session, current_user: dict):
    role = current_user.get("role")
    user_id = UUID(current_user.get("user_id"))
    
    if role != "nri":
        raise ValueError("Only NRI users can view their complaints")
    
    complaints = db.query(Complaint).filter(
        Complaint.nri_user_id == user_id
    ).order_by(Complaint.created_at.desc()).all()
    
    return complaints


def get_all_complaints(db: Session, current_user: dict):
    role = current_user.get("role")
    
    if role != "admin":
        raise ValueError("Only Admin users can view all complaints")
    
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    
    return complaints


def update_complaint(db: Session, complaint_id: UUID, data: ComplaintAdminUpdate, current_user: dict):
    role = current_user.get("role")
    
    if role != "admin":
        raise ValueError("Only Admin users can update complaints")
    
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    
    if not complaint:
        raise ValueError("Complaint not found")
    
    if data.status not in ["open", "in_review", "resolved", "rejected"]:
        raise ValueError("Invalid status value")
    
    complaint.status = data.status
    if data.admin_response is not None:
        complaint.admin_response = data.admin_response
    complaint.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(complaint)
    
    return complaint
