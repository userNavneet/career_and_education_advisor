from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import get_current_user, require_role
from database.db import get_db
from schemas.models import Role, UserOut, UserUpdate
from utils.serializers import serialize_doc, serialize_docs

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(user=Depends(get_current_user)):
    return serialize_doc(user)


@router.get("", response_model=list[UserOut])
def list_users(user=Depends(require_role(Role.admin))):
    db = get_db()
    users = db.users.find()
    return serialize_docs(users)


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str, current_user=Depends(require_role(Role.admin))):
    db = get_db()
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return serialize_doc(user)


@router.patch("/{user_id}", response_model=UserOut)
def update_user(user_id: str, payload: UserUpdate, current_user=Depends(get_current_user)):
    if str(current_user["_id"]) != user_id and current_user.get("role") != Role.admin.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not permitted")

    db = get_db()
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    update_data["updated_at"] = datetime.utcnow()
    result = db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user = db.users.find_one({"_id": ObjectId(user_id)})
    return serialize_doc(user)


@router.delete("/{user_id}")
def delete_user(user_id: str, current_user=Depends(require_role(Role.admin))):
    db = get_db()
    result = db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"status": "deleted"}
