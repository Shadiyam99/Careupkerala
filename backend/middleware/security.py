import hashlib
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError,jwt

from middleware.config import (
   SECRET_KEY,
   ALGORITHM ,
   ACCESS_TOKEN_EXPIRE_MINUTES,
   REFRESH_TOKEN_EXPIRE_DAYS 
   
)


def _pre_hash(password : str) -> bytes:
    return hashlib.sha256(password.encode("utf-8")).digest()

def hash_password(password : str) -> str:
    pre_hashed = _pre_hash(password)
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pre_hashed,salt).decode("utf-8")

def verify_password(password:str,hashed:str) ->bool:
    pre_hashed = _pre_hash(password)
    return bcrypt.checkpw(pre_hashed,hashed.encode("utf-8"))  

def create_access_token(data: dict) -> str:
    payload = {
        **data,
        "exp": datetime.utcnow()
        + timedelta(minutes =ACCESS_TOKEN_EXPIRE_MINUTES),
        "type":"access",
    }
    return jwt.encode(payload,SECRET_KEY,algorithm = ALGORITHM)

def create_refresh_token() -> str:
    payload = {
     "exp": datetime.utcnow()
      + timedelta(days = REFRESH_TOKEN_EXPIRE_DAYS),
      "type":"refresh",   
    }
    return jwt.encode(payload,SECRET_KEY,algorithm = ALGORITHM)

def verify_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms = [ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None

    
