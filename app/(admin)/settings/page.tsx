'use client';

import { useState } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    appName: 'Dytor Manager',
    appVersion: '1.0.0',
    emailFrom: 'noreply@dytor.app',
    emailSmtp: 'smtp.dytor.app',
    emailPort: '587',
    enableTwoFA: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    backupFrequency: 'daily',
    logRetention: 90,
  });

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'email', label: 'Email Configuration' },
    { id: 'security', label: 'Security' },
    { id: 'backup', label: 'Backup & Recovery' },
  ];

  const handleSave = () => {
    console.log('Settings saved:', settings);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Manage system configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Application Name</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Version</label>
              <input
                type="text"
                value={settings.appVersion}
                readOnly
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">From Email Address</label>
              <input
                type="email"
                value={settings.emailFrom}
                onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Server</label>
              <input
                type="text"
                value={settings.emailSmtp}
                onChange={(e) => setSettings({ ...settings, emailSmtp: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Port</label>
              <input
                type="number"
                value={settings.emailPort}
                onChange={(e) => setSettings({ ...settings, emailPort: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Test Email Connection
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <label className="text-sm font-medium text-gray-300">Enable Two-Factor Authentication</label>
              <input
                type="checkbox"
                checked={settings.enableTwoFA}
                onChange={(e) => setSettings({ ...settings, enableTwoFA: e.target.checked })}
                className="w-5 h-5 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Login Attempts</label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-600"
              >
                <option>hourly</option>
                <option>daily</option>
                <option>weekly</option>
                <option>monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Log Retention (days)</label>
              <input
                type="number"
                value={settings.logRetention}
                onChange={(e) => setSettings({ ...settings, logRetention: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <FiRefreshCw size={16} />
              Run Backup Now
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            <FiSave size={18} />
            Save Settings
          </button>
          <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
