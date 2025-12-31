from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import datetime


class CompanionResponse(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: str
    status: bool
    created_at: datetime


class CompanionApprovalRequest(BaseModel):
    status: bool


class CompanionListResponse(BaseModel):
    companions: List[CompanionResponse]
