from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from middleware.db import get_db
from middleware.auth_utils import get_current_user
from apps.companions.schemas import CompanionResponse, CompanionListResponse
from apps.companions.services import (
    get_pending_companions,
    approve_companion,
    deactivate_companion,
    get_my_companion_profile
)

router = APIRouter(prefix="/companions", tags=["companions"])


@router.get("/pending", response_model=CompanionListResponse)
def list_pending_companions(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        companions = get_pending_companions(db, current_user)
        return CompanionListResponse(companions=companions)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.patch("/{companion_id}/approve", response_model=CompanionResponse)
def approve_companion_route(
    companion_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return approve_companion(db, companion_id, current_user)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.patch("/{companion_id}/deactivate", response_model=CompanionResponse)
def deactivate_companion_route(
    companion_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return deactivate_companion(db, companion_id, current_user)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.get("/me", response_model=CompanionResponse)
def get_my_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_my_companion_profile(db, current_user)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
