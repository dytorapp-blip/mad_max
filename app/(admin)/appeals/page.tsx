'use client';

import { useEffect, useState } from 'react';
import {
  FiCheck,
  FiX,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { appealsAPI } from '@/lib/api/endpoints';

type Appeal = {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  createdAt: string;
  reviewedAt: string | null;
  adminNotes: string | null;
  user: { id: string; email: string; fullName: string | null };
};

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-900/40 text-amber-300 border border-amber-800',
  approved: 'bg-emerald-900/40 text-emerald-300 border border-emerald-800',
  rejected: 'bg-red-900/40 text-red-300 border border-red-800',
};

const fmtDateTime = (s: string) =>
  new Date(s).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function AppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'all'>('pending');

  // Per-row state for expanded reason + resolve UI
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [resolving, setResolving] = useState<Record<string, boolean>>({});

  async function fetchAppeals(filter = statusFilter) {
    setLoading(true);
    setError(null);
    try {
      const res = await appealsAPI.getAll(filter);
      setAppeals(res.data.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to load appeals');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilter(f: 'pending' | 'all') {
    setStatusFilter(f);
    fetchAppeals(f);
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function resolve(appeal: Appeal, status: 'approved' | 'rejected') {
    setResolving((prev) => ({ ...prev, [appeal.id]: true }));
    try {
      await appealsAPI.resolve(appeal.id, status, notes[appeal.id] || undefined);
      setAppeals((prev) =>
        prev.map((a) =>
          a.id === appeal.id
            ? { ...a, status, reviewedAt: new Date().toISOString(), adminNotes: notes[appeal.id] || null }
            : a
        )
      );
      setExpanded((prev) => ({ ...prev, [appeal.id]: false }));
    } catch (err: any) {
      alert(err?.response?.data?.error ?? 'Failed to resolve appeal');
    } finally {
      setResolving((prev) => ({ ...prev, [appeal.id]: false }));
    }
  }

  const pendingCount = appeals.filter((a) => a.status === 'pending').length;

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
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Appeals</h1>
          <p className="text-slate-400">
            {statusFilter === 'pending'
              ? `${pendingCount} pending review${pendingCount !== 1 ? 's' : ''}`
              : `${appeals.length} total appeal${appeals.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => fetchAppeals()}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 rounded text-sm transition-colors disabled:opacity-50"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-800">
        {(['pending', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => applyFilter(f)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
              statusFilter === f
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {f === 'all' ? 'All appeals' : 'Pending'}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin mb-3">
            <div className="h-10 w-10 border-4 border-slate-700 border-t-blue-400 rounded-full" />
          </div>
          <p className="text-slate-400">Loading appeals...</p>
        </div>
      ) : appeals.length === 0 ? (
        <div className="rounded-lg bg-slate-800 border border-slate-700 p-12 text-center">
          <FiCheck className="mx-auto text-emerald-400 text-3xl mb-3" />
          <p className="text-white font-medium mb-1">
            {statusFilter === 'pending' ? 'No pending appeals' : 'No appeals yet'}
          </p>
          <p className="text-slate-500 text-sm">
            {statusFilter === 'pending' ? 'All caught up.' : 'Appeals will appear here when users submit them.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {appeals.map((appeal) => {
            const isExpanded = expanded[appeal.id] ?? false;
            const isPending = appeal.status === 'pending';
            const isResolving = resolving[appeal.id] ?? false;

            return (
              <div
                key={appeal.id}
                className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden"
              >
                {/* Row summary */}
                <div
                  onClick={() => toggleExpand(appeal.id)}
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize flex-shrink-0 ${
                        STATUS_BADGE[appeal.status]
                      }`}
                    >
                      {appeal.status}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {appeal.user.fullName || appeal.user.email}
                      </p>
                      <p className="text-slate-500 text-xs truncate">{appeal.user.email}</p>
                    </div>
                    <p className="text-slate-400 text-sm truncate max-w-xs hidden md:block">
                      {appeal.reason.length > 80 ? appeal.reason.slice(0, 80) + '…' : appeal.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <p className="text-slate-500 text-xs hidden sm:block">{fmtDateTime(appeal.createdAt)}</p>
                    {isExpanded ? (
                      <FiChevronUp className="text-slate-500" size={16} />
                    ) : (
                      <FiChevronDown className="text-slate-500" size={16} />
                    )}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-slate-700 px-5 py-4 space-y-4">
                    {/* Full reason */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Appeal reason</p>
                      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{appeal.reason}</p>
                    </div>

                    {/* Admin notes if already resolved */}
                    {!isPending && appeal.adminNotes && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Admin note</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{appeal.adminNotes}</p>
                      </div>
                    )}

                    {appeal.reviewedAt && (
                      <p className="text-slate-600 text-xs">
                        Reviewed {fmtDateTime(appeal.reviewedAt)}
                      </p>
                    )}

                    {/* Resolve controls (only for pending) */}
                    {isPending && (
                      <div className="space-y-3 pt-2 border-t border-slate-700">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                            Note to user (optional)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Leave a note that will be emailed to the user…"
                            value={notes[appeal.id] ?? ''}
                            onChange={(e) =>
                              setNotes((prev) => ({ ...prev, [appeal.id]: e.target.value }))
                            }
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-slate-500 resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => resolve(appeal, 'approved')}
                            disabled={isResolving}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <FiCheck size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => resolve(appeal, 'rejected')}
                            disabled={isResolving}
                            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <FiX size={14} />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
