import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, DollarSign, GraduationCap, X } from 'lucide-react';
import { fetchCareers } from '../../services/careers';

export default function CareerExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchCareers()
      .then((data) => {
        if (active) setCareers(data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load careers');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const fields = useMemo(
    () => ['all', ...new Set(careers.map((c) => c.field).filter(Boolean))],
    [careers]
  );

  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      const search = searchTerm.toLowerCase();
      const skillMatch = (career.skills || []).some((skill) =>
        String(skill).toLowerCase().includes(search)
      );
      const selectedSkillMatch =
        !selectedSkill ||
        (career.skills || []).some((skill) => String(skill).toLowerCase() === selectedSkill.toLowerCase());
      const matchesSearch =
        career.title.toLowerCase().includes(search) ||
        career.description.toLowerCase().includes(search) ||
        skillMatch;
      const matchesField = selectedField === 'all' || career.field === selectedField;
      return matchesSearch && matchesField && selectedSkillMatch;
    });
  }, [careers, searchTerm, selectedField, selectedSkill]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Career Explorer</h1>
        <p className="text-gray-600">Discover careers that match your interests and skills</p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
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
        {selectedSkill && (
          <div className="mt-3 text-sm">
            <span className="mr-2 text-gray-600">Skill filter:</span>
            <button
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
              onClick={() => setSelectedSkill('')}
            >
              {selectedSkill} (clear)
            </button>
          </div>
        )}
      </div>

      {loading && <div className="text-sm text-gray-600">Loading careers...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedCareer(career)}
            className="glass-card-hover p-6 cursor-pointer"
          >
            {career.image ? (
              <img
                src={career.image}
                alt={career.title}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/1200x800/png?text=${encodeURIComponent(
                    career.title
                  )}`;
                }}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-40 rounded-lg bg-gray-200 mb-4" />
            )}
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
                {career.skills.slice(0, 6).map((skill) => (
                  <button
                    key={skill}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSkill(skill);
                    }}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {skill}
                  </button>
                ))}
                {career.skills.length > 6 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    +{career.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        </div>
      )}

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
            className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedCareer(null)}
              className="float-right p-2 hover:bg-white/50 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedCareer.image ? (
              <img
                src={selectedCareer.image}
                alt={selectedCareer.title}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/1200x800/png?text=${encodeURIComponent(
                    selectedCareer.title
                  )}`;
                }}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
            ) : (
              <div className="w-full h-48 rounded-lg bg-gray-200 mb-6" />
            )}

            <h2 className="text-3xl font-bold mb-2">{selectedCareer.title}</h2>
            <p className="text-gray-600 mb-6">{selectedCareer.field}</p>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">Description</h3>
                <p className="text-gray-700">{selectedCareer.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                  {selectedCareer.skills.slice(0, 20).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        setSelectedCareer(null);
                        setSelectedSkill(skill);
                      }}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {selectedCareer.skills.length > 20 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Showing top 20 skills
                  </p>
                )}
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
