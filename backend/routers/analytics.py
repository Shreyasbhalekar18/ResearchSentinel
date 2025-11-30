from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, database, auth

router = APIRouter(
    prefix="/api/analytics",
    tags=["analytics"]
)

@router.get("/dashboard")
def get_analytics(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Simple aggregated stats
    total_submissions = db.query(models.Submission).count()
    avg_score = 85.5 # Mocked for simplicity or calculate from DB
    
    return {
        "total_audits": total_submissions,
        "average_integrity": avg_score,
        "top_issues": [
            {"name": "Invalid Citations", "count": 120},
            {"name": "Small Sample Size", "count": 85},
            {"name": "Missing Control Group", "count": 40}
        ],
        "department_stats": [
            {"dept": "Computer Science", "audits": 50, "avg_score": 88},
            {"dept": "Biology", "audits": 30, "avg_score": 82}
        ]
    }
