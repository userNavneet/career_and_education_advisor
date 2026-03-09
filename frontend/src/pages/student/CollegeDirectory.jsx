import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Globe, Award, Briefcase, Star, ExternalLink, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { collegesAPI } from '../../services/api';

export default function CollegeDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [colleges, setColleges] = useState([]);
  const [filters, setFilters] = useState({ fields: [], states: [] });
  const [selectedField, setSelectedField] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 50;

  // Load filters and stats on mount
  useEffect(() => {
    Promise.all([collegesAPI.getFilters(), collegesAPI.getStats()])
      .then(([filtersRes, statsRes]) => {
        setFilters(filtersRes.data);
        setStats(statsRes.data);
      })
      .catch(() => {});
  }, []);

  const doSearch = useCallback(async (pg) => {
    setLoading(true);
    try {
      const res = await collegesAPI.search({
        query: searchTerm,
        field: selectedField,
        state: selectedState,
        limit: perPage,
        page: pg,
      });
      setColleges(res.data.colleges);
      setTotal(res.data.total);
      setPage(pg);
    } catch {
      setColleges([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedField, selectedState]);

  // Auto-search when filters change
  useEffect(() => {
    doSearch(1);
  }, [selectedField, selectedState]);

  const totalPages = Math.ceil(total / perPage);

  const handleSearch = () => doSearch(1);

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

      {/* Search & Filters */}
      <div className="glass-card p-4 mb-4">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location, field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          {total > 0 && (
            <span className="text-sm text-gray-600">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of{' '}
              <strong>{total.toLocaleString()}</strong> colleges
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg">Loading colleges...</span>
        </div>
      )}

      {/* Results */}
      {!loading && colleges.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {colleges.map((college, index) => (
              <motion.div
                key={`${college.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.5) }}
                className="glass-card-hover p-5"
              >
                <h3 className="font-bold text-lg mb-2">{college.name}</h3>
                <div className="space-y-2 text-sm">
                  {college.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{college.address}</span>
                    </div>
                  )}
                  {college.state && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span>{college.state}</span>
                    </div>
                  )}
                  {college.field && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{college.field}</span>
                    </div>
                  )}
                  {college.placement && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span>Placement: {college.placement}</span>
                    </div>
                  )}
                  {college.accreditation && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{college.accreditation}</span>
                    </div>
                  )}
                </div>
                {college.website ? (
                  <a
                    href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-3 text-sm"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 mt-3 text-sm text-gray-400 bg-gray-100 rounded-lg py-2 cursor-not-allowed">
                    Website Not Available
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="glass-card p-4 flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={() => doSearch(page - 1)}
                disabled={page <= 1 || loading}
                className="p-2 hover:bg-white/50 rounded-lg disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pg;
                if (totalPages <= 7) {
                  pg = i + 1;
                } else if (page <= 4) {
                  pg = i + 1;
                } else if (page >= totalPages - 3) {
                  pg = totalPages - 6 + i;
                } else {
                  pg = page - 3 + i;
                }
                return (
                  <button
                    key={pg}
                    onClick={() => doSearch(pg)}
                    disabled={loading}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      pg === page
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'hover:bg-white/50'
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}

              <button
                onClick={() => doSearch(page + 1)}
                disabled={page >= totalPages || loading}
                className="p-2 hover:bg-white/50 rounded-lg disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <span className="text-sm text-gray-500 ml-2">
                Page {page} of {totalPages.toLocaleString()}
              </span>
            </div>
          )}
        </>
      )}

      {!loading && colleges.length === 0 && (
        <div className="glass-card p-8 text-center text-gray-500">
          No colleges found. Try different filters or search terms.
        </div>
      )}
    </div>
  );
}
