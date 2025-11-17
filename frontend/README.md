# EduGuide - Career & Education Advisor Frontend

A modern, glassmorphism-styled web application for career and education guidance built with React, Tailwind CSS, and Framer Motion.

## Features

### For Students
- 📊 **Dashboard** - View recommended careers, nearby colleges, achievements, and important deadlines
- 📝 **Career Assessment** - Take an interactive quiz to discover suitable career paths
- 🔍 **Career Explorer** - Browse and filter through various career options
- 🏫 **College Directory** - Search and explore colleges with detailed information
- 📅 **Timeline** - Track important admission and scholarship deadlines
- 🤖 **AI Chatbot** - Get personalized career guidance through AI
- 👤 **Profile** - Manage personal, academic, and career preference information
- 📚 **Study Resources** - Access free learning materials and test prep resources
- 🎓 **Scholarships** - Find and apply for scholarship opportunities

### For Counselors
- 📊 **Dashboard** - Monitor student progress and upcoming sessions
- 👥 **Student Management** - View and manage assigned students
- 📅 **Session Scheduling** - Organize counseling sessions

### For Administrators
- 📊 **Admin Dashboard** - View platform statistics and activity
- ✏️ **Content Management** - Add, edit, and delete careers, colleges, resources, and scholarships
- 👥 **User Management** - Manage platform users

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom glassmorphism theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State Management**: React Context API
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Demo Credentials

### Student Account
- Email: `student@example.com`
- Password: `student123`

### Counselor Account
- Email: `counselor@example.com`
- Password: `counselor123`

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (ProtectedRoute, etc.)
│   │   ├── student/         # Student-specific components
│   │   └── admin/           # Admin-specific components
│   ├── contexts/            # React Context providers (Auth, etc.)
│   ├── data/                # Mock data (will be replaced by API calls)
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components (MainLayout, etc.)
│   ├── pages/               # Page components
│   │   ├── auth/            # Login, Signup
│   │   ├── student/         # Student pages
│   │   ├── counselor/       # Counselor pages
│   │   └── admin/           # Admin pages
│   ├── services/            # API service layers (ready for backend integration)
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Design System

The app uses a custom glassmorphism design with:
- **Light color palette** with gradient backgrounds (blue-50 to pink-50)
- **Glass-effect cards** with backdrop blur and transparency
- **Smooth animations** powered by Framer Motion
- **Responsive design** that works on all devices
- **Modern UI components** with hover effects and transitions

## Future Enhancements

### Backend Integration (To be implemented)
- Replace mock data with API calls to Python backend
- Implement real authentication with JWT tokens
- Connect to ML models for personalized recommendations
- Real-time chat functionality with actual AI/ML models

### Internationalization
- Multi-language support (English, Spanish, French, German, Hindi, Mandarin, Arabic, Portuguese)
- RTL support for Arabic
- Language switcher in UI

### Additional Features
- Email notifications for deadlines
- Document upload for applications
- Video counseling sessions
- Advanced analytics and reporting
- Mobile app (React Native)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

See LICENSE file in the root directory.

---

Built with ❤️ for students seeking career guidance

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
