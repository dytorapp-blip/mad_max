'use client';

import { useEffect, useState } from 'react';
import { FiServer, FiDatabase, FiCpu, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiClock, FiUsers, FiActivity } from 'react-icons/fi';
import { infrastructureAPI } from '@/lib/api/endpoints';

type InfraData = {
  backend: {
    status: string;
    uptimeSeconds: number;
    nodeVersion: string;
    platform: string;
    memory: {
      rssmb: number;
      heapUsedMb: number;
      heapTotalMb: number;
      externalMb: number;
      systemTotalMb: number;
      systemFreeMb: number;
      systemUsedPct: number;
    };
  };
  database: {
    provider: string;
    status: 'connected' | 'error';
    latencyMs: number;
    error: string | null;
  };
  app: {
    totalUsers: number;
    activeRooms24h: number;
  };
};

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function ProgressBar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mt-1 w-full bg-slate-700 rounded-full h-2">
      <div className={`${colorClass} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function barColor(pct: number) {
  if (pct < 60) return 'bg-emerald-500';
  if (pct < 80) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function Infrastructure() {
  const [data, setData] = useState<InfraData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await infrastructureAPI.getLive();
      setData(res.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to load infrastructure data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Infrastructure</h1>
          <p className="text-slate-400">
            Live metrics from the running backend process
            {lastUpdated && (
              <span className="ml-2 text-slate-600 text-xs">
                · updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 rounded text-sm transition-colors disabled:opacity-50"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-950/30 border border-red-900 p-4 flex items-center gap-3">
          <FiAlertCircle className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {loading && !data && (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 border-4 border-slate-700 border-t-blue-400 rounded-full animate-spin" />
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Backend server */}
          <div className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-3">
              <FiServer className="text-blue-400" size={18} />
              <h2 className="text-lg font-bold text-white">Backend Server</h2>
              <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/40 text-emerald-300 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {data.backend.status}
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Uptime */}
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <FiClock size={13} />
                  Uptime
                </div>
                <p className="text-white font-bold text-xl">{formatUptime(data.backend.uptimeSeconds)}</p>
              </div>
              {/* Node version */}
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <FiActivity size={13} />
                  Node.js
                </div>
                <p className="text-white font-bold text-xl">{data.backend.nodeVersion}</p>
              </div>
              {/* Platform */}
              <div>
                <div className="text-slate-400 text-sm mb-1">Platform</div>
                <p className="text-white font-bold text-xl capitalize">{data.backend.platform}</p>
              </div>
              {/* Heap */}
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <FiCpu size={13} />
                  Heap used
                </div>
                <p className="text-white font-bold text-xl">{data.backend.memory.heapUsedMb} MB</p>
                <p className="text-slate-500 text-xs">of {data.backend.memory.heapTotalMb} MB</p>
              </div>
            </div>

            {/* Memory bars */}
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Process RSS</span>
                  <span className="text-white font-medium">{data.backend.memory.rssmb} MB</span>
                </div>
                <ProgressBar
                  value={data.backend.memory.rssmb}
                  max={data.backend.memory.systemTotalMb}
                  colorClass={barColor(Math.round((data.backend.memory.rssmb / data.backend.memory.systemTotalMb) * 100))}
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">System Memory</span>
                  <span className="text-white font-medium">{data.backend.memory.systemUsedPct}% used</span>
                </div>
                <ProgressBar
                  value={data.backend.memory.systemUsedPct}
                  max={100}
                  colorClass={barColor(data.backend.memory.systemUsedPct)}
                />
                <p className="text-slate-600 text-xs mt-1">
                  {data.backend.memory.systemFreeMb} MB free of {data.backend.memory.systemTotalMb} MB
                </p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Heap</span>
                  <span className="text-white font-medium">
                    {Math.round((data.backend.memory.heapUsedMb / data.backend.memory.heapTotalMb) * 100)}% used
                  </span>
                </div>
                <ProgressBar
                  value={data.backend.memory.heapUsedMb}
                  max={data.backend.memory.heapTotalMb}
                  colorClass={barColor(Math.round((data.backend.memory.heapUsedMb / data.backend.memory.heapTotalMb) * 100))}
                />
                <p className="text-slate-600 text-xs mt-1">
                  {data.backend.memory.heapUsedMb} / {data.backend.memory.heapTotalMb} MB
                </p>
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-3">
              <FiDatabase className="text-purple-400" size={18} />
              <h2 className="text-lg font-bold text-white">Database</h2>
              <span
                className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  data.database.status === 'connected'
                    ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800'
                    : 'bg-red-900/40 text-red-300 border-red-800'
                }`}
              >
                {data.database.status === 'connected' ? (
                  <FiCheckCircle size={11} />
                ) : (
                  <FiAlertCircle size={11} />
                )}
                {data.database.status}
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Provider</p>
                <p className="text-white font-bold">{data.database.provider}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Round-trip Latency</p>
                <p className={`font-bold text-xl ${data.database.latencyMs > 200 ? 'text-amber-400' : 'text-white'}`}>
                  {data.database.latencyMs} ms
                </p>
              </div>
              {data.database.error && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">Error</p>
                  <p className="text-red-300 text-sm">{data.database.error}</p>
                </div>
              )}
            </div>
          </div>

          {/* App stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                <FiUsers size={14} />
                Total Users
              </div>
              <p className="text-4xl font-bold text-white">{data.app.totalUsers.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                <FiActivity size={14} />
                Active Rooms (24h)
              </div>
              <p className="text-4xl font-bold text-white">{data.app.activeRooms24h.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
