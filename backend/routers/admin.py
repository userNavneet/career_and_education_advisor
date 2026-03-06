from fastapi import APIRouter, Depends

from core.deps import require_role
from database.db import get_db
from schemas.models import Role

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/analytics")
def analytics(user=Depends(require_role(Role.admin))):
    db = get_db()
    return {
        "users": db.users.count_documents({}),
        "students": db.users.count_documents({"role": Role.student.value}),
        "counselors": db.users.count_documents({"role": Role.counselor.value}),
        "admins": db.users.count_documents({"role": Role.admin.value}),
        "careers": db.careers.count_documents({}),
        "colleges": db.colleges.count_documents({}),
        "scholarships": db.scholarships.count_documents({}),
        "resources": db.resources.count_documents({}),
        "assessments": db.assessments.count_documents({}),
    }
