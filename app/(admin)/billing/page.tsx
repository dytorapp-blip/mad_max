'use client';

import { useEffect, useState } from 'react';
import {
  FiUsers,
  FiCreditCard,
  FiTrendingUp,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import { billingAPI } from '@/lib/api/endpoints';

// ─── Types ────────────────────────────────────────────────────────────────────

type Overview = {
  totalUsers: number;
  tiers: { starter: number; flow: number; apex: number };
  totalPaid: number;
  estimatedMRR: number;
  recentActivations7d: number;
};

type Subscription = {
  id: string;
  teamId: string;
  teamName: string;
  ownerEmail: string;
  ownerName: string | null;
  tier: string;
  status: string;
  billingInterval: string;
  nextBillingAt: string | null;
  paystackReference: string | null;
  paystackCustomerCode: string | null;
  currentSeats: number;
  maxSeats: number;
  updatedAt: string;
};

type Pagination = { page: number; limit: number; total: number; pages: number };

type ActivityItem = {
  id: string;
  action: string;
  userEmail: string | null;
  userName: string | null;
  teamName: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('en-NG');

const fmtDate = (s: string | null) =>
  s
    ? new Date(s).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const fmtDateTime = (s: string) =>
  new Date(s).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const TIER_COLORS: Record<string, string> = {
  starter: 'text-slate-400',
  flow: 'text-blue-400',
  apex: 'text-amber-400',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-emerald-900/40 text-emerald-300 border border-emerald-800',
  cancelled: 'bg-red-900/40 text-red-300 border border-red-800',
  downgrade_pending: 'bg-amber-900/40 text-amber-300 border border-amber-800',
  suspended: 'bg-orange-900/40 text-orange-300 border border-orange-800',
};

const ACTION_LABELS: Record<string, string> = {
  web_checkout_initiated: 'Checkout started',
  subscription_activated: 'Subscription activated',
  subscription_cancelled: 'Cancelled',
  subscription_upgraded: 'Upgraded',
  subscription_downgrade_initiated: 'Downgrade scheduled',
  checkout_session_created: 'Checkout created',
};

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-6 ${
        accent
          ? 'bg-blue-950/30 border-blue-900'
          : 'bg-slate-800 border-slate-700'
      } hover:border-slate-600 transition-colors`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <Icon className={`text-lg ${accent ? 'text-blue-400' : 'text-slate-500'}`} />
      </div>
      <p className="text-4xl font-bold text-white">{value}</p>
      {sub && <p className="text-slate-400 text-xs mt-2">{sub}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  async function fetchAll(p = page, tier = tierFilter, status = statusFilter) {
    setLoading(true);
    setError(null);
    try {
      const [ovRes, subRes, actRes] = await Promise.all([
        billingAPI.getOverview(),
        billingAPI.getSubscriptions({ page: p, limit: 25, tier, status }),
        billingAPI.getActivity(30),
      ]);
      setOverview(ovRes.data);
      setSubs(subRes.data.data);
      setPagination(subRes.data.pagination);
      setActivity(actRes.data.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to load billing data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilter(tier: string, status: string) {
    setTierFilter(tier);
    setStatusFilter(status);
    setPage(1);
    fetchAll(1, tier, status);
  }

  function goPage(p: number) {
    setPage(p);
    fetchAll(p);
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
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Billing</h1>
          <p className="text-slate-400">Subscriptions, payments, and revenue</p>
        </div>
        <button
          onClick={() => fetchAll()}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 rounded text-sm transition-colors disabled:opacity-50"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Overview stats */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Users"
            value={fmt(overview.totalUsers)}
            icon={FiUsers}
          />
          <StatCard
            label="Paid Subscribers"
            value={fmt(overview.totalPaid)}
            sub={`${overview.tiers.flow} Flow · ${overview.tiers.apex} Apex`}
            icon={FiCreditCard}
            accent
          />
          <StatCard
            label="Estimated MRR"
            value={`₦${fmt(overview.estimatedMRR)}`}
            sub="Monthly recurring"
            icon={FiTrendingUp}
          />
          <StatCard
            label="New This Week"
            value={fmt(overview.recentActivations7d)}
            sub="Paid activations"
            icon={FiActivity}
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Subscriptions table */}
        <div className="xl:col-span-2">
          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Subscriptions</h2>
            <div className="flex flex-wrap gap-2">
              {/* Tier filter */}
              <div className="flex rounded border border-slate-700 overflow-hidden">
                {['all', 'flow', 'apex', 'starter'].map((t) => (
                  <button
                    key={t}
                    onClick={() => applyFilter(t, statusFilter)}
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
              {/* Status filter */}
              <div className="flex rounded border border-slate-700 overflow-hidden">
                {['all', 'active', 'cancelled'].map((s) => (
                  <button
                    key={s}
                    onClick={() => applyFilter(tierFilter, s)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                      statusFilter === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s === 'all' ? 'All status' : s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin mb-3">
                  <div className="h-10 w-10 border-4 border-slate-700 border-t-blue-400 rounded-full" />
                </div>
                <p className="text-slate-400">Loading subscriptions...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900 border-b border-slate-700">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">User</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Plan</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Next Billing</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {subs.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="px-5 py-3">
                            <p className="text-white font-medium text-sm truncate max-w-[180px]">
                              {s.ownerName || s.ownerEmail}
                            </p>
                            {s.ownerName && (
                              <p className="text-slate-500 text-xs truncate max-w-[180px]">{s.ownerEmail}</p>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`font-semibold capitalize ${TIER_COLORS[s.tier] ?? 'text-white'}`}>
                              {s.tier}
                            </span>
                            <p className="text-slate-500 text-xs capitalize">{s.billingInterval}</p>
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${
                                STATUS_BADGE[s.status] ?? 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {s.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-400 text-sm">{fmtDate(s.nextBillingAt)}</td>
                          <td className="px-5 py-3 text-slate-500 text-xs">{fmtDate(s.updatedAt)}</td>
                        </tr>
                      ))}
                      {subs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                            No subscriptions found.
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

        {/* Recent billing activity */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-white">Recent Activity</h2>
          <div className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
            {loading ? (
              <div className="p-6 text-center text-slate-500">Loading...</div>
            ) : (
              <ul className="divide-y divide-slate-700">
                {activity.map((a) => (
                  <li key={a.id} className="px-4 py-3 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium leading-snug">
                          {ACTION_LABELS[a.action] ?? a.action}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5 truncate">
                          {a.userEmail ?? '—'}
                        </p>
                        {a.metadata && (
                          <p className="text-slate-600 text-xs mt-0.5">
                            {[
                              (a.metadata as any).tier && `${(a.metadata as any).tier}`,
                              (a.metadata as any).interval && `${(a.metadata as any).interval}`,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 text-slate-600 text-xs">{fmtDateTime(a.createdAt)}</p>
                    </div>
                  </li>
                ))}
                {activity.length === 0 && (
                  <li className="px-4 py-8 text-center text-slate-500">No billing activity yet.</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
