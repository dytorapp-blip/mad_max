'use client';

import { useEffect, useState } from 'react';
import { FiUsers, FiZap, FiBarChart2, FiAlertCircle, FiCheck, FiActivity } from 'react-icons/fi';
import { dashboardAPI, healthAPI } from '@/lib/api/endpoints';

const MetricCard = ({ label, value, icon: Icon, change }: any) => (
  <div className="rounded-lg bg-slate-800 border border-slate-700 p-6 hover:border-slate-600 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <Icon className="text-slate-500 text-lg" />
    </div>
    <p className="text-4xl font-bold text-white">{value}</p>
    {change && <p className="text-emerald-400 text-xs mt-2">{change}</p>}
  </div>
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async (isInitial = false) => {
      try {
        if (!isInitial) setRefreshing(true);
        const [dashData, healthData] = await Promise.all([
          dashboardAPI.getOverview(),
          healthAPI.getStatus(),
        ]);

        setMetrics(dashData.data);
        setHealth(healthData.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        if (isInitial) setError('Failed to load dashboard data');
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    };

    fetchDashboardData(true);
    const interval = setInterval(() => fetchDashboardData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-12 w-12 border-4 border-slate-700 border-t-blue-400 rounded-full"></div>
          </div>
          <p className="text-slate-400 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
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
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">
              Real-time SaaS operations overview
              {refreshing && (
                <span className="ml-2 text-slate-600 text-xs animate-pulse">· syncing…</span>
              )}
            </p>
          </div>
          {health && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700">
              <div className={`w-2 h-2 rounded-full ${
                health.status === 'healthy'
                  ? 'bg-emerald-500'
                  : health.status === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-slate-300 font-medium">
                <span className="text-slate-400">Status: </span>
                <span className="capitalize">{health.status}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Total Users"
            value={metrics.metrics?.totalUsers || 0}
            icon={FiUsers}
          />
          <MetricCard
            label="Daily Active Users"
            value={metrics.metrics?.dau || 0}
            icon={FiActivity}
          />
          <MetricCard
            label="Monthly Active Users"
            value={metrics.metrics?.mau || 0}
            icon={FiBarChart2}
          />
          <MetricCard
            label="Error Rate (24h)"
            value={`${(metrics.metrics?.errorRate || 0).toFixed(2)}%`}
            icon={FiZap}
          />
        </div>
      )}

      {/* Secondary Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg bg-slate-800 border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <p className="text-slate-400 text-sm font-medium mb-3">Active Rooms</p>
            <p className="text-3xl font-bold text-white">{metrics.metrics?.activeRooms || 0}</p>
          </div>

          <div className="rounded-lg bg-slate-800 border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <p className="text-slate-400 text-sm font-medium mb-3">Errors (24h)</p>
            <p className="text-3xl font-bold text-white">{metrics.metrics?.totalErrors24h || 0}</p>
          </div>

          <div className="rounded-lg bg-slate-800 border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <p className="text-slate-400 text-sm font-medium mb-3">Avg Response Time</p>
            <p className="text-3xl font-bold text-white">{health?.metrics?.avgLatencyMs || 0}ms</p>
          </div>
        </div>
      )}

      {/* Error Breakdown */}
      {metrics?.errors?.byType && metrics.errors.byType.length > 0 && (
        <div className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-900">
            <h3 className="text-lg font-bold text-white">Error Breakdown (24h)</h3>
          </div>
          <div className="p-6 space-y-4">
            {metrics.errors.byType.map((error: any, idx: number) => {
              const percentage = (error.count / (metrics.metrics?.totalErrors24h || 1)) * 100;

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm font-medium">{error.type}</span>
                    <span className="text-white font-bold text-sm">{error.count}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded h-2">
                    <div
                      className="bg-red-600 h-2 rounded transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Section */}
      {health?.alerts && health.alerts.length > 0 ? (
        <div className="rounded-lg bg-amber-950/30 border border-amber-900 p-6">
          <div className="flex items-start gap-4">
            <FiAlertCircle className="text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-bold mb-3">Active Alerts</h3>
              <ul className="space-y-2">
                {health.alerts.map((alert: string, idx: number) => (
                  <li key={idx} className="text-amber-300 text-sm">
                    • {alert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : health?.status === 'healthy' && (
        <div className="rounded-lg bg-emerald-950/30 border border-emerald-900 p-6 flex items-center gap-4">
          <FiCheck className="text-emerald-400 text-lg flex-shrink-0" />
          <div>
            <h3 className="text-emerald-300 font-bold">All Systems Operational</h3>
            <p className="text-emerald-400/70 text-sm mt-1">
              Your Dytor SaaS infrastructure is running smoothly
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
