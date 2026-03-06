from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import require_role
from database.db import get_db
from schemas.models import CollegeCreate, CollegeOut, CollegeUpdate, Role
from utils.serializers import serialize_doc, serialize_docs

router = APIRouter(prefix="/colleges", tags=["colleges"])


@router.get("", response_model=list[CollegeOut])
def list_colleges(q: str | None = None, location: str | None = None):
    db = get_db()
    query = {}
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    colleges = db.colleges.find(query)
    return serialize_docs(colleges)


@router.get("/{college_id}", response_model=CollegeOut)
def get_college(college_id: str):
    db = get_db()
    college = db.colleges.find_one({"_id": ObjectId(college_id)})
    if not college:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="College not found")
    return serialize_doc(college)


@router.post("", response_model=CollegeOut)
def create_college(payload: CollegeCreate, user=Depends(require_role(Role.admin))):
    db = get_db()
    now = datetime.utcnow()
    doc = payload.dict()
    doc.update({"created_at": now, "updated_at": now})
    result = db.colleges.insert_one(doc)
    college = db.colleges.find_one({"_id": ObjectId(result.inserted_id)})
    return serialize_doc(college)


@router.patch("/{college_id}", response_model=CollegeOut)
def update_college(college_id: str, payload: CollegeUpdate, user=Depends(require_role(Role.admin))):
    db = get_db()
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    update_data["updated_at"] = datetime.utcnow()
    result = db.colleges.update_one({"_id": ObjectId(college_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="College not found")
    college = db.colleges.find_one({"_id": ObjectId(college_id)})
    return serialize_doc(college)


@router.delete("/{college_id}")
def delete_college(college_id: str, user=Depends(require_role(Role.admin))):
    db = get_db()
    result = db.colleges.delete_one({"_id": ObjectId(college_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="College not found")
    return {"status": "deleted"}
