# Career & Education Advisor - Architecture & Data Flow

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Browser)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Login    │  │   Signup   │  │  Student   │  │  Counselor │        │
│  │   Page     │  │   Page     │  │  Dashboard │  │  Dashboard │        │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │
│                                                                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Career   │  │  College   │  │ Assessment │  │   Admin    │        │
│  │  Explorer  │  │ Directory  │  │    Quiz    │  │  Dashboard │        │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓↑
┌─────────────────────────────────────────────────────────────────────────┐
│                        ROUTING LAYER (React Router)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  • Public Routes: /login, /signup                                        │
│  • Protected Routes: /student/*, /counselor/*, /admin/*                 │
│  • Role-based Access Control (RBAC)                                      │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓↑
┌─────────────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT (React Context)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │              AuthContext (Global State)                  │            │
│  │  • user: { id, name, email, role }                       │            │
│  │  • isAuthenticated: boolean                              │            │
│  │  • login(email, password)                                │            │
│  │  • signup(userData)                                      │            │
│  │  • logout()                                              │            │
│  │  • updateProfile(data)                                   │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓↑
┌─────────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER (Mock Data - Current)                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  • mockUsers.js         → User authentication data                       │
│  • mockCareers.js       → Career information (8 careers)                 │
│  • mockColleges.js      → College database (6 colleges)                  │
│  • mockAssessments.js   → Quiz questions (8 questions)                   │
│  • mockScholarshipsAndResources.js → Scholarships & Resources            │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓↑
┌─────────────────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER (localStorage)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  • user session data                                                     │
│  • authentication token (future: JWT)                                    │
│  • user preferences                                                      │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete User Flow Diagrams

### 1️⃣ Authentication Flow

```
START
  │
  ├──→ User Visits Site
  │         │
  │         ↓
  │    Is Authenticated?
  │         │
  │    ┌────┴────┐
  │    NO       YES
  │    │         │
  │    ↓         ↓
  │  Login    Redirect to
  │  Page     Dashboard
  │    │      (role-based)
  │    ↓
  │  Enter Credentials
  │    │
  │    ↓
  │  AuthContext.login()
  │    │
  │    ↓
  │  Validate against mockUsers
  │    │
  │    ├────────────┐
  │    │            │
  │  Valid      Invalid
  │    │            │
  │    ↓            ↓
  │  Set User    Show Error
  │  State       Message
  │    │            │
  │    ↓            └──→ Retry
  │  Save to
  │  localStorage
  │    │
  │    ↓
  │  Redirect to Dashboard
  │    │
  │    ├─────────────┬─────────────┐
  │    │             │             │
  │  Student      Counselor      Admin
  │    │             │             │
  │    ↓             ↓             ↓
  │  /student/   /counselor/   /admin/
  │  dashboard    dashboard    dashboard
  │
END
```

### 2️⃣ Student Assessment Flow

```
START: Student Dashboard
  │
  ↓
Navigate to Assessment Page
  │
  ↓
Load mockAssessments.js
  │
  ↓
Display Question 1/8
  │
  ↓
┌─────────────────┐
│  User selects   │
│  answer option  │
└─────────────────┘
  │
  ↓
Store answer in state
  │
  ↓
More questions? ──YES──→ Next Question ──┐
  │                                        │
  NO                                       │
  │                                        │
  ↓                                        │
Calculate Scores                           │
  │                                        │
  ├──→ For each question:                 │
  │      • Get selected option            │
  │      • Extract weighted scores        │
  │      • Add to field totals            │
  │      (tech, healthcare, business,     │
  │       creative, education, etc.)      │
  │                                        │
  ↓                                        │
Rank all fields by score                   │
  │                                        │
  ↓                                        │
Get Top 3 Fields                           │
  │                                        │
  ↓                                        │
Load mockCareers.js                        │
  │                                        │
  ↓                                        │
Filter careers by top fields               │
  │                                        │
  ↓                                        │
Display Results Page                       │
  │                                        │
  ├──→ Recommended Fields                 │
  ├──→ Matching Careers                   │
  ├──→ Suggested Colleges                 │
  ├──→ Next Steps                         │
  │                                        │
  ↓                                        │
User can:                                  │
  • View Career Details                    │
  • Explore Colleges                       │
  • Retake Assessment ─────────────────────┘
  • Save Results
  │
END
```

### 3️⃣ Career Explorer Flow

```
START: Navigate to Career Explorer
  │
  ↓
Load mockCareers.js (8 careers)
  │
  ↓
Display Career Grid
  │
  ├──→ Search by keyword
  │      │
  │      ↓
  │    Filter careers by:
  │      • Title match
  │      • Field match
  │      • Description match
  │      │
  │      ↓
  │    Update display
  │
  ├──→ Filter by Field
  │      │
  │      ↓
  │    Filter careers where:
  │      • career.field === selectedField
  │      │
  │      ↓
  │    Update display
  │
  ├──→ Click on Career Card
  │      │
  │      ↓
  │    Open Modal with:
  │      • Full description
  │      • Required education
  │      • Average salary
  │      • Required skills
  │      • Growth rate
  │      • Demand level
  │      │
  │      ↓
  │    User can:
  │      • Add to favorites
  │      • Compare careers
  │      • Close modal
  │
END
```

### 4️⃣ Admin CRUD Flow (Manage Careers)

```
START: Admin Dashboard
  │
  ↓
Navigate to Manage Careers
  │
  ↓
Load careers from state
  │
  ↓
Display Careers Table
  │
  ├──────────┬──────────┬──────────┬──────────┐
  │          │          │          │          │
CREATE    READ       UPDATE     DELETE    SEARCH
  │          │          │          │          │
  ↓          ↓          ↓          ↓          ↓
Click     View      Click      Click     Enter
"Add      All       "Edit"     "Delete"  Search
Career"   Careers   Button     Button    Term
  │          │          │          │          │
  ↓          │          ↓          ↓          ↓
Open       │       Open       Confirm   Filter
Modal      │       Modal      Dialog    Table
  │          │          │          │          │
  ↓          │          ↓          │          │
Fill       │       Edit       │          │
Form:      │       Fields     │          │
• Title    │          │          │          │
• Field    │          ↓          │          │
• Desc     │       Save       │          │
• Salary   │       Changes    │          │
• Edu      │          │          │          │
• Skills   │          ↓          ↓          │
• Growth   │       Update     Remove      │
• Demand   │       State      from        │
• Image    │          │       State       │
  │          │          │          │          │
  ↓          │          │          │          │
Validate   │          │          │          │
Input      │          │          │          │
  │          │          │          │          │
  ├─────┬────┴──────────┴──────────┴──────────┘
  │     │
Valid Invalid
  │     │
  ↓     ↓
Add   Show
to    Error
State Message
  │     │
  ↓     └──→ Fix & Retry
Save to
Database (Future)
  │
  ↓
Update UI
  │
  ↓
Show Success
Message
  │
END
```

---

## 🔀 Data Flow Pipeline

### Complete Request-Response Cycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       COMPONENT LAYER                                │
│  • Button Click / Form Submit / Link Navigation                     │
│  • Event Handler Triggered                                          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       STATE MANAGEMENT                               │
│                                                                      │
│  ┌────────────────────────────────────────────────────┐            │
│  │  AuthContext / Local Component State               │            │
│  │  • Check permissions                                │            │
│  │  • Update state variables                          │            │
│  │  • Trigger re-renders                              │            │
│  └────────────────────────────────────────────────────┘            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     DATA PROCESSING LAYER                            │
│                                                                      │
│  Current (Mock Data):                                               │
│  ┌────────────────────────────────────────────────────┐            │
│  │  • Import from mock files                          │            │
│  │  • Filter/Sort/Transform data                      │            │
│  │  • Calculate results (assessment scores)           │            │
│  │  • Validate inputs                                 │            │
│  └────────────────────────────────────────────────────┘            │
│                                                                      │
│  Future (API Layer):                                                │
│  ┌────────────────────────────────────────────────────┐            │
│  │  • API Service call (fetch/axios)                  │            │
│  │  • Request interceptors (add auth token)           │            │
│  │  • Response handling                               │            │
│  │  • Error handling                                  │            │
│  └────────────────────────────────────────────────────┘            │
│                              ↓                                       │
│                    ┌─────────────────┐                              │
│                    │  Backend API    │  (Future)                    │
│                    │  POST /careers  │                              │
│                    │  GET /colleges  │                              │
│                    │  PUT /user/:id  │                              │
│                    └─────────────────┘                              │
│                              ↓                                       │
│                    ┌─────────────────┐                              │
│                    │   Database      │  (Future)                    │
│                    │   PostgreSQL    │                              │
│                    └─────────────────┘                              │
│                              ↓                                       │
│                    ┌─────────────────┐                              │
│                    │  ML Models      │  (Future)                    │
│                    │  Recommendations│                              │
│                    └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      RESPONSE HANDLING                               │
│  • Update component state with data                                 │
│  • Trigger loading states (start/end)                               │
│  • Handle errors (show error messages)                              │
│  • Update cache (localStorage)                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        UI RE-RENDER                                  │
│  • React reconciliation                                             │
│  • Virtual DOM diff                                                 │
│  • Update actual DOM                                                │
│  • Framer Motion animations                                         │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      UPDATED UI DISPLAY                              │
│  • Show new data                                                    │
│  • Display success/error messages                                   │
│  • Enable/disable buttons                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Hierarchy & Data Flow

```
App.jsx (Root)
  │
  ├── AuthProvider (Context)
  │     │
  │     └── Provides: { user, login, signup, logout, updateProfile }
  │
  └── Router
        │
        ├── Public Routes
        │     │
        │     ├── Login
        │     │    ├── Data In: email, password
        │     │    ├── Process: AuthContext.login()
        │     │    ├── Validate: mockUsers
        │     │    └── Data Out: user object → AuthContext
        │     │
        │     └── Signup
        │          ├── Data In: name, email, password, role
        │          ├── Process: AuthContext.signup()
        │          ├── Validate: email uniqueness
        │          └── Data Out: new user → mockUsers, AuthContext
        │
        └── Protected Routes (ProtectedRoute wrapper)
              │
              ├── Student Routes
              │     │
              │     ├── MainLayout
              │     │    ├── Sidebar (navigation)
              │     │    ├── Header (search, notifications)
              │     │    └── Outlet (page content)
              │     │
              │     ├── Dashboard
              │     │    ├── Data In: user from AuthContext
              │     │    ├── Data In: mockCareers, mockColleges
              │     │    ├── Process: Filter by user preferences
              │     │    └── Display: recommendations, timeline
              │     │
              │     ├── Assessment
              │     │    ├── Data In: mockAssessments (8 questions)
              │     │    ├── State: answers[], currentQuestion
              │     │    ├── Process: Calculate field scores
              │     │    ├── Data In: mockCareers (for matching)
              │     │    └── Display: results, recommendations
              │     │
              │     ├── CareerExplorer
              │     │    ├── Data In: mockCareers
              │     │    ├── State: searchTerm, selectedField
              │     │    ├── Process: Filter/search careers
              │     │    └── Display: career cards, modal
              │     │
              │     ├── CollegeDirectory
              │     │    ├── Data In: mockColleges
              │     │    ├── State: searchTerm, filters
              │     │    ├── Process: Filter/sort colleges
              │     │    └── Display: college cards
              │     │
              │     ├── Timeline
              │     │    ├── Data In: mockScholarshipsAndResources
              │     │    ├── Process: Calculate days until deadline
              │     │    └── Display: timeline events
              │     │
              │     ├── Chatbot
              │     │    ├── Data In: user.chatHistory (mockUsers)
              │     │    ├── State: messages[], input
              │     │    ├── Process: Mock bot responses
              │     │    └── Display: chat interface
              │     │
              │     ├── Profile
              │     │    ├── Data In: user from AuthContext
              │     │    ├── State: editMode, formData
              │     │    ├── Process: AuthContext.updateProfile()
              │     │    └── Display: editable profile form
              │     │
              │     ├── StudyResources
              │     │    ├── Data In: mockScholarshipsAndResources
              │     │    ├── State: selectedCategory
              │     │    ├── Process: Filter by category
              │     │    └── Display: resource cards
              │     │
              │     └── Scholarships
              │          ├── Data In: mockScholarshipsAndResources
              │          ├── State: filters (amount, deadline)
              │          ├── Process: Filter/sort scholarships
              │          └── Display: scholarship cards
              │
              ├── Counselor Routes
              │     │
              │     └── Dashboard
              │          ├── Data In: mockUsers (students)
              │          ├── Process: Filter assigned students
              │          └── Display: student list, sessions
              │
              └── Admin Routes
                    │
                    ├── Dashboard
                    │    ├── Data In: all mock data
                    │    ├── Process: Calculate statistics
                    │    └── Display: analytics, recent activity
                    │
                    └── ManageCareers (CRUD Template)
                         ├── Data In: mockCareers
                         ├── State: careers[], editingCareer
                         ├── Actions:
                         │    ├── CREATE: Add new career
                         │    ├── READ: Display all careers
                         │    ├── UPDATE: Edit career details
                         │    └── DELETE: Remove career
                         └── Display: table, modals
```

---

## 🔐 Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION PIPELINE                       │
└─────────────────────────────────────────────────────────────────┘

User Input (email + password)
         ↓
┌─────────────────────┐
│  Login Component    │
│  • Validate format  │
│  • Call login()     │
└─────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│        AuthContext.login()               │
│  1. Find user in mockUsers               │
│  2. Compare credentials                  │
│  3. If match:                            │
│     • Set user state                     │
│     • Set isAuthenticated = true         │
│     • Save to localStorage               │
│  4. If no match:                         │
│     • Throw error                        │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│      localStorage Persistence            │
│  localStorage.setItem('user', JSON)      │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│      Navigate to Dashboard               │
│  • Router checks user.role               │
│  • Redirects to role-specific path       │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│      ProtectedRoute Wrapper              │
│  1. Check isAuthenticated                │
│  2. Check user.role in allowedRoles      │
│  3. If authorized: render page           │
│  4. If not: redirect to /login           │
└──────────────────────────────────────────┘
         ↓
     Render Page

┌─────────────────────────────────────────────────────────────────┐
│              ROLE-BASED ACCESS CONTROL (RBAC)                    │
└─────────────────────────────────────────────────────────────────┘

Route: /student/*
  ├── Allowed Roles: ['student']
  ├── Check: user.role === 'student'
  └── Redirect if unauthorized: /login

Route: /counselor/*
  ├── Allowed Roles: ['counselor']
  ├── Check: user.role === 'counselor'
  └── Redirect if unauthorized: /login

Route: /admin/*
  ├── Allowed Roles: ['admin']
  ├── Check: user.role === 'admin'
  └── Redirect if unauthorized: /login

Route: /login, /signup
  ├── Allowed: Public (all users)
  └── If authenticated: redirect to dashboard
```

---

## 🎯 Assessment Scoring Algorithm

```
┌─────────────────────────────────────────────────────────────────┐
│              CAREER ASSESSMENT SCORING PIPELINE                  │
└─────────────────────────────────────────────────────────────────┘

START: User begins assessment
  ↓
Initialize: scores = {
  tech: 0,
  healthcare: 0,
  business: 0,
  creative: 0,
  education: 0,
  engineering: 0,
  science: 0,
  social: 0,
  legal: 0,
  trades: 0,
  hospitality: 0,
  agriculture: 0
}
  ↓
FOR each question (1-8):
  ├── Display question with 4 options
  ├── User selects option
  ├── Get option.scores object:
  │      {
  │        tech: 10,
  │        healthcare: 5,
  │        creative: 3,
  │        ...
  │      }
  ├── FOR each field in option.scores:
  │      scores[field] += option.scores[field]
  └── Move to next question
  ↓
All questions answered
  ↓
Convert scores to array:
  [
    { field: 'tech', score: 65 },
    { field: 'healthcare', score: 48 },
    { field: 'business', score: 42 },
    ...
  ]
  ↓
Sort by score (descending)
  ↓
Get top 3 fields:
  1. Technology (65 points)
  2. Healthcare (48 points)
  3. Business (42 points)
  ↓
FOR each top field:
  ├── Filter mockCareers where career.field === topField
  ├── Collect matching careers
  └── Add to recommendations
  ↓
Display Results:
  ├── Top 3 recommended fields (with scores)
  ├── 3-6 matching careers (from mockCareers)
  ├── Suggested colleges (based on career programs)
  └── Next steps & resources
  ↓
END
```

---

## 🔮 Future Architecture (With Backend & ML)

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                            │
│  • Components • Pages • State Management                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY / NGINX                           │
│  • Load Balancing • SSL/TLS • Rate Limiting                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Python Flask/FastAPI)                  │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │  Auth Service  │  │  Career Service│  │  User Service  │   │
│  │  • JWT tokens  │  │  • CRUD ops    │  │  • Profiles    │   │
│  │  • Sessions    │  │  • Search      │  │  • Preferences │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ College Service│  │  ML Service    │  │ Chatbot Service│   │
│  │  • Directory   │  │  • Recommend   │  │  • NLP/LLM     │   │
│  │  • Matching    │  │  • Predict     │  │  • Responses   │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                       │
│                                                                  │
│  Tables:                                                         │
│  • users (id, name, email, password_hash, role)                 │
│  • careers (id, title, field, description, salary, ...)         │
│  • colleges (id, name, location, ranking, ...)                  │
│  • assessments (id, user_id, answers, results, timestamp)       │
│  • scholarships (id, name, amount, deadline, ...)               │
│  • resources (id, title, category, url, ...)                    │
│  • user_preferences (id, user_id, career_interests, ...)        │
│  • chat_history (id, user_id, messages, timestamp)              │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│              MACHINE LEARNING LAYER (Python)                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │  Career Recommendation Model                       │        │
│  │  • Input: Assessment scores, academic data         │        │
│  │  • Algorithm: Collaborative filtering / Neural Net │        │
│  │  • Output: Personalized career matches             │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │  College Match Model                               │        │
│  │  • Input: GPA, SAT, interests, location prefs      │        │
│  │  • Algorithm: Ranking algorithm                    │        │
│  │  • Output: College recommendations with fit scores │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │  Success Prediction Model                          │        │
│  │  • Input: Student profile, career choice           │        │
│  │  • Algorithm: Logistic regression / Random Forest  │        │
│  │  • Output: Success probability & risk factors      │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                         │
│                                                                  │
│  • College Board API (SAT scores, college data)                 │
│  • CommonApp API (application tracking)                         │
│  • Scholarship databases (Fastweb, Scholarships.com)            │
│  • OpenAI API (chatbot intelligence)                            │
│  • Email service (SendGrid/AWS SES)                             │
│  • Payment gateway (Stripe for premium features)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📈 Data Entity Relationships (Future Database Schema)

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │───┐
│ name         │   │
│ email        │   │
│ password_hash│   │
│ role         │   │
│ created_at   │   │
└──────────────┘   │
                   │
                   ├──→ ┌──────────────────┐
                   │    │ user_preferences │
                   │    ├──────────────────┤
                   │    │ id (PK)          │
                   │    │ user_id (FK)     │
                   │    │ career_interests │
                   │    │ location_prefs   │
                   │    │ salary_range     │
                   │    └──────────────────┘
                   │
                   ├──→ ┌──────────────────┐
                   │    │ assessments      │
                   │    ├──────────────────┤
                   │    │ id (PK)          │
                   │    │ user_id (FK)     │
                   │    │ answers (JSON)   │
                   │    │ results (JSON)   │
                   │    │ timestamp        │
                   │    └──────────────────┘
                   │
                   ├──→ ┌──────────────────┐
                   │    │ chat_history     │
                   │    ├──────────────────┤
                   │    │ id (PK)          │
                   │    │ user_id (FK)     │
                   │    │ messages (JSON)  │
                   │    │ timestamp        │
                   │    └──────────────────┘
                   │
                   └──→ ┌──────────────────┐
                        │ user_colleges    │
                        ├──────────────────┤
                        │ id (PK)          │
                        │ user_id (FK)     │
                        │ college_id (FK)  │
                        │ status           │
                        └──────────────────┘
                                 │
                                 ↓
                        ┌──────────────────┐
                        │    colleges      │
                        ├──────────────────┤
                        │ id (PK)          │
                        │ name             │
                        │ location         │
                        │ ranking          │
                        │ tuition          │
                        │ acceptance_rate  │
                        └──────────────────┘

┌──────────────┐
│   careers    │
├──────────────┤
│ id (PK)      │
│ title        │
│ field        │
│ description  │
│ salary_min   │
│ salary_max   │
│ education    │
│ growth_rate  │
└──────────────┘

┌──────────────┐
│ scholarships │
├──────────────┤
│ id (PK)      │
│ name         │
│ provider     │
│ amount       │
│ deadline     │
│ eligibility  │
└──────────────┘

┌──────────────┐
│  resources   │
├──────────────┤
│ id (PK)      │
│ title        │
│ category     │
│ description  │
│ url          │
│ type         │
└──────────────┘
```

---

## 🚀 Deployment Pipeline (Future)

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

Developer writes code
         ↓
Git commit & push to GitHub
         ↓
┌──────────────────────────────────────────┐
│      CI/CD Pipeline (GitHub Actions)     │
│  1. Run tests (Jest, Pytest)             │
│  2. Run linters (ESLint, Pylint)         │
│  3. Build frontend (npm run build)       │
│  4. Build backend (Docker image)         │
│  5. Security scan (Snyk, OWASP)          │
└──────────────────────────────────────────┘
         ↓
   Tests pass?
         ├─── NO ──→ Notify developer, reject
         │
        YES
         ↓
┌──────────────────────────────────────────┐
│         Deploy to Staging                │
│  • Frontend → Vercel/Netlify             │
│  • Backend → Docker container            │
│  • Database → PostgreSQL (staging)       │
└──────────────────────────────────────────┘
         ↓
Manual testing & QA
         ↓
   Approved?
         ├─── NO ──→ Fix & redeploy
         │
        YES
         ↓
┌──────────────────────────────────────────┐
│       Deploy to Production               │
│  • Frontend → CDN (Cloudflare/AWS)       │
│  • Backend → Kubernetes/AWS ECS          │
│  • Database → PostgreSQL (production)    │
│  • ML Models → AWS SageMaker             │
└──────────────────────────────────────────┘
         ↓
Monitor with:
  • Error tracking (Sentry)
  • Analytics (Google Analytics)
  • Performance (Lighthouse)
  • Logs (CloudWatch/ELK)
```

---

## 🎨 UI Component State Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              TYPICAL PAGE LIFECYCLE                              │
└─────────────────────────────────────────────────────────────────┘

Component Mounts
       ↓
┌──────────────────────┐
│   useEffect() hook   │
│   • Load data        │
│   • Set loading=true │
└──────────────────────┘
       ↓
┌──────────────────────┐
│   Fetch Data         │
│   (mock or API)      │
└──────────────────────┘
       ↓
┌──────────────────────┐
│   Process Data       │
│   • Transform        │
│   • Filter           │
│   • Sort             │
└──────────────────────┘
       ↓
┌──────────────────────┐
│   Update State       │
│   • setData(result)  │
│   • setLoading(false)│
└──────────────────────┘
       ↓
┌──────────────────────┐
│   React Re-render    │
│   • Virtual DOM diff │
│   • Update UI        │
└──────────────────────┘
       ↓
┌──────────────────────┐
│   User Interaction   │
│   • Search           │
│   • Filter           │
│   • Click            │
└──────────────────────┘
       ↓
┌──────────────────────┐
│   Event Handler      │
│   • Update state     │
│   • Trigger re-render│
└──────────────────────┘
       ↓
     Repeat

Component Unmounts
       ↓
Cleanup (useEffect cleanup)
```

---

This architecture document provides a complete view of the system's data flow, component interactions, and future scalability plans.
