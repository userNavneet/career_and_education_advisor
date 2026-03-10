# EduCareer - Career & Education Advisor Platform

A full-stack web application that guides students through their career and educational journey. The platform provides AI-powered career assessments, a directory of 70,000+ colleges with semantic search, a hybrid AI chatbot (Ollama + FAISS), scholarship discovery, and comprehensive profile management.

## 🌟 Features

### For Students
- **📊 Career Assessment** - 20-question Likert-scale quiz across 12 career categories with personalized recommendations
- **💼 Career Explorer** - Browse 36 careers across 12 fields with salary data, skills, and growth projections
- **🎓 College Directory** - Search 70,000+ Indian colleges with AI-powered semantic search, field/state filters, and pagination
- **🤖 AI Chatbot** - Hybrid chatbot: FAQ (FAISS) → Ollama LLM (`qwen3.5:4b`) → rule-based fallback
- **👤 Profile Management** - Auto-calculated profile completion percentage, academic records, and interest tracking
- **📚 Learning Resources** - Curated study materials and test preparation resources
- **💰 Scholarships** - Discover funding opportunities with eligibility criteria

### For Administrators
- **📊 Dashboard** - Platform statistics: total users, students, careers, assessments completed
- **✏️ Manage Careers** - Full CRUD operations for career data (36 seeded careers)
- **👥 Manage Users** - View, search, and delete user accounts (admin-protected)

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI with hooks and functional components
- **Vite** (rolldown-vite v7.1.14) - Fast build tool
- **React Router v7** - Client-side routing with role-based protected routes
- **Tailwind CSS v3** - Utility-first CSS with custom glassmorphism theme
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client with token interceptors
- **Lucide React** - Icon system

### Backend
- **FastAPI** - High-performance Python web framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM with SQLite database
- **bcrypt** - Secure password hashing
- **Ollama** (`qwen3.5:4b`) - Local LLM for chatbot responses
- **sentence-transformers** (`all-MiniLM-L6-v2`) - Embeddings for FAQ matching and college search
- **FAISS** - Vector similarity search for FAQ and college retrieval
- **pandas** - Data processing for college and assessment datasets

## 📁 Project Structure

```
career_and_education_advisor/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app, CORS, Ollama auto-startup
│   │   ├── models.py            # SQLAlchemy ORM (User, Career)
│   │   ├── database.py          # CRUD operations, seed data, profile completion calc
│   │   └── routers/
│   │       ├── auth.py          # Login, Signup, Profile update
│   │       ├── assessment.py    # 20-question career assessment
│   │       ├── careers.py       # Career CRUD (admin-protected writes)
│   │       ├── colleges.py      # AI-powered college search with pagination
│   │       ├── chatbot.py       # Hybrid chatbot (FAQ + Ollama + rules)
│   │       └── admin.py         # Stats, user management
│   ├── AI-hybrid-chatbot/
│   │   └── faq.xlsx             # FAQ dataset for FAISS matching
│   ├── assessment/
│   │   └── student_career_assessment_questions.csv  # 20 questions, 12 categories
│   ├── college-directory/
│   │   ├── kk_14.csv            # 70,000+ college dataset
│   │   └── college_embeddings.npy  # Precomputed FAISS embeddings
│   ├── data/
│   │   └── educareer.db         # SQLite database (auto-generated)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Route configuration with ErrorBoundary
│   │   ├── main.jsx             # React entry point
│   │   ├── index.css            # Global styles + Tailwind
│   │   ├── components/
│   │   │   └── common/
│   │   │       └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Auth state, login/signup/refresh
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx  # Sidebar + header layout
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Signup
│   │   │   ├── student/        # 8 student pages
│   │   │   └── admin/          # 3 admin pages
│   │   └── services/
│   │       └── api.js          # Axios client with all API endpoints
│   ├── package.json
│   └── vite.config.js
├── data/                        # Shared data directory
├── models/                      # Reserved for ML models
├── ARCHITECTURE.md              # Detailed architecture documentation
└── README.md                    # This file
```

## 🎨 Design System

- **Theme**: Blue-to-Purple gradient with glassmorphism (backdrop-blur, transparency)
- **Custom CSS**: `.glass-card`, `.btn-primary`, `.input-glass`, `.text-gradient`
- **Responsive**: Mobile-first with collapsible sidebar
- **Animations**: Framer Motion page transitions and hover effects

## 🚦 Getting Started

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.10+**
- **Ollama** (optional, for AI chatbot - auto-starts with backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/userNavneet/career_and_education_advisor.git
   cd career_and_education_advisor
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the backend** (auto-seeds database and starts Ollama)
   ```bash
   cd backend
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

5. **Start the frontend** (in a separate terminal)
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173/
   ```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@example.com | student123 |
| Admin | admin@example.com | admin123 |

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | No | Login with email/password |
| POST | `/signup` | No | Register new student account |
| GET | `/me` | Yes | Get current user profile |
| PUT | `/profile` | Yes | Update profile (auto-recalculates completion %) |

### Career Assessment (`/api/assessment`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/questions` | No | Get 20 assessment questions |
| POST | `/submit` | Optional | Submit responses, get career recommendations |

### Careers (`/api/careers`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | List careers (optional field filter) |
| GET | `/fields` | No | List all career fields |
| GET | `/{id}` | No | Get career by ID |
| POST | `/` | Admin | Create career |
| PUT | `/{id}` | Admin | Update career |
| DELETE | `/{id}` | Admin | Delete career |

### Colleges (`/api/colleges`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/filters` | Get available fields and states |
| POST | `/search` | Search colleges (query, field, state, page, limit) |

### Chatbot (`/api/chatbot`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ask` | Ask question with optional user context |

### Admin (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Platform statistics |
| GET | `/users` | List all users |
| DELETE | `/users/{email}` | Delete user (admin-protected) |

## 📊 Data Models

### User (SQLAlchemy)
- `email`, `password_hash` (bcrypt), `role` (student/admin)
- `profile` (JSON: firstName, lastName, phone, address)
- `academic_info` (JSON: grade, school, gpa, satScore, actScore)
- `interests` (JSON array), `assessment_status` (JSON: completed, results)
- `profile_completion` (Integer: 0-100, auto-calculated)

### Career (SQLAlchemy)
- `title`, `field`, `description`, `average_salary`, `education`
- `skills` (JSON array), `growth_rate`, `demand_level`, `image`
- 36 careers seeded across 12 fields on first startup

### College (from CSV, 70,000+ records)
- `INSTITUTE NAME`, `INSTI_ADDRESS`, `STATE`, `WEBSITE`
- `FIELD` (discipline), `PLACEMENT`, `ACCREDITED_BY`

## 🤖 AI/ML Components

### Hybrid Chatbot (3-tier fallback)
1. **FAQ Search** - FAISS index over `faq.xlsx` with `all-MiniLM-L6-v2` embeddings (threshold: 0.5)
2. **Ollama LLM** - `qwen3.5:4b` model with career context + user profile in system prompt
3. **Rule-based** - Pattern-matched keyword responses as final fallback

### College Semantic Search
- Precomputed embeddings for 70,000+ colleges via `all-MiniLM-L6-v2`
- FAISS `IndexFlatL2` for fast similarity search
- Combined with field/state filters, paginated results (50/page, max 100)

### Career Assessment
- 20 Likert-scale questions (1-5) across 12 career categories
- Scores aggregated per category, top 3 categories returned with matching careers

## 🔐 Authentication & Security

- **bcrypt** password hashing (no plaintext storage)
- **Bearer token** authentication (in-memory token store)
- **Role-based access control** - Student and Admin roles with protected routes
- **Admin protection** - Default admin account cannot be deleted
- **CORS** - Restricted to localhost development origins

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev       # Start development server (port 5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
```

**Backend:**
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000          # Start server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload # With hot-reload
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [Ollama](https://ollama.ai/) - Local LLM runtime
- [sentence-transformers](https://www.sbert.net/) - Embedding models
- [FAISS](https://github.com/facebookresearch/faiss) - Vector similarity search
- [Lucide](https://lucide.dev/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

**Note**: This project is currently in active development. The frontend is complete with mock data. Backend implementation with Python and ML models is planned for future releases.
