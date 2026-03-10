# EduCareer - Architecture & Data Flow

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                              │
│                                                                      │
│  React 19 + Vite + Tailwind CSS + Framer Motion                     │
│                                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ AuthCtx  │  │ ProtectedRoute│  │ MainLayout│  │  api.js (Axios)│  │
│  │ (Context)│  │  (RBAC Guard) │  │ (Sidebar) │  │  (HTTP Client) │  │
│  └──────────┘  └──────────────┘  └──────────┘  └───────┬────────┘  │
│                                                          │           │
│  Student Pages (8)          Admin Pages (3)               │           │
│  ┌─────────┐ ┌──────────┐  ┌──────────┐ ┌──────────┐   │           │
│  │Dashboard│ │Assessment│  │Dashboard │ │ManageCar.│   │           │
│  │Career   │ │Colleges  │  │ManageUsr │ │          │   │           │
│  │Chatbot  │ │Profile   │  └──────────┘ └──────────┘   │           │
│  │Resources│ │Scholarsh.│                                │           │
│  └─────────┘ └──────────┘                                │           │
└──────────────────────────────────────────────────────────┼───────────┘
                                                           │
                                              HTTP (localhost:8000)
                                                           │
┌──────────────────────────────────────────────────────────┼───────────┐
│                       BACKEND (FastAPI)                   │           │
│                                                           ▼           │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    FastAPI Application (main.py)                 │ │
│  │  CORS · Startup Events · Ollama Auto-Launch · DB Seed           │ │
│  └───────────┬─────────┬──────────┬──────────┬──────────┬─────────┘ │
│              │         │          │          │          │            │
│  ┌───────────┴──┐ ┌────┴────┐ ┌──┴───────┐ ┌┴────────┐ ┌┴────────┐ │
│  │  auth.py     │ │assess.py│ │careers.py│ │college.py│ │chatbot.py│ │
│  │ Login/Signup │ │20 Q Quiz│ │CRUD Admin│ │AI Search │ │Hybrid AI │ │
│  │ Profile PUT  │ │Score+Rec│ │36 Careers│ │70K+ Data │ │FAQ+Ollama│ │
│  └──────┬───────┘ └────┬────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
│         │              │           │             │            │       │
│  ┌──────┴──────────────┴───────────┴─────────────┴────────────┴────┐ │
│  │              database.py (SQLAlchemy Data Access Layer)          │ │
│  │  get_user · save_user · update_user · delete_user               │ │
│  │  get_careers · save_career · delete_career                      │ │
│  │  _calc_profile_completion · seed_db                             │ │
│  └─────────────────────────┬───────────────────────────────────────┘ │
│                            │                                         │
│  ┌─────────────────────────┴─────────────────────────────────────┐   │
│  │                     models.py (ORM)                            │   │
│  │  User: email, password_hash, role, profile, academic_info,    │   │
│  │        interests, assessment_status, profile_completion        │   │
│  │  Career: title, field, description, salary, education,        │   │
│  │          skills, growth_rate, demand_level, image              │   │
│  └─────────────────────────┬─────────────────────────────────────┘   │
│                            │                                         │
│                    ┌───────┴───────┐                                  │
│                    │  SQLite DB    │                                  │
│                    │ educareer.db  │                                  │
│                    └───────────────┘                                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                    AI / ML Layer                              │    │
│  │                                                              │    │
│  │  sentence-transformers ──▶ FAISS Index ──▶ FAQ Matching      │    │
│  │  (all-MiniLM-L6-v2)      (IndexFlatL2)    College Search    │    │
│  │                                                              │    │
│  │  Ollama (localhost:11434) ──▶ qwen3.5:4b ──▶ LLM Chat    │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
User visits site
      │
      ▼
AuthContext checks localStorage
for authToken + user
      │
      ├── Token found ──▶ GET /api/auth/me ──▶ Valid? ──▶ Set user state
      │                                          │
      │                                     Invalid ──▶ Clear storage ──▶ Show Login
      │
      └── No token ──▶ Show Login/Signup page
                              │
                 ┌────────────┴────────────┐
                 │                          │
            POST /login               POST /signup
            (email, password)         (email, password,
                 │                     firstName, lastName)
                 ▼                          │
         Validate bcrypt hash               ▼
                 │                    Hash password (bcrypt)
                 │                    Create user in SQLite
                 ▼                          │
           Generate token                   ▼
           (secrets.token_urlsafe)    Generate token
                 │                          │
                 └──────────┬───────────────┘
                            │
                            ▼
                Store token in memory (tokens_db dict)
                Return {token, user} to frontend
                            │
                            ▼
                Frontend: Save to localStorage
                Set user in AuthContext
                            │
                            ▼
                Redirect by role:
                ├── student ──▶ /student/dashboard
                └── admin   ──▶ /admin/dashboard
```

### Token Lifecycle
- **Storage**: In-memory Python dict (`tokens_db`) keyed by token string
- **Frontend**: `localStorage.authToken` + Axios interceptor auto-attaches `Authorization: Bearer {token}`
- **Validation**: Each protected request extracts token from header, looks up in `tokens_db`
- **Expiry**: Tokens persist until server restart (in-memory)

## Career Assessment Flow

```
Student navigates to /student/assessment
                │
                ▼
      GET /api/assessment/questions
                │
                ▼
      Returns 20 questions from CSV
      (student_career_assessment_questions.csv)
      Each question has: id, text, category
                │
                ▼
      Student answers all 20 questions
      (Likert scale: 1-5 per question)
                │
                ▼
      POST /api/assessment/submit
      Body: { responses: [4, 3, 5, 2, ...] }  (20 integers)
                │
                ▼
      ┌─────────────────────────────────┐
      │    Assessment Scoring Engine     │
      │                                  │
      │  1. Validate 20 responses (1-5)  │
      │  2. Map each response to its     │
      │     question's category          │
      │  3. Sum scores per category      │
      │  4. Rank categories by total     │
      │  5. Select top 3 categories      │
      │  6. Find matching careers from   │
      │     36-career database           │
      └─────────┬───────────────────────┘
                │
                ▼
      If authenticated:
        update_user(email, {assessmentStatus: {
          completed: true,
          results: {scores, topCategories},
          completedAt: timestamp
        }})
        → _calc_profile_completion() auto runs (+20 points)
                │
                ▼
      Return: {
        scores: { "Technology": 45, "Engineering": 38, ... },
        topCategories: ["Technology", "Engineering", "Design"],
        recommendedCareers: [career objects]
      }
```

### 12 Career Categories
Technology & Software, Engineering, Finance & Banking, Healthcare & Medicine, Design & Creative, Education, Law & Policy, Media & Communication, Science & Research, Business & Management, Agriculture & Environment, Hospitality & Tourism

## College Search Flow

```
Student opens /student/colleges
           │
           ▼
  GET /api/colleges/filters
           │
           ▼
  Returns: { fields: [...11 disciplines], states: [...262 states] }
  (Parsed from kk_14.csv on startup)
           │
           ▼
  Student selects filters and/or types a query
           │
           ├── Filters change ──▶ Auto-triggers search
           │
           ▼
  POST /api/colleges/search
  Body: { query?, field?, state?, limit: 50, page: 1 }
           │
           ▼
  ┌────────┴───────────────────────────────────┐
  │                                             │
  │  Has query string?                          │
  │  ├── YES: Semantic Search                   │
  │  │   1. Encode query via all-MiniLM-L6-v2   │
  │  │   2. FAISS search (5× limit candidates)  │
  │  │   3. Apply field/state filters on results │
  │  │   4. Paginate                             │
  │  │                                           │
  │  └── NO: Filter Search                      │
  │      1. Filter DataFrame by field + state    │
  │      2. Count total matches                  │
  │      3. Slice for requested page             │
  └────────┬───────────────────────────────────┘
           │
           ▼
  Return: {
    colleges: [{name, address, state, website, field, placement, accreditation}],
    total: 3045,
    page: 1,
    per_page: 50
  }
           │
           ▼
  Frontend renders college cards + pagination
  "Showing 1-50 of 3,045 colleges"
  [← Previous] [Page 1 of 61] [Next →]
```

### College Data Pipeline
```
kk_14.csv (70,000+ rows)
     │
     ├──▶ generate_embeddings.py ──▶ college_embeddings.npy (384-dim vectors)
     │                                        │
     │                                        ▼
     └──▶ colleges.py startup ──▶ FAISS IndexFlatL2 (loaded from .npy)
                │                             │
                └──▶ pandas DataFrame ────────┘
                     (in-memory for filter queries)
```

## Hybrid Chatbot Flow

```
Student sends message in /student/chatbot
              │
              ▼
    POST /api/chatbot/ask
    Body: {
      message: "What careers match my interests?",
      user_context: {
        firstName, interests, topCategories,
        hasAssessment, school, scores
      }
    }
              │
              ▼
┌─────────────────────────────────────────────────────┐
│               TIER 1: FAQ Search (FAISS)             │
│                                                      │
│  1. Encode user message via all-MiniLM-L6-v2         │
│  2. Search FAISS index built from faq.xlsx           │
│  3. If L2 distance < 0.5 (similarity threshold):     │
│     → Return { answer, source: "faq",                │
│                confidence, matchedQuestion }           │
│  4. Else: fall through to Tier 2                     │
└───────────────────────┬─────────────────────────────┘
                        │ (no FAQ match)
                        ▼
┌─────────────────────────────────────────────────────┐
│               TIER 2: Ollama LLM                     │
│                                                      │
│  1. Build system prompt:                             │
│     - Career database summary (12 fields, 36 careers)│
│     - Platform features description                  │
│     - User profile (name, school, interests, scores) │
│  2. POST http://localhost:11434/api/chat             │
│     Model: qwen3.5:4b                              │
│     Options: temperature=0.7, num_predict=256        │
│     Timeout: 60s                                     │
│  3. Strip <think>...</think> blocks (deepseek compat)│
│  4. Return { answer, source: "ollama" }              │
│  5. If error/timeout: fall through to Tier 3         │
└───────────────────────┬─────────────────────────────┘
                        │ (Ollama unavailable)
                        ▼
┌─────────────────────────────────────────────────────┐
│               TIER 3: Rule-Based Fallback            │
│                                                      │
│  Pattern match keywords in user message:             │
│  - "career" / "job" → career guidance response       │
│  - "college" / "university" → college search tips    │
│  - "assessment" / "quiz" → assessment instructions   │
│  - "scholarship" → scholarship guidance              │
│  - Default → general helpful response                │
│                                                      │
│  Return { answer, source: "rule-based" }             │
└─────────────────────────────────────────────────────┘
              │
              ▼
    Frontend displays response with source badge:
    [FAQ] / [AI] / [Rule-based]
```

## Profile Completion Calculation

```
_calc_profile_completion(user) → Integer (0-100)

  Base score:                              10 points
  ├── profile.firstName filled:           + 5
  ├── profile.lastName filled:            + 5
  ├── profile.phone filled:               +10
  ├── profile.address filled:             +10
  ├── academic_info.school filled:        +10
  ├── academic_info.grade filled:         +10
  ├── academic_info.gpa filled:           +10
  ├── interests (non-empty list):         +10
  └── assessment completed:               +20
                                    ═══════════
                                    Max: 100 pts

Triggered automatically by update_user() on every profile save.
```

## Admin Data Flow

```
Admin navigates to /admin/dashboard
           │
           ▼
    GET /api/admin/stats
           │
           ▼
    Returns: {
      totalUsers,
      totalStudents,       (filtered: role == "student")
      totalCareers,        (count from careers table)
      assessmentsCompleted,(count where assessment_status.completed==true)
      careerFields         (distinct field count)
    }

Admin → /admin/careers
           │
           ▼
    GET /api/careers/ ──────────────▶ List all careers
    POST /api/careers/ ─────────────▶ Create career (admin token required)
    PUT /api/careers/{id} ──────────▶ Update career
    DELETE /api/careers/{id} ────────▶ Delete career

Admin → /admin/users
           │
           ▼
    GET /api/admin/users ───────────▶ List all users (no passwords)
    DELETE /api/admin/users/{email} ─▶ Delete user
                                       (admin@example.com protected)
```

## Frontend Routing Architecture

```
<BrowserRouter>
  <AuthProvider>
    <Routes>
      │
      ├── /login ──────────────────▶ Login.jsx
      ├── /signup ─────────────────▶ Signup.jsx
      │
      ├── /student/* ──▶ <ProtectedRoute role="student">
      │   └── <MainLayout>
      │       ├── dashboard ───────▶ Dashboard.jsx
      │       ├── assessment ──────▶ Assessment.jsx
      │       ├── careers ─────────▶ CareerExplorer.jsx
      │       ├── colleges ────────▶ CollegeDirectory.jsx
      │       ├── chatbot ─────────▶ Chatbot.jsx
      │       ├── profile ─────────▶ Profile.jsx
      │       ├── resources ───────▶ StudyResources.jsx
      │       └── scholarships ────▶ Scholarships.jsx
      │
      ├── /admin/* ────▶ <ProtectedRoute role="admin">
      │   └── <MainLayout>
      │       ├── dashboard ───────▶ AdminDashboard.jsx
      │       ├── careers ─────────▶ ManageCareers.jsx
      │       └── users ───────────▶ ManageUsers.jsx
      │
      ├── / ───────────────────────▶ Redirect to /login
      └── * ───────────────────────▶ Redirect to /login
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

## API Service Layer (api.js)

```
axios.create({ baseURL: VITE_API_URL || "http://localhost:8000" })
│
├── Request Interceptor: Attach "Authorization: Bearer {token}" from localStorage
│
├── authAPI
│   ├── login(email, password)    → POST /api/auth/login
│   ├── signup(data)              → POST /api/auth/signup
│   ├── me()                      → GET  /api/auth/me
│   └── updateProfile(data)       → PUT  /api/auth/profile
│
├── assessmentAPI
│   ├── getQuestions()            → GET  /api/assessment/questions
│   └── submit(responses)         → POST /api/assessment/submit
│
├── collegesAPI
│   ├── getFilters()             → GET  /api/colleges/filters
│   ├── search(params)           → POST /api/colleges/search
│   └── getStats()               → GET  /api/colleges/stats
│
├── chatbotAPI
│   └── ask(message, userCtx)    → POST /api/chatbot/ask
│
├── careersAPI
│   ├── list(field?)             → GET    /api/careers/
│   ├── fields()                 → GET    /api/careers/fields
│   ├── get(id)                  → GET    /api/careers/{id}
│   ├── create(data)             → POST   /api/careers/
│   ├── update(id, data)         → PUT    /api/careers/{id}
│   └── delete(id)               → DELETE /api/careers/{id}
│
└── adminAPI
    ├── stats()                  → GET    /api/admin/stats
    ├── users()                  → GET    /api/admin/users
    └── deleteUser(email)        → DELETE /api/admin/users/{email}
```

## Database Schema (SQLAlchemy)

```
┌──────────────────────────────────────────────┐
│                 users                         │
├──────────────────────────────────────────────┤
│ id               VARCHAR (PK)                │  "student-{hex}" or "admin-{hex}"
│ email            VARCHAR (UNIQUE, INDEX)      │
│ password_hash    VARCHAR                      │  bcrypt hashed
│ role             VARCHAR                      │  "student" | "admin"
│ profile          JSON                         │  {firstName, lastName, phone, avatar, address}
│ academic_info    JSON                         │  {grade, school, gpa, satScore, actScore}
│ interests        JSON                         │  ["coding", "math", ...]
│ assessment_status JSON                        │  {completed, results, completedAt}
│ profile_completion INTEGER                    │  0-100 (auto-calculated)
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│                 careers                       │
├──────────────────────────────────────────────┤
│ id               INTEGER (PK, AUTO)          │
│ title            VARCHAR                      │
│ field            VARCHAR (INDEX)              │
│ description      TEXT                         │
│ average_salary   VARCHAR                      │
│ education        VARCHAR                      │
│ skills           JSON                         │  ["Python", "ML", ...]
│ growth_rate      VARCHAR                      │
│ demand_level     VARCHAR                      │  "High" | "Medium" | "Low"
│ image            VARCHAR                      │  Unsplash URL
└──────────────────────────────────────────────┘
```

## Server Startup Sequence

```
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
                │
                ▼
        FastAPI app created
        CORS middleware configured
        6 routers registered (/api/auth, /api/assessment, etc.)
                │
                ▼
        @app.on_event("startup")
                │
                ├──▶ seed_db()
                │    ├── Create tables if not exist
                │    ├── Seed admin@example.com (admin123, bcrypt)
                │    ├── Seed student@example.com (student123, bcrypt)
                │    └── Seed 36 careers across 12 fields
                │
                └──▶ _ensure_ollama()
                     ├── Check http://localhost:11434
                     │   ├── Running ──▶ Check for qwen3.5:4b model
                     │   │               ├── Present ──▶ Ready
                     │   │               └── Missing ──▶ Pull model (~397MB)
                     │   │
                     │   └── Not running ──▶ Start Ollama subprocess
                     │                       └── Wait 15s ──▶ Retry
                     │
                     └── All failures ──▶ Log warning, chatbot uses FAQ + rules only
                │
                ▼
        Routers load data:
        ├── colleges.py: Load kk_14.csv (70K+ rows) + college_embeddings.npy → FAISS index
        ├── chatbot.py:  Load faq.xlsx → FAISS index + Load all careers for context
        └── assessment.py: Load assessment CSV (20 questions)
                │
                ▼
        Server ready at http://localhost:8000
        Health: GET / or GET /health
```

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 19.1.1 | UI framework |
| Frontend | Vite (rolldown) | 7.1.14 | Build tool |
| Frontend | Tailwind CSS | 3.4.18 | Styling |
| Frontend | React Router | 7.9.6 | Routing |
| Frontend | Framer Motion | 12.23.24 | Animations |
| Frontend | Axios | 1.13.2 | HTTP client |
| Frontend | Lucide React | 0.554.0 | Icons |
| Backend | FastAPI | - | Web framework |
| Backend | SQLAlchemy | - | ORM |
| Backend | SQLite | - | Database |
| Backend | bcrypt | - | Password hashing |
| AI/ML | Ollama | 0.9.3 | Local LLM runtime |
| AI/ML | qwen3.5:4b | 4B params | Chat model |
| AI/ML | sentence-transformers | - | Text embeddings |
| AI/ML | all-MiniLM-L6-v2 | 384-dim | Embedding model |
| AI/ML | FAISS | - | Vector similarity |

## File-to-Feature Mapping

| Feature | Backend File | Frontend File |
|---------|-------------|--------------|
| Login/Signup | routers/auth.py | pages/auth/Login.jsx, Signup.jsx |
| Assessment | routers/assessment.py | pages/student/Assessment.jsx |
| Career Browse | routers/careers.py | pages/student/CareerExplorer.jsx |
| College Search | routers/colleges.py | pages/student/CollegeDirectory.jsx |
| AI Chat | routers/chatbot.py | pages/student/Chatbot.jsx |
| Profile | routers/auth.py (PUT) | pages/student/Profile.jsx |
| Dashboard | routers/admin.py (stats) | pages/student/Dashboard.jsx |
| Admin Careers | routers/careers.py (CRUD) | pages/admin/ManageCareers.jsx |
| Admin Users | routers/admin.py | pages/admin/ManageUsers.jsx |
| Auth State | — | contexts/AuthContext.jsx |
| API Client | — | services/api.js |
| Route Guard | — | components/common/ProtectedRoute.jsx |
| Layout | — | layouts/MainLayout.jsx |
| DB Models | models.py | — |
| DB Operations | database.py | — |
