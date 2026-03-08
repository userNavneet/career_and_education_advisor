"""SQLAlchemy ORM models for EduCareer."""

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, JSON,
    create_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker
from pathlib import Path
import datetime

DB_DIR = Path(__file__).parent.parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DATABASE_URL = f"sqlite:///{DB_DIR / 'educareer.db'}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)           # e.g. "student-a1b2c3d4"
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="student")  # "student" | "admin"

    # Profile (stored as JSON for flexibility, matching existing frontend shape)
    profile = Column(JSON, default=dict)             # {firstName, lastName, phone, avatar, address}
    academic_info = Column(JSON, default=dict)       # {grade, school, gpa, satScore, actScore}
    interests = Column(JSON, default=list)           # ["Technology", "Music", ...]
    assessment_status = Column(JSON, default=lambda: {"completed": False, "results": None})
    profile_completion = Column(Integer, default=20)

    def to_dict(self, include_password=False):
        """Convert to the dict shape the frontend expects."""
        data = {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "profile": self.profile or {},
            "academicInfo": self.academic_info or {},
            "interests": self.interests or [],
            "assessmentStatus": self.assessment_status or {"completed": False, "results": None},
            "profileCompletion": self.profile_completion or 20,
        }
        if include_password:
            data["password_hash"] = self.password_hash
        return data


class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    field = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    average_salary = Column(String)
    education = Column(String)
    skills = Column(JSON, default=list)              # ["Python", "SQL", ...]
    growth_rate = Column(String)
    demand_level = Column(String)
    image = Column(String, default="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400")

    def to_dict(self):
        """Convert to the dict shape the frontend expects."""
        return {
            "id": self.id,
            "title": self.title,
            "field": self.field,
            "description": self.description,
            "averageSalary": self.average_salary,
            "education": self.education,
            "skills": self.skills or [],
            "growthRate": self.growth_rate,
            "demandLevel": self.demand_level,
            "image": self.image,
        }


def init_db():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)
