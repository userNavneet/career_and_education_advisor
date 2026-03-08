# EduCareer Data Directory

Shared data directory for the EduCareer platform. Currently reserved for future use.

## Data Locations

The project's data files are distributed across the backend subdirectories:

| File | Location | Description |
|------|----------|-------------|
| `educareer.db` | `backend/data/` | SQLite database (auto-generated on startup) |
| `kk_14.csv` | `backend/college-directory/` | 70,000+ Indian college records |
| `college_embeddings.npy` | `backend/college-directory/` | Precomputed FAISS embeddings for college search |
| `student_career_assessment_questions.csv` | `backend/assessment/` | 20 career assessment questions across 12 categories |
| `faq.xlsx` | `backend/AI-hybrid-chatbot/` | FAQ dataset for chatbot similarity matching |

## Database Schema

The SQLite database (`backend/data/educareer.db`) contains:

- **`users` table** - Student and admin accounts with profile data, academic info, interests, assessment results, and profile completion percentage
- **`careers` table** - 36 seeded careers across 12 fields with salary, education, skills, and growth data