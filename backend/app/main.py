from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, assessment, colleges, chatbot, careers, admin
from app.database import seed_db

app = FastAPI(
    title="EduCareer API",
    description="Career & Education Advisor Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    seed_db()


@app.get("/")
def root():
    return {"message": "EduCareer API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(assessment.router, prefix="/api/assessment", tags=["Assessment"])
app.include_router(colleges.router, prefix="/api/colleges", tags=["Colleges"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(careers.router, prefix="/api/careers", tags=["Careers"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
