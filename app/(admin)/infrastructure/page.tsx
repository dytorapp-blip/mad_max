'use client';

import { useState } from 'react';
import { FiServer, FiHardDrive, FiWifi, FiMonitor } from 'react-icons/fi';

export default function Infrastructure() {
  const [servers] = useState([
    {
      id: 1,
      name: 'API Server 1',
      status: 'healthy',
      cpu: 65,
      memory: 42,
      storage: 78,
      uptime: '99.9%',
      region: 'US-East-1'
    },
    {
      id: 2,
      name: 'API Server 2',
      status: 'healthy',
      cpu: 58,
      memory: 35,
      storage: 72,
      uptime: '99.8%',
      region: 'US-West-2'
    },
    {
      id: 3,
      name: 'Database Server',
      status: 'healthy',
      cpu: 45,
      memory: 82,
      storage: 85,
      uptime: '99.95%',
      region: 'US-East-1'
    },
    {
      id: 4,
      name: 'Cache Server',
      status: 'warning',
      cpu: 88,
      memory: 76,
      storage: 62,
      uptime: '98.5%',
      region: 'US-West-2'
    }
  ]);

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return 'bg-green-900 text-green-400';
    if (status === 'warning') return 'bg-yellow-900 text-yellow-400';
    return 'bg-red-900 text-red-400';
  };

  const getProgressColor = (value: number) => {
    if (value < 50) return 'bg-green-600';
    if (value < 80) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Infrastructure Monitoring</h2>
        <p className="text-gray-400">Monitor and manage your infrastructure resources</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: FiServer, label: 'Total Servers', value: '4', color: 'text-blue-400' },
          { icon: FiHardDrive, label: 'Storage Used', value: '74.3 TB', color: 'text-green-400' },
          { icon: FiWifi, label: 'Data In/Out', value: '2.5 Gbps', color: 'text-purple-400' },
          { icon: FiMonitor, label: 'Avg CPU', value: '64%', color: 'text-orange-400' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <Icon className={`${stat.color} text-2xl`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Servers Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Server Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Server</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Region</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">CPU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Memory</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Storage</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {servers.map((server: any) => (
                <tr key={server.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{server.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                      {server.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{server.region}</td>
                  <td className="px-6 py-4">
                    <div className="w-20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300 text-sm">{server.cpu}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className={`${getProgressColor(server.cpu)} h-2 rounded-full`} style={{ width: `${server.cpu}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300 text-sm">{server.memory}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className={`${getProgressColor(server.memory)} h-2 rounded-full`} style={{ width: `${server.memory}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300 text-sm">{server.storage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className={`${getProgressColor(server.storage)} h-2 rounded-full`} style={{ width: `${server.storage}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{server.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
