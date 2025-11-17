# Career & Education Advisor Platform

A comprehensive web application designed to guide students through their career and educational journey. This platform provides personalized career assessments, college recommendations, scholarship information, and AI-powered guidance to help students make informed decisions about their future.

## 🌟 Features

### For Students
- **📊 Career Assessment** - Interactive quiz to discover career paths based on interests, skills, and preferences
- **💼 Career Explorer** - Browse and search through diverse career options with detailed information
- **🎓 College Directory** - Comprehensive database of colleges with filters, rankings, and admission details
- **📅 Timeline Manager** - Track important deadlines for applications, exams, and scholarships
- **🤖 AI Chatbot** - Get personalized career guidance and answers to education-related questions
- **👤 Profile Management** - Maintain academic records, test scores, and personal information
- **📚 Study Resources** - Access curated learning materials and test preparation resources
- **💰 Scholarships** - Discover funding opportunities with eligibility criteria and deadlines

### For Counselors
- **📈 Student Dashboard** - Monitor assigned students' progress and achievements
- **📆 Session Management** - Schedule and track counseling sessions
- **📊 Analytics** - View student completion rates and engagement metrics
- **💬 Communication** - Direct messaging with students

### For Administrators
- **⚙️ Content Management** - Full CRUD operations for careers, colleges, resources, and scholarships
- **👥 User Management** - Manage student, counselor, and admin accounts
- **📊 Platform Analytics** - Monitor system usage, user growth, and engagement
- **🔧 System Configuration** - Platform settings and customization options

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **Vite** - Fast build tool with Rolldown for optimal performance
- **React Router v6** - Client-side routing with protected routes
- **Tailwind CSS v3** - Utility-first CSS framework with custom glassmorphism theme
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon system
- **date-fns** - Date manipulation and formatting

### Backend (Planned)
- **Python** - Core backend language
- **Machine Learning Models** - For personalized career recommendations
- **RESTful API** - Backend API endpoints

## 📁 Project Structure

```
career_and_education_advisor/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   └── common/         # Shared components (ProtectedRoute)
│   │   ├── contexts/           # React Context providers (Auth)
│   │   ├── data/              # Mock data for development
│   │   │   ├── mockCareers.js
│   │   │   ├── mockColleges.js
│   │   │   ├── mockAssessments.js
│   │   │   ├── mockScholarshipsAndResources.js
│   │   │   └── mockUsers.js
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Page layouts (MainLayout)
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── auth/          # Login & Signup
│   │   │   ├── counselor/     # Counselor pages
│   │   │   └── student/       # Student pages (9 pages)
│   │   ├── services/          # API service layer (planned)
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main app component with routing
│   │   ├── index.css          # Global styles and Tailwind
│   │   └── main.jsx           # React entry point
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── package.json           # Dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── vite.config.js         # Vite configuration
├── backend/                    # Python backend (to be developed)
├── data/                       # Data files and ML models
├── models/                     # Machine learning models
└── README.md                   # This file
```

## 🎨 Design System

### Theme
- **Primary Colors**: Blue to Purple gradient (`from-blue-500 to-purple-600`)
- **Glass Morphism**: Frosted glass effect with backdrop blur
- **Responsive Design**: Mobile-first approach with breakpoints
- **Animations**: Smooth transitions using Framer Motion

### Custom Components
- `.glass-card` - Glassmorphism card with blur effect
- `.btn-primary` - Gradient button with hover effects
- `.input-glass` - Transparent input with glass styling
- `.text-gradient` - Gradient text effect

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/userNavneet/career_and_education_advisor.git
   cd career_and_education_advisor
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173/
   ```

### Demo Credentials

Test the application with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | student@example.com | student123 |
| Counselor | counselor@example.com | counselor123 |
| Admin | admin@example.com | admin123 |

## 📖 Usage Guide

### For Students

1. **Sign Up** - Create an account by selecting "Student" role
2. **Take Assessment** - Complete the 8-question career assessment quiz
3. **View Results** - Get personalized career and college recommendations
4. **Explore Careers** - Browse detailed career information with salary data
5. **Find Colleges** - Search colleges by location, type, and programs
6. **Track Deadlines** - Monitor important dates for applications
7. **Chat with AI** - Get instant answers to career questions
8. **Manage Profile** - Update academic information and track progress

### For Counselors

1. **Dashboard** - View all assigned students and their progress
2. **Schedule Sessions** - Plan and manage counseling appointments
3. **Track Progress** - Monitor student profile completion and assessments
4. **Provide Guidance** - Direct communication with students

### For Administrators

1. **Manage Content** - Add, edit, or remove careers, colleges, and resources
2. **User Management** - Oversee all platform users
3. **View Analytics** - Monitor platform usage and growth metrics
4. **System Settings** - Configure platform parameters

## 🔐 Authentication & Security

- **Role-Based Access Control (RBAC)** - Three user types with different permissions
- **Protected Routes** - Unauthorized access prevention
- **Client-Side Validation** - Form validation before submission
- **Local Storage** - Session persistence (to be replaced with secure tokens)

## 🎯 Key Pages

### Student Pages
1. **Dashboard** - Personalized overview with recommendations
2. **Assessment** - Interactive career assessment quiz
3. **Career Explorer** - Search and filter careers
4. **College Directory** - Browse colleges with details
5. **Timeline** - Track important deadlines
6. **AI Chatbot** - Chat interface for guidance
7. **Profile** - Manage personal and academic information
8. **Study Resources** - Access learning materials
9. **Scholarships** - Find funding opportunities

### Admin Pages
1. **Dashboard** - Platform statistics and recent activity
2. **Manage Careers** - CRUD operations for career data
3. **Manage Colleges** - CRUD operations for college data (planned)
4. **Manage Resources** - CRUD operations for study resources (planned)
5. **Manage Scholarships** - CRUD operations for scholarships (planned)
6. **User Management** - Manage all users (planned)

## 📊 Data Models

### Career
- Title, Field, Description
- Average Salary, Education Required
- Skills, Growth Rate, Demand Level
- Image URL

### College
- Name, Location, Type (Public/Private)
- Ranking, Tuition Fees
- Programs, Acceptance Rate
- Average SAT, Campus Size
- Image URL, Website

### Assessment
- 8 Questions across categories
- Multiple choice options with weighted scoring
- Maps to career fields (tech, healthcare, business, etc.)
- Generates top 3 recommended fields

### Scholarship
- Name, Provider, Amount
- Deadline, Eligibility
- Category (Merit-based, Need-based, Field-specific)
- Application Link

## 🔮 Future Enhancements

### Backend Development
- [ ] Python Flask/FastAPI backend
- [ ] PostgreSQL database
- [ ] JWT authentication
- [ ] RESTful API endpoints

### Machine Learning
- [ ] Career recommendation ML model
- [ ] College match algorithm
- [ ] Predictive analytics for student success

### Features
- [ ] Real-time notifications
- [ ] Document upload (transcripts, essays)
- [ ] Calendar integration
- [ ] Email reminders for deadlines
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Data visualization dashboards
- [ ] Export reports (PDF)

### Integrations
- [ ] College Board API
- [ ] CommonApp integration
- [ ] Scholarship databases
- [ ] Video conferencing for counseling
- [ ] Payment gateway for premium features

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Structure

- **Components** - Reusable UI components
- **Pages** - Route-based page components
- **Contexts** - Global state management
- **Utils** - Helper functions
- **Data** - Mock data for development

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern SaaS platforms
- Icons by [Lucide](https://lucide.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This project is currently in active development. The frontend is complete with mock data. Backend implementation with Python and ML models is planned for future releases.
