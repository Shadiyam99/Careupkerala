from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.livecarefeed import services as livecarefeed_services
from app.livecarefeed import schemas as livecarefeed_schemas
from middleware.db import get_db
from typing import List

router = APIRouter(prefix="/livecarefeed", tags=["Livecarefeed"])


@router.post("/create", response_model=livecarefeed_schemas.LivecarefeedRead)
def create_livecarefeed(
    feed_data: livecarefeed_schemas.LivecarefeedCreate,
    db: Session = Depends(get_db),
):
    return livecarefeed_services.create_livecarefeed_service(db, feed_data)


@router.get("/list", response_model=List[livecarefeed_schemas.LivecarefeedRead])
def get_all_livecarefeeds(db: Session = Depends(get_db)):
    return livecarefeed_services.get_all_livecarefeeds_service(db)
