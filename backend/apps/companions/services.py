from sqlalchemy.orm import Session
from uuid import UUID
from apps.companions.models import Companion
from apps.companions.schemas import CompanionResponse, CompanionAvailabilityUpdate


def get_pending_companions(db: Session, current_user: dict) -> list[CompanionResponse]:
    """Get all pending companions (status=false). Admin-only."""
    if current_user["role"] != "admin":
        raise ValueError("Only admins can view pending companions")
    
    companions = db.query(Companion).filter(Companion.status == False).all()
    return [
        CompanionResponse(
            id=c.id,
            full_name=c.full_name,
            email=c.email,
            phone=c.phone,
            status=c.status,
            created_at=c.created_at
        )
        for c in companions
    ]


def approve_companion(db: Session, companion_id: str, current_user: dict) -> CompanionResponse:
    """Approve companion by setting status=true. Admin-only."""
    if current_user["role"] != "admin":
        raise ValueError("Only admins can approve companions")
    
    companion_uuid = UUID(companion_id)
    companion = db.query(Companion).filter(Companion.id == companion_uuid).first()
    
    if not companion:
        raise ValueError("Companion not found")
    
    companion.status = True
    db.commit()
    db.refresh(companion)
    
    return CompanionResponse(
        id=companion.id,
        full_name=companion.full_name,
        email=companion.email,
        phone=companion.phone,
        status=companion.status,
        created_at=companion.created_at
    )


def deactivate_companion(db: Session, companion_id: str, current_user: dict) -> CompanionResponse:
    """Deactivate companion by setting status=false. Admin-only."""
    if current_user["role"] != "admin":
        raise ValueError("Only admins can deactivate companions")
    
    companion_uuid = UUID(companion_id)
    companion = db.query(Companion).filter(Companion.id == companion_uuid).first()
    
    if not companion:
        raise ValueError("Companion not found")
    
    companion.status = False
    db.commit()
    db.refresh(companion)
    
    return CompanionResponse(
        id=companion.id,
        full_name=companion.full_name,
        email=companion.email,
        phone=companion.phone,
        status=companion.status,
        created_at=companion.created_at
    )


def get_my_companion_profile(db: Session, current_user: dict) -> CompanionResponse:
    """Get own companion profile. Companion-only."""
    if current_user["role"] != "companion":
        raise ValueError("Only companions can view companion profile")
    
    companion_uuid = UUID(current_user["user_id"])
    companion = db.query(Companion).filter(Companion.id == companion_uuid).first()
    
    if not companion:
        raise ValueError("Companion not found")
    
    return CompanionResponse(
        id=companion.id,
        full_name=companion.full_name,
        email=companion.email,
        phone=companion.phone,
        status=companion.status,
        created_at=companion.created_at
    )


def update_my_availability(db: Session, current_user: dict, data: CompanionAvailabilityUpdate):
    role = current_user.get("role")
    user_id = UUID(current_user.get("user_id"))
    
    if role != "companion":
        raise ValueError("Only companions can update their availability")
    
    companion = db.query(Companion).filter(Companion.id == user_id).first()
    
    if not companion:
        raise ValueError("Companion not found")
    
    companion.availability_status = data.availability_status
    db.commit()
    db.refresh(companion)
    
    return companion


def get_companions_availability(db: Session, current_user: dict):
    role = current_user.get("role")
    
    if role != "admin":
        raise ValueError("Only Admin users can view companions availability")
    
    companions = db.query(Companion).all()
    
    return companions
