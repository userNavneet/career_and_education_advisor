from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.database import get_careers, get_career, save_career, delete_career, get_next_career_id

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


class CareerRequest(BaseModel):
    title: str
    field: str
    description: str
    averageSalary: str
    education: str
    skills: list[str]
    growthRate: str
    demandLevel: str
    image: str = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400"


@router.get("/")
def list_careers(field: str = None):
    careers = get_careers()
    if field:
        careers = [c for c in careers if c["field"] == field]
    return {"careers": careers, "total": len(careers)}


@router.get("/fields")
def list_fields():
    careers = get_careers()
    fields = sorted(set(c["field"] for c in careers))
    return {"fields": fields}


@router.get("/{career_id}")
def get_career_detail(career_id: int):
    career = get_career(career_id)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")
    return career


@router.post("/")
def create_career(req: CareerRequest, authorization: str = Header(None)):
    _require_admin(authorization)
    career = req.model_dump()
    career["id"] = get_next_career_id()
    save_career(career)
    return career


@router.put("/{career_id}")
def update_career(career_id: int, req: CareerRequest, authorization: str = Header(None)):
    _require_admin(authorization)
    existing = get_career(career_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Career not found")
    career = req.model_dump()
    career["id"] = career_id
    save_career(career)
    return career


@router.delete("/{career_id}")
def remove_career(career_id: int, authorization: str = Header(None)):
    _require_admin(authorization)
    if not delete_career(career_id):
        raise HTTPException(status_code=404, detail="Career not found")
    return {"message": "Career deleted"}
