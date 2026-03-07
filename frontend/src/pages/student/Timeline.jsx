import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Filter, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fetchImportantTimeline } from '../../services/timeline';

export default function Timeline() {
  const [filterType, setFilterType] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchImportantTimeline()
      .then((data) => {
        if (active) setEvents(data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load important dates');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = useMemo(
    () => events.filter((event) => filterType === 'all' || event.category === filterType),
    [events, filterType]
  );

  const sortedEvents = useMemo(
    () => [...filteredEvents].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [filteredEvents]
  );

  const categories = useMemo(
    () => ['all', ...new Set(events.map((e) => e.category).filter(Boolean))],
    [events]
  );

  const getDaysUntil = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Important Dates</h1>
        <p className="text-gray-600">Entrance exams, scholarships, and admission deadlines</p>
      </div>

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
                {cat === 'all' ? 'All' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-600">Loading important dates...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !error && sortedEvents.length === 0 && (
        <div className="text-sm text-gray-600">
          No important dates found. Add exam/admission rows to `important_dates` collection or scholarship deadlines.
        </div>
      )}

      {!loading && !error && sortedEvents.length > 0 && (
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
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-20"
                >
                  <div
                    className={`absolute left-5 w-6 h-6 rounded-full ${
                      isPast ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    } border-4 border-white shadow-lg`}
                  ></div>

                  <div className={`glass-card p-6 ${isPast ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                        {event.notes && <p className="text-sm text-gray-600">{event.notes}</p>}
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {event.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span>
                          {isPast ? 'Passed' : daysUntil === 0 ? 'Today' : `${daysUntil} days left`}
                        </span>
                      </div>
                    </div>

                    {!isPast && daysUntil <= 10 && (
                      <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Deadline approaching</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
