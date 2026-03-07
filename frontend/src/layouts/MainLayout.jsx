import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  Compass,
  Building2,
  Calendar,
  MessageSquare,
  User,
  BookOpen,
  Award,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  Search,
  Users,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getNavigationItems = () => {
    const baseUrl = `/${user?.role}`;

    const navItems = {
      student: [
        { icon: LayoutDashboard, label: 'Dashboard', path: `${baseUrl}/dashboard` },
        { icon: Compass, label: 'Career Explorer', path: `${baseUrl}/careers` },
        { icon: Building2, label: 'College Directory', path: `${baseUrl}/colleges` },
        { icon: FileText, label: 'Assessment', path: `${baseUrl}/assessment` },
        { icon: Calendar, label: 'Timeline', path: `${baseUrl}/timeline` },
        { icon: BookOpen, label: 'Study Resources', path: `${baseUrl}/resources` },
        { icon: Award, label: 'Scholarships', path: `${baseUrl}/scholarships` },
        { icon: MessageSquare, label: 'AI Chatbot', path: `${baseUrl}/chatbot` },
        { icon: User, label: 'Profile', path: `${baseUrl}/profile` },
      ],
      admin: [
        { icon: LayoutDashboard, label: 'Dashboard', path: `${baseUrl}/dashboard` },
        { icon: Users, label: 'My Students', path: `${baseUrl}/students` },
        { icon: Calendar, label: 'Schedule', path: `${baseUrl}/schedule` },
        { icon: Compass, label: 'Manage Careers', path: `${baseUrl}/careers` },
        { icon: Building2, label: 'Manage Colleges', path: `${baseUrl}/colleges` },
        { icon: BookOpen, label: 'Manage Resources', path: `${baseUrl}/resources` },
        { icon: Award, label: 'Manage Scholarships', path: `${baseUrl}/scholarships` },
        { icon: Users, label: 'Manage Users', path: `${baseUrl}/users` },
        { icon: Settings, label: 'Settings', path: `${baseUrl}/settings` },
      ],
    };

    return navItems[user?.role] || [];
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed md:sticky top-0 left-0 h-screen w-64 glass-card border-r border-white/20 z-50 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">EduCareer</h1>
                    <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'hover:bg-white/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={user?.profile?.avatar || `https://i.pravatar.cc/150?img=${user?.id}`}
                  alt={user?.profile?.firstName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-100 text-red-600 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="glass-card border-b border-white/20 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-white/50 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="input-glass pl-10 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white/50 rounded-lg relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 hover:bg-white/50 rounded-lg"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </div>
  );
}
