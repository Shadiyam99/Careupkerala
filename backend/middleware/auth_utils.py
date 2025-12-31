from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from uuid import UUID

from middleware.db import get_db
from middleware.security import verify_access_token
from auth.models import Admin, NRIUser, Companion

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_user_by_email(db:Session,email:str):
    admin = db.query(Admin).filter(Admin.email == email).first()
    if admin:
        return admin,"admin"
    nri = db.query(NRIUser).filter(NRIUser.email == email).first()
    if nri:
        return nri,"nri"
    companion = db.query(Companion).filter(Companion.email == email).first()
    if companion:
        return companion,"companion"
    
    return None,None

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    try:
        return {
            "user_id": UUID(payload["user_id"]),
            "role": payload["role"],
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )