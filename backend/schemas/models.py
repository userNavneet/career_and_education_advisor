from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class Role(str, Enum):
    student = "student"
    counselor = "counselor"
    admin = "admin"


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Role = Role.student
    phone: Optional[str] = None
    school: Optional[str] = None
    grade_level: Optional[str] = None
    test_scores: Optional[dict] = None
    interests: Optional[List[str]] = None
    bio: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    school: Optional[str] = None
    grade_level: Optional[str] = None
    test_scores: Optional[dict] = None
    interests: Optional[List[str]] = None
    bio: Optional[str] = None
    role: Optional[Role] = None
    is_active: Optional[bool] = None


class UserOut(UserBase):
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


class AuthToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CareerBase(BaseModel):
    title: str
    field: str
    description: Optional[str] = None
    average_salary: Optional[str] = None
    education_required: Optional[str] = None
    skills: Optional[List[str]] = None
    growth_rate: Optional[str] = None
    demand_level: Optional[str] = None
    image_url: Optional[str] = None


class CareerCreate(CareerBase):
    pass


class CareerUpdate(BaseModel):
    title: Optional[str] = None
    field: Optional[str] = None
    description: Optional[str] = None
    average_salary: Optional[str] = None
    education_required: Optional[str] = None
    skills: Optional[List[str]] = None
    growth_rate: Optional[str] = None
    demand_level: Optional[str] = None
    image_url: Optional[str] = None


class CareerOut(CareerBase):
    id: str
    created_at: datetime
    updated_at: datetime


class CollegeBase(BaseModel):
    name: str
    location: str
    college_type: Optional[str] = None
    ranking: Optional[int] = None
    tuition_fees: Optional[str] = None
    programs: Optional[List[str]] = None
    acceptance_rate: Optional[str] = None
    average_sat: Optional[str] = None
    campus_size: Optional[str] = None
    image_url: Optional[str] = None
    website: Optional[str] = None


class CollegeCreate(CollegeBase):
    pass


class CollegeUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    college_type: Optional[str] = None
    ranking: Optional[int] = None
    tuition_fees: Optional[str] = None
    programs: Optional[List[str]] = None
    acceptance_rate: Optional[str] = None
    average_sat: Optional[str] = None
    campus_size: Optional[str] = None
    image_url: Optional[str] = None
    website: Optional[str] = None


class CollegeOut(CollegeBase):
    id: str
    created_at: datetime
    updated_at: datetime


class ScholarshipBase(BaseModel):
    name: str
    provider: Optional[str] = None
    amount: Optional[str] = None
    deadline: Optional[str] = None
    eligibility: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    application_link: Optional[str] = None


class ScholarshipCreate(ScholarshipBase):
    pass


class ScholarshipUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    amount: Optional[str] = None
    deadline: Optional[str] = None
    eligibility: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    application_link: Optional[str] = None


class ScholarshipOut(ScholarshipBase):
    id: str
    created_at: datetime
    updated_at: datetime


class ResourceBase(BaseModel):
    title: str
    category: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None


class ResourceOut(ResourceBase):
    id: str
    created_at: datetime
    updated_at: datetime


class AssessmentAnswer(BaseModel):
    question_id: str
    option_id: str


class AssessmentSubmit(BaseModel):
    answers: List[AssessmentAnswer]


class AssessmentResult(BaseModel):
    top_fields: List[str]
    scores: dict
    recommendations: dict


class AssessmentOption(BaseModel):
    id: str
    text: str


class AssessmentQuestion(BaseModel):
    id: str
    category: str
    question: str
    options: List[AssessmentOption]


class AssessmentOut(AssessmentResult):
    id: str
    user_id: str
    created_at: datetime


class TimelineItemBase(BaseModel):
    title: str
    due_date: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class TimelineItemCreate(TimelineItemBase):
    pass


class TimelineItemUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class TimelineItemOut(TimelineItemBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime


class SessionBase(BaseModel):
    student_id: str
    counselor_id: str
    scheduled_at: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    scheduled_at: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class SessionOut(SessionBase):
    id: str
    created_at: datetime
    updated_at: datetime


class MessageBase(BaseModel):
    sender_id: str
    receiver_id: str
    content: str


class MessageCreate(MessageBase):
    pass


class MessageOut(MessageBase):
    id: str
    created_at: datetime


class FaqQuery(BaseModel):
    query: str
    top_k: int = 3
    min_score: float = 0.6


class FaqMatch(BaseModel):
    question: str
    answer: str
    score: float


class FaqResponse(BaseModel):
    matches: List[FaqMatch]
