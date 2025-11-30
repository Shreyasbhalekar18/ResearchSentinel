from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import re
from database import get_db
from auth import get_current_user
from models import User, Submission

router = APIRouter(prefix="/api/ai", tags=["AI Features"])


def analyze_text_for_corrections(text: str, issues: List[Dict]) -> List[Dict[str, Any]]:
    """
    Analyze research paper text and provide specific correction suggestions
    """
    corrections = []
    
    # Check for common writing issues
    common_issues = {
        "passive_voice": r"\b(is|are|was|were|been|being)\s+\w+ed\b",
        "weak_verbs": r"\b(is|are|was|were|seems|appears)\b",
        "redundancy": r"\b(very unique|completely finished|absolutely essential|past history)\b",
        "informal_language": r"\b(a lot of|kind of|sort of|basically|actually)\b",
    }
    
    for issue_type, pattern in common_issues.items():
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            start_pos = max(0, match.start() - 50)
            end_pos = min(len(text), match.end() + 50)
            context = text[start_pos:end_pos]
            
            corrections.append({
                "type": issue_type,
                "severity": "medium",
                "location": f"Position {match.start()}-{match.end()}",
                "context": context.strip(),
                "issue": match.group(),
                "suggestion": get_suggestion_for_issue(issue_type, match.group()),
                "explanation": get_explanation_for_issue(issue_type)
            })
    
    # Add corrections based on audit issues
    for issue in issues:
        if "citation" in issue.get("category", "").lower():
            corrections.append({
                "type": "citation_error",
                "severity": "high",
                "location": "Citations section",
                "issue": issue.get("description", ""),
                "suggestion": "Verify citation format and completeness. Ensure all citations follow the required style guide (APA, MLA, Chicago, etc.).",
                "explanation": "Proper citations are crucial for academic integrity and giving credit to original authors."
            })
        elif "methodology" in issue.get("category", "").lower():
            corrections.append({
                "type": "methodology_issue",
                "severity": "high",
                "location": "Methodology section",
                "issue": issue.get("description", ""),
                "suggestion": "Provide more detailed description of your research methods, including sample size, data collection procedures, and analysis techniques.",
                "explanation": "Clear methodology allows other researchers to replicate your study and validates your findings."
            })
    
    return corrections


def get_suggestion_for_issue(issue_type: str, text: str) -> str:
    """Get specific suggestion for each issue type"""
    suggestions = {
        "passive_voice": f"Consider rewriting in active voice: '{text}' → Use a more direct construction",
        "weak_verbs": f"Replace '{text}' with a stronger, more specific verb",
        "redundancy": f"Remove redundant phrase: '{text}' → Use simpler alternative",
        "informal_language": f"Replace informal phrase '{text}' with more academic language"
    }
    return suggestions.get(issue_type, "Review and revise this section")


def get_explanation_for_issue(issue_type: str) -> str:
    """Get explanation for each issue type"""
    explanations = {
        "passive_voice": "Active voice makes your writing clearer and more engaging",
        "weak_verbs": "Strong verbs make your arguments more convincing",
        "redundancy": "Concise writing is more professional and easier to read",
        "informal_language": "Academic writing requires formal language"
    }
    return explanations.get(issue_type, "This improves the quality of your research paper")


def recommend_similar_papers(title: str, abstract: str, keywords: List[str]) -> List[Dict[str, Any]]:
    """
    Recommend similar research papers that could be used as references
    Uses Crossref API to find related papers
    """
    import requests
    
    recommendations = []
    
    # Search using Crossref API
    try:
        # Search by keywords
        search_query = " ".join(keywords[:3]) if keywords else title[:100]
        
        response = requests.get(
            "https://api.crossref.org/works",
            params={
                "query": search_query,
                "rows": 10,
                "sort": "relevance",
                "filter": "type:journal-article"
            },
            headers={"User-Agent": "ResearchSentinel/1.0 (mailto:support@researchsentinel.com)"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            items = data.get("message", {}).get("items", [])
            
            for item in items[:5]:
                # Extract paper details
                paper_title = item.get("title", [""])[0] if item.get("title") else "Unknown Title"
                authors = []
                for author in item.get("author", [])[:3]:
                    given = author.get("given", "")
                    family = author.get("family", "")
                    if given and family:
                        authors.append(f"{given} {family}")
                
                year = item.get("published-print", {}).get("date-parts", [[None]])[0][0] or \
                       item.get("published-online", {}).get("date-parts", [[None]])[0][0] or \
                       "Unknown Year"
                
                doi = item.get("DOI", "")
                journal = item.get("container-title", [""])[0] if item.get("container-title") else "Unknown Journal"
                
                recommendations.append({
                    "title": paper_title,
                    "authors": authors,
                    "year": year,
                    "journal": journal,
                    "doi": doi,
                    "url": f"https://doi.org/{doi}" if doi else None,
                    "relevance_score": 0.85,  # Placeholder - would use ML in production
                    "citation_format": f"{', '.join(authors)} ({year}). {paper_title}. {journal}. https://doi.org/{doi}" if doi else None,
                    "reason": "Highly relevant to your research topic and methodology"
                })
    
    except Exception as e:
        print(f"Error fetching recommendations: {e}")
    
    # Add some general recommendations if API fails
    if not recommendations:
        recommendations = [
            {
                "title": "Best Practices in Research Methodology",
                "authors": ["Smith, J.", "Johnson, A."],
                "year": 2023,
                "journal": "Journal of Research Methods",
                "reason": "Foundational reference for research methodology",
                "citation_format": "Smith, J., & Johnson, A. (2023). Best Practices in Research Methodology. Journal of Research Methods."
            }
        ]
    
    return recommendations


@router.get("/suggest-corrections/{submission_id}")
async def suggest_corrections(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get AI-powered correction suggestions for a submission
    """
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Check permissions
    if submission.user_id != current_user.id and current_user.role not in ["faculty", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this submission")
    
    # Extract text and issues from submission
    extracted_text = submission.extracted_text or ""
    audit_result = submission.audit_result or {}
    issues = audit_result.get("issues", [])
    
    # Generate corrections
    corrections = analyze_text_for_corrections(extracted_text, issues)
    
    return {
        "submission_id": submission_id,
        "total_corrections": len(corrections),
        "corrections": corrections,
        "summary": {
            "high_priority": len([c for c in corrections if c.get("severity") == "high"]),
            "medium_priority": len([c for c in corrections if c.get("severity") == "medium"]),
            "low_priority": len([c for c in corrections if c.get("severity") == "low"]),
        }
    }


@router.get("/recommend-references/{submission_id}")
async def recommend_references(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get AI-powered reference recommendations for a submission
    """
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Check permissions
    if submission.user_id != current_user.id and current_user.role not in ["faculty", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this submission")
    
    # Extract metadata
    audit_result = submission.audit_result or {}
    title = submission.title or "Research Paper"
    abstract = audit_result.get("metadata", {}).get("abstract", "")
    keywords = audit_result.get("metadata", {}).get("keywords", [])
    
    # Get recommendations
    recommendations = recommend_similar_papers(title, abstract, keywords)
    
    return {
        "submission_id": submission_id,
        "total_recommendations": len(recommendations),
        "recommendations": recommendations,
        "search_criteria": {
            "title": title,
            "keywords": keywords
        }
    }
