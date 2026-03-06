from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from core.deps import require_role
from database.db import get_db
from schemas.models import CareerCreate, CareerOut, CareerUpdate, Role
from utils.serializers import serialize_doc, serialize_docs

router = APIRouter(prefix="/careers", tags=["careers"])


@router.get("", response_model=list[CareerOut])
def list_careers(q: str | None = None, field: str | None = None, skill: str | None = None):
    db = get_db()
    query = {}
    filters = []
    if q:
        regex = {"$regex": q, "$options": "i"}
        filters.append({"$or": [{"title": regex}, {"description": regex}, {"skills": regex}]})
    if field:
        filters.append({"field": field})
    if skill:
        filters.append({"skills": {"$regex": skill, "$options": "i"}})
    if filters:
        query = {"$and": filters}
    careers = db.careers.find(query).sort("title", 1)
    return serialize_docs(careers)


@router.get("/{career_id}", response_model=CareerOut)
def get_career(career_id: str):
    db = get_db()
    career = db.careers.find_one({"_id": ObjectId(career_id)})
    if not career:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Career not found")
    return serialize_doc(career)


@router.post("", response_model=CareerOut)
def create_career(payload: CareerCreate, user=Depends(require_role(Role.admin))):
    db = get_db()
    now = datetime.utcnow()
    doc = payload.dict()
    doc.update({"created_at": now, "updated_at": now})
    result = db.careers.insert_one(doc)
    career = db.careers.find_one({"_id": ObjectId(result.inserted_id)})
    return serialize_doc(career)


@router.patch("/{career_id}", response_model=CareerOut)
def update_career(career_id: str, payload: CareerUpdate, user=Depends(require_role(Role.admin))):
    db = get_db()
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    update_data["updated_at"] = datetime.utcnow()
    result = db.careers.update_one({"_id": ObjectId(career_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Career not found")
    career = db.careers.find_one({"_id": ObjectId(career_id)})
    return serialize_doc(career)


@router.delete("/{career_id}")
def delete_career(career_id: str, user=Depends(require_role(Role.admin))):
    db = get_db()
    result = db.careers.delete_one({"_id": ObjectId(career_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Career not found")
    return {"status": "deleted"}
