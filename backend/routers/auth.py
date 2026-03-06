from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status

from core.security import create_access_token
from database.db import get_db
from schemas.models import AuthToken, LoginRequest, UserCreate, UserOut
from utils.password import hash_password, verify_password
from utils.serializers import serialize_doc

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register(payload: UserCreate):
    db = get_db()
    existing = db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    now = datetime.utcnow()
    user_doc = payload.dict(exclude={"password"})
    user_doc.update(
        {
            "password_hash": hash_password(payload.password),
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }
    )
    result = db.users.insert_one(user_doc)
    user = db.users.find_one({"_id": ObjectId(result.inserted_id)})
    return serialize_doc(user)


@router.post("/login", response_model=AuthToken)
def login(payload: LoginRequest):
    db = get_db()
    user = db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(str(user["_id"]), extra={"role": user.get("role", "student")})
    user_out = serialize_doc(user)
    return {"access_token": token, "token_type": "bearer", "user": user_out}
