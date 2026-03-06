from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import get_current_user
from database.db import get_db
from schemas.models import AssessmentOut, AssessmentResult, AssessmentSubmit, AssessmentQuestion
from services.assessment_bank import COURSE_RECOMMENDATIONS, FIELDS, get_questions
from services.career_recommender import recommend_careers_ml
from utils.serializers import serialize_doc

router = APIRouter(prefix="/assessments", tags=["assessments"])


@router.get("/questions", response_model=list[AssessmentQuestion])
def list_questions():
    questions = get_questions()
    # Persist questions in DB (one-time seed)
    db = get_db()
    if db.assessment_questions.count_documents({}) == 0:
        db.assessment_questions.insert_many(questions)
    return [
        {
            "id": q["id"],
            "category": q["category"],
            "question": q["question"],
            "options": [{"id": opt["id"], "text": opt["text"]} for opt in q["options"]],
        }
        for q in questions
    ]


@router.post("/submit", response_model=AssessmentResult)
def submit_assessment(payload: AssessmentSubmit, user=Depends(get_current_user)):
    questions = {q["id"]: q for q in get_questions()}
    field_scores = {k: 0 for k in FIELDS.keys()}

    for answer in payload.answers:
        q = questions.get(answer.question_id)
        if not q:
            continue
        opt = next((o for o in q["options"] if o["id"] == answer.option_id), None)
        if not opt:
            continue
        for field, score in opt["weight"].items():
            field_scores[field] = field_scores.get(field, 0) + score

    top_keys = [k for k, _ in sorted(field_scores.items(), key=lambda x: x[1], reverse=True)][:3]
    top_labels = [FIELDS[k] for k in top_keys]

    db = get_db()
    recommended = recommend_careers_ml(db, field_scores, top_k=8)

    courses = []
    for key in top_keys:
        courses.extend(COURSE_RECOMMENDATIONS.get(key, []))

    # Store student responses
    db = get_db()
    db.assessment_submissions.insert_one(
        {
            "user_id": str(user["_id"]),
            "answers": [a.dict() for a in payload.answers],
            "scores": field_scores,
            "top_fields": top_labels,
            "recommendations": {
                "careers": recommended,
                "courses": courses[:8],
            },
            "created_at": datetime.utcnow(),
        }
    )

    return {
        "top_fields": top_labels,
        "scores": field_scores,
        "recommendations": {
            "careers": recommended,
            "courses": courses[:8],
        },
    }


@router.post("", response_model=AssessmentOut)
def create_assessment(payload: AssessmentSubmit, user=Depends(get_current_user)):
    db = get_db()
    questions = {q["id"]: q for q in get_questions()}
    field_scores = {k: 0 for k in FIELDS.keys()}

    for answer in payload.answers:
        q = questions.get(answer.question_id)
        if not q:
            continue
        opt = next((o for o in q["options"] if o["id"] == answer.option_id), None)
        if not opt:
            continue
        for field, score in opt["weight"].items():
            field_scores[field] = field_scores.get(field, 0) + score

    top_keys = [k for k, _ in sorted(field_scores.items(), key=lambda x: x[1], reverse=True)][:3]
    top_labels = [FIELDS[k] for k in top_keys]
    result = {
        "user_id": str(user["_id"]),
        "top_fields": top_labels,
        "scores": field_scores,
        "answers": [a.dict() for a in payload.answers],
        "created_at": datetime.utcnow(),
    }
    inserted = db.assessments.insert_one(result)
    assessment = db.assessments.find_one({"_id": ObjectId(inserted.inserted_id)})
    return serialize_doc(assessment)


@router.get("/latest", response_model=AssessmentOut)
def latest_assessment(user=Depends(get_current_user)):
    db = get_db()
    assessment = db.assessments.find_one(
        {"user_id": str(user["_id"])}, sort=[("created_at", -1)]
    )
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No assessment found")
    return serialize_doc(assessment)
