import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import APP_NAME, CORS_ORIGINS
from database.db import get_db
from routers import admin, assessments, auth, careers, chatbot, colleges, messages, resources, scholarships, sessions, timeline, users

app = FastAPI(title=APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def ensure_indexes():
    if os.getenv("SKIP_DB_INIT", "").lower() in {"1", "true", "yes"}:
        return
    try:
        db = get_db()
        db.users.create_index("email", unique=True)
        db.assessments.create_index([("user_id", 1), ("created_at", -1)])
        db.timeline.create_index([("user_id", 1), ("created_at", -1)])
        db.messages.create_index([("sender_id", 1), ("receiver_id", 1), ("created_at", -1)])
    except Exception as exc:
        # Don't crash the app on startup if the DB is temporarily unreachable.
        print(f"[startup] Database init skipped: {exc}")


@app.get("/")
def home():
    return {"message": "Backend is running successfully"}


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(careers.router)
app.include_router(colleges.router)
app.include_router(scholarships.router)
app.include_router(resources.router)
app.include_router(assessments.router)
app.include_router(timeline.router)
app.include_router(sessions.router)
app.include_router(messages.router)
app.include_router(chatbot.router)
app.include_router(admin.router)
