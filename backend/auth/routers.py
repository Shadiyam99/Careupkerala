from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import session
from auth import schemas as auth_schemas
from auth import services as auth_services
from middleware.db import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def register_user(user_data: auth_schemas.RegisterSchema,db: session = Depends(get_db)
):
    try:
        user = auth_services.register_user_service(
            user_data=user_data,
            db=db
        )                    