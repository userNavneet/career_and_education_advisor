from fastapi import APIRouter, Header
from pydantic import BaseModel
from datetime import datetime
import pandas as pd
import os

router = APIRouter()

# Load questions CSV
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "assessment", "student_career_assessment_questions.csv")
df = pd.read_csv(CSV_PATH)


class AssessmentRequest(BaseModel):
    responses: list[int]  # List of 20 scores (1-5 Likert scale)


@router.get("/questions")
def get_questions():
    """Return all assessment questions for the frontend."""
    questions = []
    for _, row in df.iterrows():
        questions.append({
            "id": int(row["question_id"]),
            "question": row["question"],
            "category": row["category"],
        })
    return {"questions": questions, "total": len(questions)}


@router.post("/submit")
def submit_assessment(req: AssessmentRequest, authorization: str = Header(None)):
    """Process assessment responses and return career recommendations."""
    from app.database import get_careers, update_user
    from app.routers.auth import tokens_db

    if len(req.responses) != len(df):
        return {"error": f"Expected {len(df)} responses, got {len(req.responses)}"}

    for score in req.responses:
        if score < 1 or score > 5:
            return {"error": "Each score must be between 1 and 5"}

    # Calculate category scores
    temp_df = df.copy()
    temp_df["score"] = req.responses

    category_scores = temp_df.groupby("category")["score"].sum()
    category_scores = category_scores.sort_values(ascending=False)

    top_categories = list(category_scores.head(3).index)

    # Get full career objects from database for top categories
    all_careers = get_careers()
    recommended_careers = [c for c in all_careers if c["field"] in top_categories]

    result = {
        "scores": category_scores.to_dict(),
        "topCategories": top_categories,
        "recommendedCareers": recommended_careers,
    }

    # Save results to user profile if authenticated
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
        email = tokens_db.get(token)
        if email:
            update_user(email, {
                "assessmentStatus": {
                    "completed": True,
                    "completedAt": datetime.now().isoformat(),
                    "results": {
                        "topCategories": top_categories,
                        "scores": category_scores.to_dict(),
                    },
                },
            })

    return result
