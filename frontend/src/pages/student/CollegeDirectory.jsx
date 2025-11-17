import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, DollarSign, Users, Star, ExternalLink } from 'lucide-react';
import { colleges } from '../../data/mockColleges';

export default function CollegeDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredColleges = colleges.filter((college) => {
    const matchesSearch =
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || college.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">College Directory</h1>
        <p className="text-gray-600">Find the perfect college for your future</p>
      </div>

      {/* Search and Filters */}
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

      {/* Colleges Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredColleges.map((college, index) => (
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
              className="w-full h-48 object-cover rounded-lg mb-4"
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
  );
}
