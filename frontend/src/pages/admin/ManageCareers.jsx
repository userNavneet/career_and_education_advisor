import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { careers } from '../../data/mockCareers';

export default function AdminCareers() {
  const [careersList, setCareersList] = useState(careers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    field: '',
    description: '',
    averageSalary: '',
    education: '',
    skills: '',
    growthRate: '',
    demandLevel: '',
  });

  const filteredCareers = careersList.filter((career) =>
    career.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCareer(null);
    setFormData({
      title: '',
      field: '',
      description: '',
      averageSalary: '',
      education: '',
      skills: '',
      growthRate: '',
      demandLevel: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (career) => {
    setEditingCareer(career);
    setFormData({
      ...career,
      skills: career.skills.join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this career?')) {
      setCareersList(careersList.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const careerData = {
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()),
      id: editingCareer?.id || Date.now(),
      image: editingCareer?.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    };

    if (editingCareer) {
      setCareersList(careersList.map((c) => (c.id === editingCareer.id ? careerData : c)));
    } else {
      setCareersList([...careersList, careerData]);
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Careers</h1>
          <p className="text-gray-600">Add, edit, or remove career information</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Career
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-6">
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
      </div>

      {/* Careers Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Field</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Salary Range</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Demand Level</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCareers.map((career, index) => (
                <motion.tr
                  key={career.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/30"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">{career.title}</div>
                  </td>
                  <td className="px-6 py-4">{career.field}</td>
                  <td className="px-6 py-4 text-sm">{career.averageSalary}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        career.demandLevel === 'Very High'
                          ? 'bg-green-100 text-green-700'
                          : career.demandLevel === 'High'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {career.demandLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(career)}
                        className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(career.id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingCareer ? 'Edit Career' : 'Add New Career'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Career Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-glass w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Field</label>
                  <input
                    type="text"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="input-glass w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-glass w-full"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Average Salary</label>
                  <input
                    type="text"
                    value={formData.averageSalary}
                    onChange={(e) => setFormData({ ...formData, averageSalary: e.target.value })}
                    className="input-glass w-full"
                    placeholder="$70,000 - $110,000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Growth Rate</label>
                  <input
                    type="text"
                    value={formData.growthRate}
                    onChange={(e) => setFormData({ ...formData, growthRate: e.target.value })}
                    className="input-glass w-full"
                    placeholder="7%"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Education Required</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="input-glass w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="input-glass w-full"
                  placeholder="Programming, Problem Solving, Algorithms"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Demand Level</label>
                <select
                  value={formData.demandLevel}
                  onChange={(e) => setFormData({ ...formData, demandLevel: e.target.value })}
                  className="input-glass w-full"
                  required
                >
                  <option value="">Select demand level</option>
                  <option value="Very High">Very High</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingCareer ? 'Update Career' : 'Add Career'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
