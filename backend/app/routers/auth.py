from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from app.database import get_user, save_user, get_all_users, update_user
import bcrypt
import secrets

router = APIRouter()

# Token store (in-memory, session-based)
tokens_db = {}


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def _strip_password(user: dict) -> dict:
    return {k: v for k, v in user.items() if k != "password_hash"}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    firstName: str
    lastName: str
    role: str = "student"  # Only student registration allowed


class LoginResponse(BaseModel):
    token: str
    user: dict


@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    user = get_user(req.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = secrets.token_urlsafe(32)
    tokens_db[token] = user["email"]

    return {"token": token, "user": _strip_password(user)}


@router.post("/signup", response_model=LoginResponse)
def signup(req: SignupRequest):
    if get_user(req.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    if req.role != "student":
        raise HTTPException(status_code=403, detail="Only student registration is allowed. Admin accounts are pre-configured.")

    user_id = f"{req.role}-{secrets.token_hex(4)}"

    new_user = {
        "id": user_id,
        "role": req.role,
        "email": req.email,
        "password_hash": hash_password(req.password),
        "profile": {
            "firstName": req.firstName,
            "lastName": req.lastName,
        },
        "assessmentStatus": {"completed": False, "results": None},
        "profileCompletion": 20,
    }

    save_user(req.email, new_user)

    token = secrets.token_urlsafe(32)
    tokens_db[token] = req.email

    return {"token": token, "user": _strip_password(new_user)}


@router.get("/me")
def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    email = tokens_db.get(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = get_user(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return _strip_password(user)


@router.put("/profile")
def update_profile(body: dict, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    email = tokens_db.get(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    updated = update_user(email, body)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return _strip_password(updated)
