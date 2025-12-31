from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from middleware.db import get_db
from middleware.security import verify_access_token
from auth.models import Admin, NRIUser, Companion

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_user_by_email(db: Session, email: str) -> tuple[object, str] | None:
    """Search for user across all user tables, return (user, role) or None"""
    user = db.query(Admin).filter(Admin.email == email).first()
    if user:
        return user, "admin"
    
    user = db.query(NRIUser).filter(NRIUser.email == email).first()
    if user:
        return user, "nri"
    
    user = db.query(Companion).filter(Companion.email == email).first()
    if user:
        return user, "companion"
    
    return None


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> dict:
    """Extract and return current user identity from token"""
    try:
        payload = verify_access_token(token)
        return {"user_id": payload["user_id"], "role": payload["role"]}
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
