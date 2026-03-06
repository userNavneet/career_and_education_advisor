from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import require_role
from database.db import get_db
from schemas.models import Role, ScholarshipCreate, ScholarshipOut, ScholarshipUpdate
from utils.serializers import serialize_doc, serialize_docs

router = APIRouter(prefix="/scholarships", tags=["scholarships"])


@router.get("", response_model=list[ScholarshipOut])
def list_scholarships(q: str | None = None, category: str | None = None):
    db = get_db()
    query = {}
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    if category:
        query["category"] = category
    scholarships = db.scholarships.find(query)
    return serialize_docs(scholarships)


@router.get("/{scholarship_id}", response_model=ScholarshipOut)
def get_scholarship(scholarship_id: str):
    db = get_db()
    scholarship = db.scholarships.find_one({"_id": ObjectId(scholarship_id)})
    if not scholarship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scholarship not found")
    return serialize_doc(scholarship)


@router.post("", response_model=ScholarshipOut)
def create_scholarship(payload: ScholarshipCreate, user=Depends(require_role(Role.admin))):
    db = get_db()
    now = datetime.utcnow()
    doc = payload.dict()
    doc.update({"created_at": now, "updated_at": now})
    result = db.scholarships.insert_one(doc)
    scholarship = db.scholarships.find_one({"_id": ObjectId(result.inserted_id)})
    return serialize_doc(scholarship)


@router.patch("/{scholarship_id}", response_model=ScholarshipOut)
def update_scholarship(scholarship_id: str, payload: ScholarshipUpdate, user=Depends(require_role(Role.admin))):
    db = get_db()
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    update_data["updated_at"] = datetime.utcnow()
    result = db.scholarships.update_one({"_id": ObjectId(scholarship_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scholarship not found")
    scholarship = db.scholarships.find_one({"_id": ObjectId(scholarship_id)})
    return serialize_doc(scholarship)


@router.delete("/{scholarship_id}")
def delete_scholarship(scholarship_id: str, user=Depends(require_role(Role.admin))):
    db = get_db()
    result = db.scholarships.delete_one({"_id": ObjectId(scholarship_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scholarship not found")
    return {"status": "deleted"}
