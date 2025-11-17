import { motion } from 'framer-motion';
import { Users, Briefcase, Building2, BookOpen, Award, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: 'Total Users', value: '1,234', change: '+12%', color: 'blue' },
    { icon: Briefcase, label: 'Careers', value: '150', change: '+5', color: 'purple' },
    { icon: Building2, label: 'Colleges', value: '500', change: '+23', color: 'green' },
    { icon: Award, label: 'Scholarships', value: '89', change: '+8', color: 'yellow' },
    { icon: BookOpen, label: 'Resources', value: '234', change: '+15', color: 'red' },
  ];

  const quickActions = [
    { icon: Briefcase, label: 'Add Career', path: '/admin/careers', color: 'blue' },
    { icon: Building2, label: 'Add College', path: '/admin/colleges', color: 'purple' },
    { icon: Award, label: 'Add Scholarship', path: '/admin/scholarships', color: 'green' },
    { icon: BookOpen, label: 'Add Resource', path: '/admin/resources', color: 'orange' },
  ];

  const recentActivity = [
    { action: 'New user registration', user: 'John Doe', time: '5 minutes ago' },
    { action: 'Career added', user: 'Admin', time: '1 hour ago' },
    { action: 'College updated', user: 'Admin', time: '2 hours ago' },
    { action: 'Scholarship published', user: 'Admin', time: '3 hours ago' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage platform content and monitor activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
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
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <span className="text-xs text-green-600 font-medium">{stat.change}</span>
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 glass-card">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-600">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">System Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Storage Used</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-[65%]"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">API Usage</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full w-[42%]"></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Users</span>
                <span className="text-lg font-bold text-blue-600">342</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Growth</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-lg font-bold text-green-600">+18%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
