import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Building2, BookOpen, Award, TrendingUp, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.stats(), adminAPI.users()])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data.users || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'blue' },
    { icon: Users, label: 'Students', value: stats.totalStudents, color: 'indigo' },
    { icon: Briefcase, label: 'Careers', value: stats.totalCareers, color: 'purple' },
    { icon: Award, label: 'Assessments Done', value: stats.assessmentsCompleted, color: 'green' },
    { icon: TrendingUp, label: 'Career Fields', value: stats.careerFields, color: 'yellow' },
  ] : [];

  const quickActions = [
    { icon: Briefcase, label: 'Manage Careers', path: '/admin/careers', color: 'blue' },
    { icon: Users, label: 'Manage Users', path: '/admin/users', color: 'purple' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage platform content and monitor activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 flex items-center justify-center mb-3`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-6"
      >
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="glass-card-hover p-6 text-center group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${action.color}-400 to-${action.color}-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium">{action.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-1 gap-6">
        {/* Registered Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Registered Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-white/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Role</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.email} className="hover:bg-white/30">
                      <td className="px-4 py-3 text-sm">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {u.profile?.firstName || '-'} {u.profile?.lastName || ''}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          u.assessmentStatus?.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {u.assessmentStatus?.completed ? 'Completed' : 'Not taken'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
