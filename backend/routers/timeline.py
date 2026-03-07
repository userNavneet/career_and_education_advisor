from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import get_current_user
from database.db import get_db
from schemas.models import TimelineImportantOut, TimelineItemCreate, TimelineItemOut, TimelineItemUpdate
from utils.serializers import serialize_doc, serialize_docs

router = APIRouter(prefix="/timeline", tags=["timeline"])


def _parse_date(date_text: str):
    value = str(date_text or "").strip()
    if not value:
        return None

    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%b %d, %Y", "%d %b %Y"):
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


@router.get("", response_model=list[TimelineItemOut])
def list_timeline_items(user=Depends(get_current_user)):
    db = get_db()
    items = db.timeline.find({"user_id": str(user["_id"])})
    return serialize_docs(items)


@router.get("/important", response_model=list[TimelineImportantOut])
def list_important_dates(user=Depends(get_current_user)):
    db = get_db()
    events = []

    # Source 1: Entrance exam / admission entries maintained manually in `important_dates`.
    for doc in db.important_dates.find({}):
        dt = _parse_date(doc.get("date"))
        if not dt:
            continue
        events.append(
            {
                "id": str(doc.get("_id")),
                "title": str(doc.get("title") or "").strip(),
                "date": dt.date().isoformat(),
                "category": str(doc.get("category") or "exam").strip().lower(),
                "source": "important_dates",
                "notes": str(doc.get("notes") or "").strip() or None,
            }
        )

    # Source 2: Scholarship deadlines
    for doc in db.scholarships.find({}, {"name": 1, "deadline": 1, "provider": 1, "category": 1}):
        dt = _parse_date(doc.get("deadline"))
        if not dt:
            continue
        title = str(doc.get("name") or "").strip()
        provider = str(doc.get("provider") or "").strip()
        events.append(
            {
                "id": str(doc.get("_id")),
                "title": title,
                "date": dt.date().isoformat(),
                "category": "scholarship",
                "source": "scholarships",
                "notes": provider or None,
            }
        )

    # Source 3: College admission deadlines (if available in data)
    for doc in db.colleges.find({}, {"name": 1, "admission_deadline": 1, "application_deadline": 1}):
        date_text = doc.get("admission_deadline") or doc.get("application_deadline")
        dt = _parse_date(date_text)
        if not dt:
            continue
        events.append(
            {
                "id": str(doc.get("_id")),
                "title": f"{str(doc.get('name') or '').strip()} admission deadline",
                "date": dt.date().isoformat(),
                "category": "admission",
                "source": "colleges",
                "notes": None,
            }
        )

    events.sort(key=lambda x: x["date"])
    return events


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
