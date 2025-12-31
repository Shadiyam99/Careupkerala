from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.notifications import services as notification_services
from app.notifications import schemas as notification_schemas
from middleware.db import get_db
from typing import List

router = APIRouter(prefix = "/notification",tags = ["Notificatiion"])

@router.post("/create",response_model = notification_schemas.NotificationRead)
def create_notification(
    notification_data: notification_schemas.NotificationCreate,
    db:Session = Depends(get_db)
): 
    return notification_services.create_notification_service(db,notification_data)

@router.get("/list",response_model = List[notification_schemas.NotificationRead])
def get_all_notitfication(db:Session = Depends(get_db)):
    return notification_services.get_all_notitfication_service(db)