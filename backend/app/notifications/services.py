from fastapi import FastAPI
from sqlalchemy.orm import Session
from uuid import UUID

from app.notifications import models as notification_model
from app.notifications import schemas as notification_schemas

def create_notification_service(db:Session,notification_data:notification_schemas.NotificationCreate):
    notification = notification_model.Notification( 
       id= notification_data.id,
       booking_id = notification_data.booking_id,
       user_id = notification_data.user_id,
       title= notification_data.title,
       
        
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification

def get_all_notitfication_service(db:Session):
    return db.query(notification_model.Notification).all()