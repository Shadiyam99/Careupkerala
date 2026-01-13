from sqlalchemy.orm import Session
from uuid import UUID
from apps.bookings.models import Booking
from apps.bookings.schemas import BookingCreate, BookingResponse, BookingStatusUpdate, BookingAssignCompanion
from auth.models import NRIUser, Companion
from apps.hospitals.models import Hospital
from apps.services.models import Service, ServicePricing
from apps.admin_logs.services import log_admin_action


def create_booking(db: Session, data: BookingCreate, current_user: dict) -> BookingResponse:
    """Create new booking. NRI only."""
    if current_user["role"] != "nri":
        raise ValueError("Only NRI users can create bookings")
    
    # Validate foreign keys exist
    hospital = db.query(Hospital).filter(Hospital.id == data.hospital_id).first()
    if not hospital:
        raise ValueError("Hospital not found")
    
    service = db.query(Service).filter(Service.id == data.service_id).first()
    if not service:
        raise ValueError("Service not found")
    
    pricing = db.query(ServicePricing).filter(ServicePricing.id == data.pricing_id).first()
    if not pricing:
        raise ValueError("Pricing not found")
    
    # Validate pricing belongs to service
    if pricing.service_id != data.service_id:
        raise ValueError("Pricing does not belong to the specified service")
    
    nri_uuid = UUID(current_user["user_id"])
    
    booking = Booking(
        nri_id=nri_uuid,
        hospital_id=data.hospital_id,
        service_id=data.service_id,
        pricing_id=data.pricing_id,
        status="pending",
        scheduled_date=data.scheduled_date
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    
    return BookingResponse(
        id=booking.id,
        nri_id=booking.nri_id,
        hospital_id=booking.hospital_id,
        service_id=booking.service_id,
        pricing_id=booking.pricing_id,
        companion_id=booking.companion_id,
        status=booking.status,
        scheduled_date=booking.scheduled_date,
        created_at=booking.created_at,
        hospital_name=booking.hospital.name if booking.hospital else None,
        service_name=booking.service.name if booking.service else None,
        nri_name=booking.nri.full_name if booking.nri else None,
        companion_name=booking.companion.full_name if booking.companion else None,
        price=float(booking.pricing.price) if booking.pricing else None,
        currency=booking.pricing.currency if booking.pricing else None
    )


def get_my_bookings(db: Session, current_user: dict) -> list[BookingResponse]:
    """Get own bookings. NRI (created) or Companion (assigned)."""
    if current_user["role"] not in ["nri", "companion"]:
        raise ValueError("User role not authorized to view bookings")
    
    user_uuid = UUID(current_user["user_id"])
    
    if current_user["role"] == "nri":
        bookings = db.query(Booking).filter(Booking.nri_id == user_uuid).all()
    else: # companion
        bookings = db.query(Booking).filter(Booking.companion_id == user_uuid).all()
    
    return [
        BookingResponse(
            id=b.id,
            nri_id=b.nri_id,
            hospital_id=b.hospital_id,
            service_id=b.service_id,
            pricing_id=b.pricing_id,
            companion_id=b.companion_id,
            status=b.status,
            scheduled_date=b.scheduled_date,
            created_at=b.created_at,
            hospital_name=b.hospital.name if b.hospital else None,
            service_name=b.service.name if b.service else None,
            nri_name=b.nri.full_name if b.nri else None,
            companion_name=b.companion.full_name if b.companion else None,
            price=float(b.pricing.price) if b.pricing else None,
            currency=b.pricing.currency if b.pricing else None
        )
        for b in bookings
    ]


def get_all_bookings(db: Session, current_user: dict) -> list[BookingResponse]:
    """Get all bookings. Admin only."""
    if current_user["role"] != "admin":
        raise ValueError("Only admins can view all bookings")
    
    bookings = db.query(Booking).all()
    
    return [
        BookingResponse(
            id=b.id,
            nri_id=b.nri_id,
            hospital_id=b.hospital_id,
            service_id=b.service_id,
            pricing_id=b.pricing_id,
            companion_id=b.companion_id,
            status=b.status,
            scheduled_date=b.scheduled_date,
            created_at=b.created_at,
            hospital_name=b.hospital.name if b.hospital else None,
            service_name=b.service.name if b.service else None,
            nri_name=b.nri.full_name if b.nri else None,
            companion_name=b.companion.full_name if b.companion else None,
            price=float(b.pricing.price) if b.pricing else None,
            currency=b.pricing.currency if b.pricing else None
        )
        for b in bookings
    ]


def update_booking_status(db: Session, booking_id: str, data: BookingStatusUpdate, current_user: dict) -> BookingResponse:
    """Update booking status. Admin or Assigned Companion."""
    if current_user["role"] not in ["admin", "companion"]:
        raise ValueError("Unauthorized to update booking status")
    
    booking_uuid = UUID(booking_id)
    booking = db.query(Booking).filter(Booking.id == booking_uuid).first()
    
    if not booking:
        raise ValueError("Booking not found")

    # Companion validation
    if current_user["role"] == "companion":
        if booking.companion_id != UUID(current_user["user_id"]):
            raise ValueError("You are not assigned to this booking")
        if data.status not in ["completed"]:
             raise ValueError("Companions can only mark bookings as completed")

    allowed_statuses = ["pending", "assigned", "completed", "cancelled"]
    if data.status not in allowed_statuses:
        raise ValueError(f"Invalid status. Allowed: {', '.join(allowed_statuses)}")
    
    booking.status = data.status
    db.commit()
    db.refresh(booking)
    
    # Log action (if admin) or just internal log
    if current_user["role"] == "admin":
        log_admin_action(
            db=db,
            current_user=current_user,
            action_type="update_status",
            entity_type="booking",
            entity_id=booking.id,
            description=f"Updated booking status to: {booking.status}"
        )
    
    return BookingResponse(
        id=booking.id,
        nri_id=booking.nri_id,
        hospital_id=booking.hospital_id,
        service_id=booking.service_id,
        pricing_id=booking.pricing_id,
        companion_id=booking.companion_id,
        status=booking.status,
        scheduled_date=booking.scheduled_date,
        created_at=booking.created_at,
        hospital_name=booking.hospital.name if booking.hospital else None,
        service_name=booking.service.name if booking.service else None,
        nri_name=booking.nri.full_name if booking.nri else None,
        companion_name=booking.companion.full_name if booking.companion else None,
        price=float(booking.pricing.price) if booking.pricing else None,
        currency=booking.pricing.currency if booking.pricing else None
    )


def assign_companion(db: Session, booking_id: str, data: BookingAssignCompanion, current_user: dict) -> BookingResponse:
    """Assign companion to booking. Admin only."""
    if current_user["role"] != "admin":
        raise ValueError("Only admins can assign companions")
    
    booking_uuid = UUID(booking_id)
    booking = db.query(Booking).filter(Booking.id == booking_uuid).first()
    
    if not booking:
        raise ValueError("Booking not found")
    
    companion = db.query(Companion).filter(Companion.id == data.companion_id).first()
    if not companion:
        raise ValueError("Companion not found")
    
    if not companion.status:
        raise ValueError("Companion is not approved")
    
    booking.companion_id = data.companion_id
    db.commit()
    db.refresh(booking)
    
    return BookingResponse(
        id=booking.id,
        nri_id=booking.nri_id,
        hospital_id=booking.hospital_id,
        service_id=booking.service_id,
        pricing_id=booking.pricing_id,
        companion_id=booking.companion_id,
        status=booking.status,
        scheduled_date=booking.scheduled_date,
        created_at=booking.created_at,
        hospital_name=booking.hospital.name if booking.hospital else None,
        service_name=booking.service.name if booking.service else None,
        nri_name=booking.nri.full_name if booking.nri else None,
        companion_name=booking.companion.full_name if booking.companion else None,
        price=float(booking.pricing.price) if booking.pricing else None,
        currency=booking.pricing.currency if booking.pricing else None
    )
