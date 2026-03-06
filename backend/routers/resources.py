from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import require_role
from database.db import get_db
from schemas.models import ResourceCreate, ResourceOut, ResourceUpdate, Role
from utils.serializers import serialize_doc, serialize_docs

router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("", response_model=list[ResourceOut])
def list_resources(q: str | None = None, category: str | None = None):
    db = get_db()
    query = {}
    if q:
        query["title"] = {"$regex": q, "$options": "i"}
    if category:
        query["category"] = category
    resources = db.resources.find(query)
    return serialize_docs(resources)


@router.get("/{resource_id}", response_model=ResourceOut)
def get_resource(resource_id: str):
    db = get_db()
    resource = db.resources.find_one({"_id": ObjectId(resource_id)})
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return serialize_doc(resource)


@router.post("", response_model=ResourceOut)
def create_resource(payload: ResourceCreate, user=Depends(require_role(Role.admin))):
    db = get_db()
    now = datetime.utcnow()
    doc = payload.dict()
    doc.update({"created_at": now, "updated_at": now})
    result = db.resources.insert_one(doc)
    resource = db.resources.find_one({"_id": ObjectId(result.inserted_id)})
    return serialize_doc(resource)


@router.patch("/{resource_id}", response_model=ResourceOut)
def update_resource(resource_id: str, payload: ResourceUpdate, user=Depends(require_role(Role.admin))):
    db = get_db()
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    update_data["updated_at"] = datetime.utcnow()
    result = db.resources.update_one({"_id": ObjectId(resource_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    resource = db.resources.find_one({"_id": ObjectId(resource_id)})
    return serialize_doc(resource)


@router.delete("/{resource_id}")
def delete_resource(resource_id: str, user=Depends(require_role(Role.admin))):
    db = get_db()
    result = db.resources.delete_one({"_id": ObjectId(resource_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return {"status": "deleted"}
