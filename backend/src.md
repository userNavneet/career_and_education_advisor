# EduCareer Backend

FastAPI-based backend powering the EduCareer platform with RESTful APIs, SQLite database, Ollama LLM integration, and FAISS-powered semantic search.

## Tech Stack

- **FastAPI** - ASGI web framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM for SQLite database
- **bcrypt** - Password hashing
- **Ollama** (`qwen2.5:0.5b`) - Local LLM for AI chatbot
- **sentence-transformers** (`all-MiniLM-L6-v2`) - Text embeddings
- **FAISS** - Vector similarity search
- **pandas** - Data processing

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   │                          - CORS config (localhost:5173-5175, 3000)
│   │                          - 6 API routers under /api/ prefix
│   │                          - Ollama auto-startup on server launch
│   │                          - Database seeding on startup
│   ├── models.py            # SQLAlchemy ORM models
│   │                          - User: email, password_hash, role, profile (JSON),
│   │                                  academic_info (JSON), interests (JSON),
│   │                                  assessment_status (JSON), profile_completion
│   │                          - Career: title, field, description, salary, education,
│   │                                   skills (JSON), growth_rate, demand_level, image
│   ├── database.py          # Data access layer (~270 lines)
│   │                          - User CRUD: get_user, save_user, update_user, delete_user
│   │                          - Career CRUD: get_careers, save_career, delete_career
│   │                          - Auto profile completion calculation (0-100%)
│   │                          - seed_db(): 36 careers + admin/demo student
│   └── routers/
│       ├── auth.py          # POST /login, POST /signup, GET /me, PUT /profile
│       ├── assessment.py    # GET /questions (20 Likert), POST /submit
│       ├── careers.py       # Full CRUD, admin-protected writes
│       ├── colleges.py      # GET /filters, POST /search (AI + filter + pagination)
│       ├── chatbot.py       # POST /ask (FAQ → Ollama → rule-based fallback)
│       └── admin.py         # GET /stats, GET /users, DELETE /users/{email}
├── AI-hybrid-chatbot/
│   ├── faq.xlsx             # FAQ dataset for FAISS similarity matching
│   ├── chatbotapp.py        # Standalone chatbot app (development)
│   ├── chatbot_api.py       # Standalone chatbot API (development)
│   └── requirements.txt
├── assessment/
│   ├── student_career_assessment_questions.csv  # 20 questions, 12 categories
│   ├── assessment_engine.py                     # Standalone assessment logic
│   ├── assessment_app.py                        # Standalone assessment app
│   ├── assessment_api.py                        # Standalone assessment API
│   ├── EduGuide_ASSESSMENT.ipynb                # Assessment development notebook
│   └── requirements.txt
├── college-directory/
│   ├── kk_14.csv                    # 70,000+ college dataset
│   ├── college_embeddings.npy       # Precomputed embeddings (all-MiniLM-L6-v2)
│   ├── generate_embeddings.py       # Script to regenerate embeddings
│   ├── eduapp.py                    # Standalone college search app
│   ├── EDUSET_DATA_CLEANED.ipynb    # Data cleaning notebook
│   ├── EDUSET_MODEL_TRAINING.ipynb  # Model training notebook
│   └── requirements.txt
├── data/
│   └── educareer.db         # SQLite database (auto-generated on first run)
├── requirements.txt          # Backend Python dependencies
└── src.md                    # This file
```

## Running

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The server will:
1. Create/seed the SQLite database (`data/educareer.db`) with 36 careers + default users
2. Attempt to start Ollama and pull `qwen2.5:0.5b` (falls back gracefully if unavailable)
3. Load FAISS indexes for FAQ and college embeddings
4. Serve the API at `http://localhost:8000`

## API Overview

| Router | Prefix | Key Endpoints |
|--------|--------|---------------|
| auth | `/api/auth` | Login, signup, profile update |
| assessment | `/api/assessment` | 20-question quiz, score + recommend |
| careers | `/api/careers` | Career CRUD (admin writes) |
| colleges | `/api/colleges` | Semantic search + filter, paginated |
| chatbot | `/api/chatbot` | Hybrid AI responses |
| admin | `/api/admin` | Platform stats, user management |

## Database

- **Engine**: SQLite via SQLAlchemy
- **Location**: `backend/data/educareer.db`
- **Tables**: `users`, `careers`
- **Seed Data**: 36 careers across 12 fields, admin account, demo student
- **Profile Completion**: Auto-calculated (10 base + fields + assessment = max 100)