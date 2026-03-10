from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, assessment, colleges, chatbot, careers, admin
from app.database import seed_db
import subprocess
import time
import requests

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

OLLAMA_BASE = "http://localhost:11434"
OLLAMA_MODEL = "qwen3.5:4b"


def _ensure_ollama():
    """Start Ollama server if not running, then ensure the model is pulled."""
    # 1. Check if Ollama is already running
    ollama_ready = False
    try:
        if requests.get(OLLAMA_BASE, timeout=3).status_code == 200:
            print("[Startup] Ollama server is running")
            ollama_ready = True
    except Exception:
        pass

    # 2. If not running, start it
    if not ollama_ready:
        print("[Startup] Starting Ollama server...")
        try:
            subprocess.Popen(
                ["ollama", "serve"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
            )
        except FileNotFoundError:
            print("[Startup] Ollama not installed — chatbot will use FAQ/rule-based only")
            return

        # Wait for it to be ready (up to 15 seconds)
        for _ in range(15):
            time.sleep(1)
            try:
                if requests.get(OLLAMA_BASE, timeout=2).status_code == 200:
                    print("[Startup] Ollama server started")
                    ollama_ready = True
                    break
            except Exception:
                pass

        if not ollama_ready:
            print("[Startup] Ollama server did not start in time")
            return

    # 3. Ensure model is available
    try:
        r = requests.get(f"{OLLAMA_BASE}/api/tags", timeout=5)
        models = [m["name"] for m in r.json().get("models", [])]
        if OLLAMA_MODEL in models:
            print(f"[Startup] Model '{OLLAMA_MODEL}' is ready")
        else:
            print(f"[Startup] Pulling model '{OLLAMA_MODEL}'... (this may take a few minutes on first run)")
            subprocess.run(["ollama", "pull", OLLAMA_MODEL], timeout=600)
            print(f"[Startup] Model '{OLLAMA_MODEL}' pulled successfully")
    except Exception as e:
        print(f"[Startup] Could not verify model: {e}")


@app.on_event("startup")
def startup():
    seed_db()
    _ensure_ollama()


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
