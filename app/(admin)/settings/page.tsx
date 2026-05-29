'use client';

import { useState } from 'react';
import { FiAlertTriangle, FiTrash2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { errorsAPI } from '@/lib/api/endpoints';

type Toast = { type: 'success' | 'error'; message: string } | null;

export default function Settings() {
  const [clearingErrors, setClearingErrors] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleClearErrors() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setClearingErrors(true);
    setConfirmClear(false);
    try {
      const res = await errorsAPI.clearAll();
      showToast('success', `Deleted ${res.data.deleted ?? 0} error log${res.data.deleted !== 1 ? 's' : ''}.`);
    } catch {
      showToast('error', 'Failed to clear error logs.');
    } finally {
      setClearingErrors(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">System configuration and maintenance actions</p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-6 flex items-center gap-3 px-5 py-3 rounded-lg border text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          {toast.type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Read-only system info */}
      <div className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-900">
          <h2 className="text-base font-semibold text-white">System info</h2>
        </div>
        <div className="divide-y divide-slate-700">
          {[
            { label: 'Application', value: 'Dytor' },
            { label: 'Admin dashboard', value: 'dytor_man' },
            { label: 'Email provider', value: 'Resend' },
            { label: 'Database', value: 'Supabase (PostgreSQL)' },
            { label: 'Payments', value: 'Paystack' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-3">
              <span className="text-slate-400 text-sm">{label}</span>
              <span className="text-white text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-lg bg-red-950/20 border border-red-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-900/60 flex items-center gap-2">
          <FiAlertTriangle className="text-red-400" size={16} />
          <h2 className="text-base font-semibold text-red-300">Danger zone</h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-white text-sm font-medium mb-1">Clear error logs</p>
              <p className="text-slate-400 text-sm">
                Permanently deletes all error log entries from the database. This cannot be undone.
              </p>
            </div>
            <button
              onClick={handleClearErrors}
              disabled={clearingErrors}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                confirmClear
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
              }`}
            >
              <FiTrash2 size={14} />
              {confirmClear ? 'Confirm — clear all' : 'Clear logs'}
            </button>
          </div>
          {confirmClear && (
            <p className="mt-3 text-amber-400 text-xs">
              Click again to confirm. This will delete all error records permanently.{' '}
              <button
                onClick={() => setConfirmClear(false)}
                className="underline text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
