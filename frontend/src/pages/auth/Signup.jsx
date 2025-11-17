import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, UserCircle } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Explore careers, colleges, and get personalized guidance',
      icon: '🎓',
    },
    {
      id: 'counselor',
      title: 'Counselor',
      description: 'Guide and mentor students in their career journey',
      icon: '👨‍🏫',
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Manage platform content and user accounts',
      icon: '⚙️',
    },
  ];

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup(formData);

    if (result.success) {
      const redirectMap = {
        student: '/student/dashboard',
        counselor: '/counselor/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(redirectMap[result.user.role] || '/');
    } else {
      setError(result.error || 'Signup failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 glass-card mb-4"
          >
            <GraduationCap className="w-10 h-10 text-blue-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Join EduGuide</h1>
          <p className="text-gray-600">Start your journey to the perfect career</p>
        </div>

        <div className="glass-card p-8">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Role</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className="glass-card p-6 text-center hover:shadow-glass-lg transition-all"
                  >
                    <div className="text-5xl mb-3">{role.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{role.title}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:underline font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Registration Form */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:underline mb-4 flex items-center gap-2"
              >
                ← Back to role selection
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center">
                Create Your {formData.role} Account
              </h2>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="input-glass pl-10"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="input-glass pl-10"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-glass pl-10"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-glass pl-10 pr-10"
                      placeholder="At least 6 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="input-glass pl-10"
                      placeholder="Re-enter password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
