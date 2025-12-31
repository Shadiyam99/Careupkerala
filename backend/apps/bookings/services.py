from sqlalchemy.orm import Session
from uuid import UUID
from apps.bookings.models import Booking
from apps.bookings.schemas import BookingCreate, BookingResponse, BookingStatusUpdate, BookingAssignCompanion
from auth.models import NRIUser, Companion
from apps.hospitals.models import Hospital
from apps.services.models import Service, ServicePricing


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
        created_at=booking.created_at
    )


def get_my_bookings(db: Session, current_user: dict) -> list[BookingResponse]:
    """Get own bookings. NRI only."""
    if current_user["role"] != "nri":
        raise ValueError("Only NRI users can view their bookings")
    
    nri_uuid = UUID(current_user["user_id"])
    bookings = db.query(Booking).filter(Booking.nri_id == nri_uuid).all()
    
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
            created_at=b.created_at
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
            created_at=b.created_at
        )
        for b in bookings
    ]


def update_booking_status(db: Session, booking_id: str, data: BookingStatusUpdate, current_user: dict) -> BookingResponse:
    """Update booking status. Admin only."""
    if current_user["role"] != "admin":
        raise ValueError("Only admins can update booking status")
    
    allowed_statuses = ["pending", "assigned", "completed", "cancelled"]
    if data.status not in allowed_statuses:
        raise ValueError(f"Invalid status. Allowed: {', '.join(allowed_statuses)}")
    
    booking_uuid = UUID(booking_id)
    booking = db.query(Booking).filter(Booking.id == booking_uuid).first()
    
    if not booking:
        raise ValueError("Booking not found")
    
    booking.status = data.status
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
        created_at=booking.created_at
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
        created_at=booking.created_at
    )
