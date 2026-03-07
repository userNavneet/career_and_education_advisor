import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, DollarSign, Calendar, ExternalLink, Bookmark } from 'lucide-react';
import { scholarships } from '../../data/mockScholarshipsAndResources';

export default function Scholarships() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(scholarships.map((s) => s.category))];

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || scholarship.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Scholarships</h1>
        <p className="text-gray-600">Find funding opportunities for your education</p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glass pl-10 w-full"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-glass pl-10 w-full"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scholarships Grid */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {filteredScholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-hover p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-xl mb-1">{scholarship.name}</h3>
                <p className="text-sm text-gray-600">{scholarship.provider}</p>
              </div>
              <button className="p-2 hover:bg-white/50 rounded-lg">
                <Bookmark className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-700 mb-4">{scholarship.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">{scholarship.amount}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                <span className="text-sm">
                  Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                </span>
              </div>

              <div className="text-sm">
                <span className="font-medium">Category:</span>
                <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                  {scholarship.category}
                </span>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium mb-1">Eligibility:</p>
              <p className="text-sm text-gray-700">{scholarship.eligibility}</p>
            </div>

            <a
              href={scholarship.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
