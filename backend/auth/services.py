from datetime import datetime,timedelta
from sqlalchemy.orm import Session
from auth.models import Admin, NRIUser, Companion,RefreshToken
from middleware.security import(
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)
from middleware.auth_utils import get_user_by_email
from middleware.config import REFRESH_TOKEN_EXPIRE_DAYS

def autheticate_user(db:Session,email:str,pasword:str):
    user,role = get_user_by_email(db,email)

    if not user or not verify_password(password,user.password_hash):
        return None
    
    if role == "companion" and not user.status:
        raise ValueError("companion account is pending wait for admin approval")
    
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id,RefreshToken.role == role).delete()
    db.commit()
    
    access_token = create_access_token()
    expires_at = datetime.utcnow() +timedelta(
        days = REFRESH_TOKEN_EXPIRE_DAYS
    )

    Refresh_Token = RefreshToken(
        user_id = user.id,
        role = role,
        token = refresh_token_value,
        expires_at = expires_at,

    )
    db.add(Refresh_Token)
    db.commit()

    return (
        "access_token":access_token,
        "refresh_token":refresh_token_value,
        "role":role,
        "user_id":user.id,
    )


def login(db: Session,email: str, password: str, role: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password,user.password_hash):
        return None

def sighnup(db: Session, email: str, password: str, role: str):
    pasword_hash = hash_password(password)
    if role == "companion":
        new_user = Companion(email=email, pasword_hash=pasword_hash)
    else:
        new_user = Admin(email=email,pasword_hash=pasword_hash)
        db.add(new_user)
        db.commit()
        return new_user
    
def logout(db: Session,user_id: int, role: str):
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id, RefreshToken.role ==role).delete()
    db.commit()
