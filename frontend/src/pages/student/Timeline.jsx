import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Filter, AlertCircle } from 'lucide-react';
import { timelineEvents } from '../../data/mockScholarshipsAndResources';
import { format } from 'date-fns';

export default function Timeline() {
  const [filterType, setFilterType] = useState('all');

  const filteredEvents = timelineEvents.filter(
    (event) => filterType === 'all' || event.category === filterType
  );

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const categories = ['all', ...new Set(timelineEvents.map((e) => e.category))];

  const getDaysUntil = (date) => {
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Important Timeline</h1>
        <p className="text-gray-600">Track deadlines for admissions and scholarships</p>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-glass"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Events' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-600"></div>

        <div className="space-y-6">
          {sortedEvents.map((event, index) => {
            const daysUntil = getDaysUntil(event.date);
            const isPast = daysUntil < 0;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-5 w-6 h-6 rounded-full ${
                    isPast ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  } border-4 border-white shadow-lg`}
                ></div>

                {/* Event Card */}
                <div className={`glass-card p-6 ${isPast ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        event.priority
                      )}`}
                    >
                      {event.priority}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>
                        {isPast
                          ? 'Passed'
                          : daysUntil === 0
                          ? 'Today'
                          : `${daysUntil} days left`}
                      </span>
                    </div>

                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {event.category}
                    </span>
                  </div>

                  {!isPast && daysUntil <= 7 && (
                    <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Deadline approaching!</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
