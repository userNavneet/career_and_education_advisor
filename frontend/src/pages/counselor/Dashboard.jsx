import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, MessageSquare, Award } from 'lucide-react';

export default function CounselorDashboard() {
  const stats = [
    { icon: Users, label: 'My Students', value: '24', change: '+3', color: 'blue' },
    { icon: Calendar, label: 'Sessions Today', value: '5', change: '2 pending', color: 'purple' },
    { icon: MessageSquare, label: 'Messages', value: '12', change: '3 unread', color: 'green' },
    { icon: Award, label: 'Completions', value: '18', change: '75%', color: 'yellow' },
  ];

  const students = [
    {
      name: 'Alex Johnson',
      grade: '12th',
      progress: 85,
      lastSession: '2 days ago',
      status: 'On Track',
    },
    {
      name: 'Emma Smith',
      grade: '11th',
      progress: 62,
      lastSession: '1 week ago',
      status: 'Needs Attention',
    },
    {
      name: 'Michael Chen',
      grade: '12th',
      progress: 95,
      lastSession: 'Yesterday',
      status: 'Excellent',
    },
  ];

  const upcomingSessions = [
    { student: 'Alex Johnson', time: 'Today, 2:00 PM', topic: 'College Application Review' },
    { student: 'Emma Smith', time: 'Today, 4:00 PM', topic: 'Career Assessment Discussion' },
    { student: 'Sarah Williams', time: 'Tomorrow, 10:00 AM', topic: 'Scholarship Planning' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Counselor Dashboard</h1>
        <p className="text-gray-600">Guide and mentor your students</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
            <span className="text-xs text-blue-600 font-medium">{stat.change}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Students */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">My Students</h2>
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.name} className="glass-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.grade} Grade</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      student.status === 'Excellent'
                        ? 'bg-green-100 text-green-700'
                        : student.status === 'On Track'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {student.status}
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Profile Completion</span>
                    <span className="font-medium">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-gray-600">Last session: {student.lastSession}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
          <div className="space-y-3">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="glass-card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {session.student.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{session.student}</h3>
                    <p className="text-sm text-gray-600 mb-1">{session.time}</p>
                    <p className="text-sm">{session.topic}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary w-full mt-4">View Full Schedule</button>
        </motion.div>
      </div>
    </div>
  );
}
