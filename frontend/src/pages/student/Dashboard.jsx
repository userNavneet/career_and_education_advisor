import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  TrendingUp,
  MapPin,
  Target,
  Trophy,
  Calendar,
  BookOpen,
  FileText,
  ChevronRight,
  Star,
  Clock,
} from 'lucide-react';
import { careers } from '../../data/mockCareers';
import { colleges } from '../../data/mockColleges';
import { timelineEvents } from '../../data/mockScholarshipsAndResources';
import { studyResources } from '../../data/mockScholarshipsAndResources';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get recommended careers based on assessment
  const recommendedCareers = user?.assessmentStatus?.results?.recommendedCareers
    ? careers.filter((c) => user.assessmentStatus.results.recommendedCareers.includes(c.id))
    : careers.slice(0, 3);

  // Get nearby colleges (mock - first 3)
  const nearbyColleges = colleges.slice(0, 3);

  // Get upcoming events
  const upcomingEvents = timelineEvents
    .filter((e) => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  const quickLinks = [
    { icon: FileText, label: 'Take Assessment', path: '/student/assessment', color: 'blue' },
    { icon: Target, label: 'Explore Careers', path: '/student/careers', color: 'purple' },
    { icon: MapPin, label: 'Find Colleges', path: '/student/colleges', color: 'green' },
    { icon: BookOpen, label: 'Study Resources', path: '/student/resources', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.profile?.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              You're {user?.profileCompletion}% done with your profile. Let's complete it!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 56 * (1 - (user?.profileCompletion || 0) / 100)
                  }`}
                  className="text-blue-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{user?.profileCompletion}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <motion.button
            key={link.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(link.path)}
            className="glass-card-hover p-6 text-center group"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${link.color}-400 to-${link.color}-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
            >
              <link.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-medium">{link.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recommended Careers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold">Recommended for You</h2>
            </div>
            <button
              onClick={() => navigate('/student/careers')}
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recommendedCareers.map((career) => (
              <div
                key={career.id}
                className="glass-card p-4 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/student/careers')}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={career.image}
                    alt={career.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{career.title}</h3>
                    <p className="text-sm text-gray-600">{career.field}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {career.demandLevel}
                      </span>
                      <span className="text-xs text-gray-600">{career.averageSalary}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Nearby Colleges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold">Top Colleges</h2>
            </div>
            <button
              onClick={() => navigate('/student/colleges')}
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {nearbyColleges.map((college) => (
              <div
                key={college.id}
                className="glass-card p-4 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/student/colleges')}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{college.name}</h3>
                    <p className="text-sm text-gray-600">{college.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-600">Rank #{college.ranking}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">{college.type}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-bold">Achievements</h2>
          </div>

          <div className="space-y-3">
            {user?.achievements?.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl">
                  {achievement.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-gray-600">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold">Important Dates</h2>
            </div>
            <button
              onClick={() => navigate('/student/timeline')}
              className="text-blue-600 hover:underline text-sm"
            >
              View Timeline
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="glass-card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-red-700">
                      {new Date(event.date).toLocaleString('en', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-red-700">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{event.title}</h3>
                    <p className="text-xs text-gray-600">{event.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {Math.ceil(
                          (new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24)
                        )}{' '}
                        days left
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Study Resources Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold">Study Resources</h2>
          </div>
          <button
            onClick={() => navigate('/student/resources')}
            className="text-blue-600 hover:underline text-sm"
          >
            View All
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {studyResources.slice(0, 3).map((resource) => (
            <div key={resource.id} className="glass-card p-4 hover:shadow-lg transition-all">
              <h3 className="font-semibold mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
              <div className="flex flex-wrap gap-1">
                {resource.subjects.slice(0, 2).map((subject) => (
                  <span
                    key={subject}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
