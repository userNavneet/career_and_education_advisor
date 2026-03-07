import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, DollarSign, Users, Star, ExternalLink, Globe, Award, Briefcase } from 'lucide-react';
import { colleges as mockColleges } from '../../data/mockColleges';
import { collegesAPI } from '../../services/api';

export default function CollegeDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [backendColleges, setBackendColleges] = useState(null);
  const [filters, setFilters] = useState({ fields: [], states: [] });
  const [selectedField, setSelectedField] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [stats, setStats] = useState(null);

  // Try to load backend filters on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [filtersRes, statsRes] = await Promise.all([
          collegesAPI.getFilters(),
          collegesAPI.getStats(),
        ]);
        setFilters(filtersRes.data);
        setStats(statsRes.data);
        setBackendAvailable(true);
      } catch {
        setBackendAvailable(false);
      }
    };
    loadFilters();
  }, []);

  const handleBackendSearch = async () => {
    setLoading(true);
    try {
      const res = await collegesAPI.search({
        query: searchTerm,
        field: selectedField,
        state: selectedState,
        limit: 20,
      });
      setBackendColleges(res.data.colleges);
    } catch {
      setBackendColleges(null);
    } finally {
      setLoading(false);
    }
  };

  // Fallback: mock colleges filtered client-side
  const filteredMockColleges = mockColleges.filter((college) => {
    const matchesSearch =
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || college.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">College Directory</h1>
        <p className="text-gray-600">
          Find the perfect college for your future
          {stats && (
            <span className="ml-2 text-blue-600 font-medium">
              — {stats.totalColleges.toLocaleString()} colleges across {stats.totalStates} states
            </span>
          )}
        </p>
      </div>

      {/* AI Search (backend) */}
      {backendAvailable && (
        <div className="glass-card p-4 mb-4">
          <p className="text-sm font-medium text-blue-600 mb-3">🔍 AI-Powered Search (70,000+ colleges)</p>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. best engineering colleges in Delhi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBackendSearch()}
                className="input-glass pl-10 w-full"
              />
            </div>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="input-glass"
            >
              <option value="">All Fields</option>
              {filters.fields.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="input-glass"
            >
              <option value="">All States</option>
              {filters.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleBackendSearch}
            disabled={loading}
            className="btn-primary mt-3 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Colleges'}
          </button>
        </div>
      )}

      {/* Backend results */}
      {backendColleges && backendColleges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Search Results ({backendColleges.length} colleges)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {backendColleges.map((college, index) => (
              <motion.div
                key={`${college.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card-hover p-5"
              >
                <h3 className="font-bold text-lg mb-2">{college.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{college.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>{college.state}</span>
                  </div>
                  {college.field && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span className="truncate">{college.field}</span>
                    </div>
                  )}
                  {college.placement && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Placement: {college.placement}</span>
                    </div>
                  )}
                  {college.accreditation && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4 text-green-500" />
                      <span>{college.accreditation}</span>
                    </div>
                  )}
                </div>
                {college.website && (
                  <a
                    href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-3 text-sm"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {backendColleges && backendColleges.length === 0 && (
        <div className="glass-card p-6 mb-8 text-center text-gray-500">
          No colleges found for your search. Try different keywords or filters.
        </div>
      )}

      {/* Featured Colleges (mock data fallback / always show) */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          {backendAvailable ? 'Featured Colleges' : 'College Directory'}
        </h2>

        {!backendAvailable && (
          <div className="glass-card p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-glass pl-10 w-full"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input-glass pl-10 w-full"
                >
                  <option value="all">All Types</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {filteredMockColleges.map((college, index) => (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover p-6"
            >
            <img
              src={college.image}
              alt={college.name}
              className="w-full h-48 object-cover rounded-lg mb-4 bg-gradient-to-br from-green-100 to-blue-100"
              onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'; e.target.className = 'w-full h-48 rounded-lg mb-4 bg-gradient-to-br from-green-400 to-blue-500'; }}
            />

            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-xl mb-1">{college.name}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{college.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                <span className="text-sm font-semibold">#{college.ranking}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>{college.tuitionFees}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-blue-600" />
                <span>{college.studentCount} students</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Acceptance Rate:</span> {college.acceptanceRate}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Top Programs:</p>
              <div className="flex flex-wrap gap-2">
                {college.programs.slice(0, 3).map((program) => (
                  <span
                    key={program}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                  >
                    {program}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
    </div>
  );
}
