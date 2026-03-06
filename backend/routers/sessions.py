from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import get_current_user, require_role
from database.db import get_db
from schemas.models import Role, SessionCreate, SessionOut, SessionUpdate
from utils.serializers import serialize_doc, serialize_docs

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("", response_model=list[SessionOut])
def list_sessions(user=Depends(get_current_user)):
    db = get_db()
    role = user.get("role")
    if role == Role.counselor.value:
        query = {"counselor_id": str(user["_id"])}
    elif role == Role.student.value:
        query = {"student_id": str(user["_id"])}
    else:
        query = {}
    sessions = db.sessions.find(query)
    return serialize_docs(sessions)


@router.post("", response_model=SessionOut)
def create_session(payload: SessionCreate, user=Depends(get_current_user)):
    db = get_db()
    now = datetime.utcnow()
    doc = payload.dict()
    doc.update({"created_at": now, "updated_at": now})
    result = db.sessions.insert_one(doc)
    session = db.sessions.find_one({"_id": ObjectId(result.inserted_id)})
    return serialize_doc(session)


@router.patch("/{session_id}", response_model=SessionOut)
def update_session(session_id: str, payload: SessionUpdate, user=Depends(get_current_user)):
    db = get_db()
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    update_data["updated_at"] = datetime.utcnow()
    result = db.sessions.update_one({"_id": ObjectId(session_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    session = db.sessions.find_one({"_id": ObjectId(session_id)})
    return serialize_doc(session)


@router.delete("/{session_id}")
def delete_session(session_id: str, user=Depends(require_role(Role.admin))):
    db = get_db()
    result = db.sessions.delete_one({"_id": ObjectId(session_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return {"status": "deleted"}
