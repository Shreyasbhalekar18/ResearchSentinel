from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float, Enum
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    FACULTY = "faculty"
    ADMIN = "admin"

class SubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default=UserRole.STUDENT) # Stored as string for simplicity with SQLite
    department = Column(String, nullable=True)
    institution = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    submissions = relationship("Submission", back_populates="owner")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    domain = Column(String)
    degree_level = Column(String)
    file_path = Column(String) # Path to PDF/DOCX
    dataset_path = Column(String, nullable=True) # Path to CSV
    github_url = Column(String, nullable=True)
    
    status = Column(String, default=SubmissionStatus.PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="submissions")
    report = relationship("AuditReport", back_populates="submission", uselist=False)

class AuditReport(Base):
    __tablename__ = "audit_reports"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    
    integrity_score = Column(Float)
    citation_score = Column(Float)
    methodology_score = Column(Float)
    reproducibility_score = Column(Float)
    novelty_score = Column(Float)
    ai_probability_score = Column(Float)
    
    json_content = Column(Text) # Stores the full detailed JSON report
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    submission = relationship("Submission", back_populates="report")
