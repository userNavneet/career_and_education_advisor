from fastapi import APIRouter, HTTPException, Header
from app.database import get_all_users, get_careers, delete_user as db_delete_user

router = APIRouter()


def _require_admin(authorization: str):
    from app.routers.auth import tokens_db
    from app.database import get_user
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    email = tokens_db.get(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user(email)
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


@router.get("/stats")
def get_stats(authorization: str = Header(None)):
    _require_admin(authorization)
    users = get_all_users()
    careers = get_careers()
    students = [u for u in users.values() if u.get("role") == "student"]
    assessments_done = sum(1 for s in students if s.get("assessmentStatus", {}).get("completed"))
    return {
        "totalUsers": len(users),
        "totalStudents": len(students),
        "totalCareers": len(careers),
        "assessmentsCompleted": assessments_done,
        "careerFields": len(set(c["field"] for c in careers)),
    }


@router.get("/users")
def list_users(authorization: str = Header(None)):
    _require_admin(authorization)
    users = get_all_users()
    return {
        "users": [
            {k: v for k, v in u.items() if k != "password_hash"}
            for u in users.values()
        ]
    }


@router.delete("/users/{email}")
def delete_user(email: str, authorization: str = Header(None)):
    _require_admin(authorization)
    if email == "admin@example.com":
        raise HTTPException(status_code=400, detail="Cannot delete default admin")
    if not db_delete_user(email):
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
