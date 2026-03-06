from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends

from core.deps import get_current_user
from database.db import get_db
from schemas.models import MessageCreate, MessageOut
from utils.serializers import serialize_doc, serialize_docs

router = APIRouter(prefix="/messages", tags=["messages"])


@router.get("", response_model=list[MessageOut])
def list_messages(user=Depends(get_current_user)):
    db = get_db()
    query = {"$or": [{"sender_id": str(user["_id"])}, {"receiver_id": str(user["_id"]) }]}
    messages = db.messages.find(query).sort("created_at", -1)
    return serialize_docs(messages)


@router.post("", response_model=MessageOut)
def send_message(payload: MessageCreate, user=Depends(get_current_user)):
    db = get_db()
    doc = payload.dict()
    doc.update({"created_at": datetime.utcnow()})
    result = db.messages.insert_one(doc)
    message = db.messages.find_one({"_id": ObjectId(result.inserted_id)})
    return serialize_doc(message)
