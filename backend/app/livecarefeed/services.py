from sqlalchemy.orm import Session

from .models import Livecarefeed
from .schemas import LivecarefeedCreate, LivecarefeedRead


def create_livecarefeed_service(db: Session, feed_data: LivecarefeedCreate) -> Livecarefeed:
    feed = Livecarefeed(
        booking_id=feed_data.booking_id,
        message=feed_data.message,
        photo_url=feed_data.photo_url
    )
    db.add(feed)
    db.commit()
    db.refresh(feed)
    return feed


def get_all_livecarefeeds_service(db: Session):
    return db.query(Livecarefeed).all()
