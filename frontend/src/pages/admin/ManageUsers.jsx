import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trash2, Search, Loader2, ShieldCheck, GraduationCap } from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);

  const loadUsers = () => {
    adminAPI.users()
      .then((res) => setUsers(res.data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (email) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;
    setDeleting(email);
    try {
      await adminAPI.deleteUser(email);
      setUsers(users.filter((u) => u.email !== email));
    } catch {
      alert('Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.profile?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.profile?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentCount = users.filter((u) => u.role === 'student').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-gray-600">View registered users and manage accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{users.length}</h3>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{studentCount}</h3>
            <p className="text-sm text-gray-600">Students</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{adminCount}</h3>
            <p className="text-sm text-gray-600">Admins</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-glass pl-10 w-full"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Profile %</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Assessment</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((u, index) => (
                <motion.tr
                  key={u.email}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-white/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {(u.profile?.firstName?.[0] || u.email[0]).toUpperCase()}
                      </div>
                      <span className="font-medium">
                        {u.profile?.firstName || '-'} {u.profile?.lastName || ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          style={{ width: `${u.profileCompletion || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{u.profileCompletion || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      u.assessmentStatus?.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.assessmentStatus?.completed ? 'Completed' : 'Not taken'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'admin' ? (
                      <button
                        onClick={() => handleDelete(u.email)}
                        disabled={deleting === u.email}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600 disabled:opacity-50"
                        title="Delete user"
                      >
                        {deleting === u.email ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Protected</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No users match your search.' : 'No users found.'}
          </div>
        )}
      </div>
    </div>
  );
}
