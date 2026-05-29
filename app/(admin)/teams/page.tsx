'use client';

import { useEffect, useState } from 'react';
import {
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiAlertCircle,
} from 'react-icons/fi';
import { teamsAPI } from '@/lib/api/endpoints';

type Team = {
  id: string;
  name: string;
  ownerEmail: string;
  ownerName: string | null;
  tier: string;
  subscriptionStatus: string | null;
  nextBillingAt: string | null;
  memberCount: number;
  createdAt: string;
};

type Pagination = { page: number; limit: number; total: number; pages: number };

const TIER_COLORS: Record<string, string> = {
  starter: 'text-slate-400',
  flow: 'text-blue-400',
  apex: 'text-amber-400',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-emerald-900/40 text-emerald-300 border border-emerald-800',
  cancelled: 'bg-red-900/40 text-red-300 border border-red-800',
  downgrade_pending: 'bg-amber-900/40 text-amber-300 border border-amber-800',
};

const fmtDate = (s: string | null) =>
  s ? new Date(s).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [tierFilter, setTierFilter] = useState('all');

  async function fetchTeams(p = page, tier = tierFilter) {
    setLoading(true);
    setError(null);
    try {
      const res = await teamsAPI.getAll({ page: p, limit: 50, tier });
      setTeams(res.data.data);
      setPagination(res.data.pagination);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyTier(tier: string) {
    setTierFilter(tier);
    setPage(1);
    fetchTeams(1, tier);
  }

  function goPage(p: number) {
    setPage(p);
    fetchTeams(p);
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-950/30 border border-red-900 p-6 flex items-center gap-3">
          <FiAlertCircle className="text-red-400 text-xl flex-shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
          <p className="text-slate-400">
            {pagination ? `${pagination.total} workspace${pagination.total !== 1 ? 's' : ''}` : 'All workspaces'}
          </p>
        </div>
        <button
          onClick={() => fetchTeams()}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 rounded text-sm transition-colors disabled:opacity-50"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tier filter */}
      <div className="mb-5 flex items-center gap-3">
        <span className="text-slate-500 text-sm">Filter:</span>
        <div className="flex rounded border border-slate-700 overflow-hidden">
          {['all', 'flow', 'apex', 'starter'].map((t) => (
            <button
              key={t}
              onClick={() => applyTier(t)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                tierFilter === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'all' ? 'All tiers' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin mb-3">
              <div className="h-10 w-10 border-4 border-slate-700 border-t-blue-400 rounded-full" />
            </div>
            <p className="text-slate-400">Loading teams...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Team</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Owner</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Plan</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Members</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Next Billing</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {teams.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <FiUsers size={13} className="text-slate-400" />
                          </div>
                          <span className="text-white font-medium text-sm truncate max-w-[160px]">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-white text-sm truncate max-w-[180px]">{t.ownerName || t.ownerEmail}</p>
                        {t.ownerName && <p className="text-slate-500 text-xs truncate max-w-[180px]">{t.ownerEmail}</p>}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-semibold capitalize text-sm ${TIER_COLORS[t.tier] ?? 'text-white'}`}>
                          {t.tier}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {t.subscriptionStatus ? (
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_BADGE[t.subscriptionStatus] ?? 'bg-slate-700 text-slate-300'}`}>
                            {t.subscriptionStatus.replace('_', ' ')}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-300 text-sm">{t.memberCount}</td>
                      <td className="px-5 py-3 text-slate-400 text-sm">{fmtDate(t.nextBillingAt)}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{fmtDate(t.createdAt)}</td>
                    </tr>
                  ))}
                  {teams.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                        No teams found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="px-5 py-3 border-t border-slate-700 bg-slate-900 flex items-center justify-between">
                <p className="text-slate-400 text-sm">
                  {pagination.total} total · page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => goPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded border border-slate-600 text-sm transition-colors"
                  >
                    <FiChevronLeft size={14} />
                    Prev
                  </button>
                  <button
                    onClick={() => goPage(page + 1)}
                    disabled={page >= pagination.pages}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded border border-slate-600 text-sm transition-colors"
                  >
                    Next
                    <FiChevronRight size={14} />
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
