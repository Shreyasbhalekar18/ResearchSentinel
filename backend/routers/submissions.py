from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, database, auth, audit_engine
from email_service import send_audit_complete_email
import shutil
import os
import uuid

router = APIRouter(
    prefix="/api/submissions",
    tags=["submissions"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def process_audit_task(submission_id: int, file_path: str, dataset_path: str, db: Session):
    # Re-create session for background task
    # Note: In production, pass db session carefully or use a new one
    try:
        results = audit_engine.analyze_paper(file_path, dataset_path)
        
        report = models.AuditReport(
            submission_id=submission_id,
            integrity_score=results["integrity_score"],
            citation_score=results["citation_score"],
            methodology_score=results["methodology_score"],
            reproducibility_score=results["reproducibility_score"],
            novelty_score=results["novelty_score"],
            ai_probability_score=results["ai_probability_score"],
            json_content=results["json_content"]
        )
        
        db.add(report)
        
        submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
        submission.status = models.SubmissionStatus.COMPLETED
        db.commit()
        db.refresh(submission)
        
        # Send audit complete email
        user = db.query(models.User).filter(models.User.id == submission.owner_id).first()
        if user:
            report_url = f"http://localhost:3000/report/{submission_id}"
            send_audit_complete_email(
                user_email=user.email,
                user_name=user.full_name or "Researcher",
                paper_title=submission.title,
                integrity_score=int(results["integrity_score"]),
                report_url=report_url
            )
        
    except Exception as e:
        print(f"Audit failed: {e}")
        submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
        submission.status = models.SubmissionStatus.FAILED
        db.commit()

@router.post("/", response_model=schemas.Submission)
async def create_submission(
    title: str = Form(...),
    domain: str = Form(...),
    degree_level: str = Form(...),
    github_url: Optional[str] = Form(None),
    file: UploadFile = File(...),
    dataset: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    # Save file
    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    dataset_path = None
    if dataset:
        ds_ext = dataset.filename.split(".")[-1]
        ds_name = f"{uuid.uuid4()}_data.{ds_ext}"
        dataset_path = os.path.join(UPLOAD_DIR, ds_name)
        with open(dataset_path, "wb") as buffer:
            shutil.copyfileobj(dataset.file, buffer)

    new_submission = models.Submission(
        title=title,
        domain=domain,
        degree_level=degree_level,
        github_url=github_url,
        file_path=file_path,
        dataset_path=dataset_path,
        owner_id=current_user.id,
        status=models.SubmissionStatus.PROCESSING # Set to processing immediately for this demo
    )
    
    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)

    # Trigger background audit
    background_tasks.add_task(process_audit_task, new_submission.id, file_path, dataset_path, db)

    return new_submission

@router.get("/", response_model=List[schemas.Submission])
def read_submissions(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == models.UserRole.STUDENT:
        submissions = db.query(models.Submission).filter(models.Submission.owner_id == current_user.id).offset(skip).limit(limit).all()
    else:
        # Faculty/Admin sees all (simplified for now)
        submissions = db.query(models.Submission).offset(skip).limit(limit).all()
    return submissions

@router.get("/{submission_id}", response_model=schemas.Submission)
def read_submission(submission_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission
