from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: str = "student"
    department: Optional[str] = None
    institution: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[User] = None

class TokenData(BaseModel):
    email: Optional[str] = None

class SubmissionBase(BaseModel):
    title: str
    domain: str
    degree_level: str
    github_url: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    pass

class AuditReportBase(BaseModel):
    integrity_score: float
    citation_score: float
    methodology_score: float
    reproducibility_score: float
    novelty_score: float
    ai_probability_score: float
    json_content: str
    created_at: datetime

class Submission(SubmissionBase):
    id: int
    status: str
    created_at: datetime
    owner_id: int
    report: Optional[AuditReportBase] = None

    class Config:
        orm_mode = True
