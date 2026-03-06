from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import get_current_user
from database.db import get_db
from schemas.models import TimelineItemCreate, TimelineItemOut, TimelineItemUpdate
from utils.serializers import serialize_doc, serialize_docs

router = APIRouter(prefix="/timeline", tags=["timeline"])


@router.get("", response_model=list[TimelineItemOut])
def list_timeline_items(user=Depends(get_current_user)):
    db = get_db()
    items = db.timeline.find({"user_id": str(user["_id"])})
    return serialize_docs(items)


@router.post("", response_model=TimelineItemOut)
def create_timeline_item(payload: TimelineItemCreate, user=Depends(get_current_user)):
    db = get_db()
    now = datetime.utcnow()
    doc = payload.dict()
    doc.update({"user_id": str(user["_id"]), "created_at": now, "updated_at": now})
    result = db.timeline.insert_one(doc)
    item = db.timeline.find_one({"_id": ObjectId(result.inserted_id)})
    return serialize_doc(item)


@router.patch("/{item_id}", response_model=TimelineItemOut)
def update_timeline_item(item_id: str, payload: TimelineItemUpdate, user=Depends(get_current_user)):
    db = get_db()
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    update_data["updated_at"] = datetime.utcnow()
    result = db.timeline.update_one({"_id": ObjectId(item_id), "user_id": str(user["_id"])}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    item = db.timeline.find_one({"_id": ObjectId(item_id)})
    return serialize_doc(item)


@router.delete("/{item_id}")
def delete_timeline_item(item_id: str, user=Depends(get_current_user)):
    db = get_db()
    result = db.timeline.delete_one({"_id": ObjectId(item_id), "user_id": str(user["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return {"status": "deleted"}
