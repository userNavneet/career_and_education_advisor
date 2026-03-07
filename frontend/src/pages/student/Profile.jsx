import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Target,
  Edit2,
  Save,
  X,
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...user?.profile,
    ...user?.academicInfo,
    interests: user?.interests?.join(', ') || '',
  });

  const handleSave = () => {
    updateProfile({
      profile: {
        ...user.profile,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
      },
      academicInfo: {
        ...user.academicInfo,
        grade: formData.grade,
        school: formData.school,
        gpa: formData.gpa,
      },
      interests: formData.interests.split(',').map((i) => i.trim()),
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <img
              src={user?.profile?.avatar || `https://i.pravatar.cc/150?img=${user?.id}`}
              alt={user?.profile?.firstName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-200 to-purple-200"
              onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'; e.target.className = 'w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500'; }}
            />
            <div>
              <h2 className="text-2xl font-bold">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-32 sm:w-48 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${user?.profileCompletion}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{user?.profileCompletion}% Complete</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
            className={isEditing ? 'btn-secondary' : 'btn-primary'}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold">Personal Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-glass w-full"
                />
              ) : (
                <p className="text-gray-700">{user?.profile?.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-glass w-full"
                />
              ) : (
                <p className="text-gray-700">{user?.profile?.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-glass w-full"
                />
              ) : (
                <p className="text-gray-700">{user?.profile?.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-glass w-full"
                />
              ) : (
                <p className="text-gray-700">{user?.profile?.address}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Academic Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-bold">Academic Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">School</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="input-glass w-full"
                />
              ) : (
                <p className="text-gray-700">{user?.academicInfo?.school}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grade</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="input-glass w-full"
                />
              ) : (
                <p className="text-gray-700">{user?.academicInfo?.grade}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">GPA</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.1"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                  className="input-glass w-full"
                />
              ) : (
                <p className="text-gray-700">{user?.academicInfo?.gpa}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SAT Score</label>
              <p className="text-gray-700">{user?.academicInfo?.satScore || 'Not taken'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ACT Score</label>
              <p className="text-gray-700">{user?.academicInfo?.actScore || 'Not taken'}</p>
            </div>
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-bold">Interests & Career Preferences</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Interests</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  className="input-glass w-full"
                  placeholder="Separate with commas"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user?.interests?.map((interest) => (
                    <span
                      key={interest}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preferred Career Fields</label>
              <div className="flex flex-wrap gap-2">
                {user?.careerPreferences?.fields?.map((field) => (
                  <span
                    key={field}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Assessment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-600" />
            <h3 className="text-xl font-bold">Assessment Status</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Career Assessment</span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  user?.assessmentStatus?.completed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {user?.assessmentStatus?.completed ? 'Completed' : 'Not Completed'}
              </span>
            </div>

            {user?.assessmentStatus?.completed && (
              <>
                <div>
                  <p className="text-sm font-medium mb-2">Top Career Fields:</p>
                  <div className="space-y-1">
                    {user.assessmentStatus.results?.topCategories?.map((field, index) => (
                      <div key={field} className="flex items-center gap-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <span className="text-sm">{field}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Last taken: {new Date(user.assessmentStatus.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-end"
        >
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </motion.div>
      )}
    </div>
  );
}
