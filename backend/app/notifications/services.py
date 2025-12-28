from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime

from .models import Notification
from .schemas import NotificationCreate, NotificationRead


def create_notification_service(db: Session, notification_data: NotificationCreate) -> Notification:
    notification = Notification(
        booking_id=notification_data.booking_id,
        user_id=notification_data.user_id,
        title=notification_data.title,
        message=notification_data.message
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_all_notifications_service(db: Session):
    return db.query(Notification).all()
