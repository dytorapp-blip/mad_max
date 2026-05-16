'use client';

import { useEffect, useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUsers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { userAPI } from '@/lib/api/endpoints';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getAll(page, 50);
        setUsers(response.data.data);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const getStatusColor = (lastActivity: Date | null) => {
    if (!lastActivity) return 'bg-slate-700 text-slate-300';
    const hoursSinceActivity =
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60);
    if (hoursSinceActivity < 24) return 'bg-emerald-700 text-emerald-100';
    if (hoursSinceActivity < 7 * 24) return 'bg-amber-700 text-amber-100';
    return 'bg-slate-700 text-slate-300';
  };

  const getStatusLabel = (lastActivity: Date | null) => {
    if (!lastActivity) return 'Inactive';
    const hoursSinceActivity =
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60);
    if (hoursSinceActivity < 24) return 'Active';
    if (hoursSinceActivity < 7 * 24) return 'Away';
    return 'Inactive';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLastActivity = (date: Date | null) => {
    if (!date) return 'Never';
    const now = Date.now();
    const then = new Date(date).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-950/30 border border-red-900 p-6">
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-slate-400">
          Manage all {pagination?.total || 0} users and their activity
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin mb-3">
              <div className="h-10 w-10 border-4 border-slate-700 border-t-blue-400 rounded-full"></div>
            </div>
            <p className="text-slate-400">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                      Rooms
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-3 text-white font-medium">{user.name}</td>
                      <td className="px-6 py-3 text-slate-300 text-sm">{user.email}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            user.lastActivity
                          )}`}
                        >
                          {getStatusLabel(user.lastActivity)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-400 text-sm">
                        {formatDate(user.joinedAt)}
                      </td>
                      <td className="px-6 py-3 text-slate-400 text-sm">
                        {formatLastActivity(user.lastActivity)}
                      </td>
                      <td className="px-6 py-3 text-slate-300 text-sm">
                        <span className="text-blue-400 font-medium">
                          {user.roomsOwned}
                        </span>
                        /{user.roomsJoined}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors">
                            <FiEdit2 size={16} />
                          </button>
                          <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="px-6 py-3 border-t border-slate-700 bg-slate-900 flex items-center justify-between">
                <p className="text-slate-400 text-sm">
                  Showing {(page - 1) * 50 + 1} to{' '}
                  {Math.min(page * 50, pagination.total)} of {pagination.total}{' '}
                  users
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded border border-slate-600 transition-colors"
                  >
                    <FiChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPage(Math.min(pagination.pages, page + 1))
                    }
                    disabled={page === pagination.pages}
                    className="p-1.5 flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded border border-slate-600 transition-colors"
                  >
                    Next
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
