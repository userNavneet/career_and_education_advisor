# EduCareer Frontend

React 19 single-page application with glassmorphism UI for the EduCareer career and education advisor platform.

## Tech Stack

- **React 19** - UI framework with hooks and functional components
- **Vite** (rolldown-vite v7.1.14) - Fast build tool
- **React Router v7** - Client-side routing with role-based protection
- **Tailwind CSS v3** - Utility-first styling with custom glassmorphism theme
- **Framer Motion** - Page transitions and hover animations
- **Axios** - HTTP client with Bearer token interceptors
- **Lucide React** - Icon library
- **React Hook Form + Zod** - Form management and validation
- **Recharts** - Data visualization

## Features

### Student Pages (8 pages)
- **Dashboard** - Recommended careers, nearby colleges, achievements
- **Career Assessment** - 20-question interactive quiz with category scoring
- **Career Explorer** - Browse/filter 36 careers across 12 fields
- **College Directory** - AI-powered search of 70,000+ colleges with pagination
- **AI Chatbot** - Chat interface with FAQ/Ollama/rule-based source badges
- **Profile** - Personal + academic info, auto-updating completion percentage
- **Learning Resources** - Curated study materials and test prep
- **Scholarships** - Funding opportunities with eligibility details

### Admin Pages (3 pages)
- **Dashboard** - Stats: total users, students, careers, assessments completed
- **Manage Careers** - Full CRUD for career entries
- **Manage Users** - Search, view, and delete user accounts

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Route config + ErrorBoundary
│   ├── main.jsx             # React entry point
│   ├── index.css            # Global styles + Tailwind custom classes
│   ├── App.css
│   ├── components/
│   │   └── common/
│   │       └── ProtectedRoute.jsx  # Role-based route guard
│   ├── contexts/
│   │   └── AuthContext.jsx  # Auth state: login, signup, logout, refreshUser
│   ├── data/
│   │   ├── mockColleges.js
│   │   └── mockScholarshipsAndResources.js
│   ├── layouts/
│   │   └── MainLayout.jsx  # Sidebar navigation + responsive header
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assessment.jsx
│   │   │   ├── CareerExplorer.jsx
│   │   │   ├── CollegeDirectory.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── StudyResources.jsx
│   │   │   └── Scholarships.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── ManageCareers.jsx
│   │       └── ManageUsers.jsx
│   ├── services/
│   │   └── api.js           # Axios client (auth, assessment, colleges, chatbot, careers, admin)
│   └── utils/
│       └── cn.js            # classnames utility
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

## Routes

### Public
- `/login` - Login page
- `/signup` - Registration page

### Student (protected, role: student)
- `/student/dashboard` - Student dashboard
- `/student/assessment` - Career assessment quiz
- `/student/careers` - Career explorer
- `/student/colleges` - College directory
- `/student/chatbot` - AI chatbot
- `/student/profile` - Profile management
- `/student/resources` - Learning resources
- `/student/scholarships` - Scholarship finder

### Admin (protected, role: admin)
- `/admin/dashboard` - Admin dashboard
- `/admin/careers` - Manage careers (CRUD)
- `/admin/users` - Manage users

## Sidebar Navigation

**Student:** Dashboard → Assessment → Career Explorer → College Directory → Learning Resources → AI Chatbot → Scholarships → Profile

**Admin:** Dashboard → Manage Careers → Manage Users

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`. Backend must be running at `http://localhost:8000`.

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@example.com | student123 |
| Admin | admin@example.com | admin123 |

## API Integration

All API calls go through `src/services/api.js` with these modules:

- **authAPI** - login, signup, me, updateProfile
- **assessmentAPI** - getQuestions, submit
- **collegesAPI** - getFilters, search, getStats
- **chatbotAPI** - ask
- **careersAPI** - list, fields, get, create, update, delete
- **adminAPI** - stats, users, deleteUser

Base URL: `VITE_API_URL` env var or `http://localhost:8000`

## Design System

- **Glass morphism**: `.glass-card` (backdrop-blur + transparency)
- **Gradient buttons**: `.btn-primary` (blue-to-purple)
- **Glass inputs**: `.input-glass`
- **Gradient text**: `.text-gradient`
- **Color scheme**: Blue-50 to Pink-50 background gradients
- **Responsive**: Mobile-first with collapsible sidebar on mobile

## Scripts

```bash
npm run dev       # Development server (port 5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
```
