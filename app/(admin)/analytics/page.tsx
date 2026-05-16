'use client';

import { useEffect, useState } from 'react';
import { analyticsAPI } from '@/lib/api/endpoints';
import { FiTrendingUp, FiUsers, FiMessageSquare, FiActivity, FiBarChart2, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function Analytics() {
  const [usage, setUsage] = useState<any>(null);
  const [errors, setErrors] = useState<any>(null);
  const [rateLimits, setRateLimits] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [usageData, errorsData, rateLimitsData] = await Promise.all([
          analyticsAPI.getUsage(days),
          analyticsAPI.getErrors(24),
          analyticsAPI.getRateLimits(24),
        ]);

        setUsage(usageData.data);
        setErrors(errorsData.data);
        setRateLimits(rateLimitsData.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-950/30 border border-red-900 p-6 flex items-center gap-3">
          <FiAlertTriangle className="text-red-400" />
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Analytics</h1>
        <p className="text-slate-400 mb-6">Usage trends, errors, and rate limiting events</p>

        {/* Period Selector */}
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                days === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              Last {d} days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin mb-3">
            <div className="h-10 w-10 border-4 border-slate-700 border-t-blue-400 rounded-full"></div>
          </div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Usage Overview */}
          {usage && usage.data && usage.data.length > 0 && (
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-6">Usage Over Time</h3>
              <div className="space-y-4">
                {usage.data.map((day: any, idx: number) => {
                  const maxUsers =
                    Math.max(...usage.data.map((d: any) => d.activeUsers)) || 1;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{day.date}</span>
                        <span className="text-slate-400">
                          {day.activeUsers} users • {day.roomsCreated} rooms • {day.messagesSent} messages
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded h-2">
                        <div
                          className="bg-blue-600 h-2 rounded transition-all"
                          style={{
                            width: `${(day.activeUsers / maxUsers) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Metrics */}
          {errors && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Errors */}
              <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-medium mb-3">Total Errors (24h)</p>
                <p className="text-4xl font-bold text-white">{errors.total || 0}</p>
              </div>

              {/* Error Types */}
              <div className="lg:col-span-2 rounded-lg bg-slate-800 border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-medium mb-4">Top Error Types</p>
                <div className="space-y-3">
                  {errors.byType && errors.byType.slice(0, 5).map((err: any, idx: number) => {
                    const percentage = (err.count / (errors.total || 1)) * 100;

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{err.type}</span>
                          <span className="text-white font-medium">{err.count}</span>
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
            </div>
          )}

          {/* Rate Limit Events */}
          {rateLimits && (
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Rate Limit Breaches (24h)</h3>
                <span className="text-2xl font-bold text-orange-400">
                  {rateLimits.totalBreaches || 0}
                </span>
              </div>

              {rateLimits.byEndpoint && rateLimits.byEndpoint.length > 0 ? (
                <div className="space-y-3">
                  {rateLimits.byEndpoint.map((endpoint: any) => {
                    const percentage = (endpoint.breachCount / (rateLimits.totalBreaches || 1)) * 100;

                    return (
                      <div key={endpoint.endpoint} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{endpoint.endpoint}</span>
                          <span className="text-white font-medium">{endpoint.breachCount}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded h-2">
                          <div
                            className="bg-orange-600 h-2 rounded transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded bg-emerald-950/30 border border-emerald-900">
                  <FiCheckCircle className="text-emerald-400" size={18} />
                  <p className="text-emerald-300 text-sm">
                    No rate limit breaches in the last 24 hours
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Summary Cards */}
          {usage && usage.data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Users in Period */}
              <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-medium mb-3">Unique Users</p>
                <p className="text-4xl font-bold text-white">
                  {new Set(usage.data.map((d: any) => d.activeUsers)).size}
                </p>
              </div>

              {/* Total Rooms */}
              <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-medium mb-3">Rooms Created</p>
                <p className="text-4xl font-bold text-white">
                  {usage.data.reduce(
                    (sum: number, d: any) => sum + (d.roomsCreated || 0),
                    0
                  )}
                </p>
              </div>

              {/* Total Messages */}
              <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-medium mb-3">Messages Sent</p>
                <p className="text-4xl font-bold text-white">
                  {usage.data.reduce(
                    (sum: number, d: any) => sum + (d.messagesSent || 0),
                    0
                  )}
                </p>
              </div>

              {/* Avg Session Time */}
              <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-medium mb-3">Session Hours</p>
                <p className="text-4xl font-bold text-white">
                  {Math.round(
                    usage.data.reduce(
                      (sum: number, d: any) =>
                        sum + (d.sessionSeconds || 0),
                      0
                    ) / 3600
                  )}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
