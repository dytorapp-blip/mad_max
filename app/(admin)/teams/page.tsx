'use client';

import { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';

export default function TeamManagement() {
  const [teams] = useState([
    { id: 1, name: 'Engineering', members: 8, lead: 'John Doe', status: 'active', created: '2024-01-10' },
    { id: 2, name: 'Marketing', members: 5, lead: 'Jane Smith', status: 'active', created: '2024-01-15' },
    { id: 3, name: 'Sales', members: 6, lead: 'Mike Johnson', status: 'active', created: '2024-02-01' },
    { id: 4, name: 'Support', members: 4, lead: 'Sarah Williams', status: 'active', created: '2024-02-15' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Team Management</h2>
          <p className="text-gray-400">Organize and manage teams</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <FiPlus size={20} />
          Create Team
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiUsers size={24} className="text-white" />
              </div>
              <span className="bg-green-900 text-green-400 text-xs px-2 py-1 rounded border border-green-700">
                {team.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{team.name}</h3>
            <p className="text-gray-400 text-sm mb-4">Lead: {team.lead}</p>
            <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-700">
              <span className="text-gray-300 text-sm">{team.members} members</span>
              <span className="text-gray-400 text-xs">{team.created}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <FiEdit2 size={16} />
                Edit
              </button>
              <button className="flex-1 py-2 bg-gray-700 hover:bg-red-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <FiTrash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
