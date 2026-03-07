import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, DollarSign, GraduationCap, X, Star, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { careersAPI } from '../../services/api';

export default function CareerExplorer() {
  const { user } = useAuth();
  const [allCareers, setAllCareers] = useState([]);
  const [fields, setFields] = useState(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  const topCategories = user?.assessmentStatus?.results?.topCategories || [];

  useEffect(() => {
    Promise.all([careersAPI.list(), careersAPI.fields()])
      .then(([careersRes, fieldsRes]) => {
        setAllCareers(careersRes.data.careers || []);
        setFields(['all', ...(fieldsRes.data.fields || [])]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredCareers = allCareers.filter((career) => {
    const matchesSearch =
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === 'all' || career.field === selectedField;
    return matchesSearch && matchesField;
  });

  const recommendedCareers = topCategories.length > 0
    ? allCareers.filter((c) => topCategories.includes(c.field))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Loading careers...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Career Explorer</h1>
        <p className="text-gray-600">Discover careers that match your interests and skills</p>
      </div>

      {/* Recommended for You */}
      {recommendedCareers.length > 0 && selectedField === 'all' && !searchTerm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-bold">Recommended for You</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCareers.slice(0, 6).map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCareer(career)}
                className="glass-card p-4 cursor-pointer hover:shadow-lg transition-all border-2 border-yellow-200"
              >
                <div className="flex items-start gap-3">
                  <img src={career.image} alt={career.title} className="w-14 h-14 rounded-lg object-cover bg-gradient-to-br from-blue-100 to-purple-100" onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'; e.target.className = 'w-14 h-14 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500'; }} />
                  <div className="flex-1">
                    <h3 className="font-bold">{career.title}</h3>
                    <p className="text-sm text-gray-600">{career.field}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{career.demandLevel}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glass pl-10 w-full"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="input-glass pl-10 w-full"
            >
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field === 'all' ? 'All Fields' : field}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Careers Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCareers.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedCareer(career)}
            className="glass-card-hover p-6 cursor-pointer"
          >
            <img
              src={career.image}
              alt={career.title}
              className="w-full h-40 object-cover rounded-lg mb-4 bg-gradient-to-br from-blue-100 to-purple-100"
              onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'; e.target.className = 'w-full h-40 rounded-lg mb-4 bg-gradient-to-br from-blue-400 to-purple-500'; }}
            />
            <h3 className="font-bold text-lg mb-2">{career.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{career.field}</p>
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{career.description}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>{career.averageSalary}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Growth: {career.growthRate}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {career.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Career Detail Modal */}
      {selectedCareer && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCareer(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedCareer(null)}
              className="float-right p-2 hover:bg-white/50 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={selectedCareer.image}
              alt={selectedCareer.title}
              className="w-full h-48 object-cover rounded-lg mb-6 bg-gradient-to-br from-blue-100 to-purple-100"
              onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'; e.target.className = 'w-full h-48 rounded-lg mb-6 bg-gradient-to-br from-blue-400 to-purple-500'; }}
            />

            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{selectedCareer.title}</h2>
            <p className="text-gray-600 mb-6">{selectedCareer.field}</p>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">Description</h3>
                <p className="text-gray-700">{selectedCareer.description}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <h4 className="font-semibold mb-2">Average Salary</h4>
                  <p className="text-green-600 font-bold">{selectedCareer.averageSalary}</p>
                </div>
                <div className="glass-card p-4">
                  <h4 className="font-semibold mb-2">Growth Rate</h4>
                  <p className="text-blue-600 font-bold">{selectedCareer.growthRate}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">
                  <GraduationCap className="w-5 h-5 inline mr-2" />
                  Education Required
                </h3>
                <p className="text-gray-700">{selectedCareer.education}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="font-semibold">Demand Level:</p>
                <p className="text-lg font-bold text-blue-600">{selectedCareer.demandLevel}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
