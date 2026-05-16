'use client';

import { useState } from 'react';
import { FiMenu, FiBell, FiUser, FiLogOut, FiSettings, FiX } from 'react-icons/fi';
import { useAdmin } from '@/lib/context/AdminContext';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ onMenuClick, isSidebarOpen }: HeaderProps) => {
  const { currentUser, notifications } = useAdmin();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <img src="/Dytor_icon.png" alt="Dytor" className="h-6 w-auto" />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-xs flex items-center justify-center rounded-full font-bold">
                  {unreadCount > 9 ? '9' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 bg-slate-900 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="p-1 hover:bg-slate-700 rounded"
                  >
                    <FiX size={16} className="text-slate-400" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-2 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition-colors"
                    >
                      <p className="text-sm text-slate-200">{notif.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-slate-400">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium text-slate-200 hidden sm:block">
                {currentUser?.name || 'Admin'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 bg-slate-900">
                  <p className="text-sm font-semibold text-white">{currentUser?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400 mt-1">{currentUser?.email || 'admin@dytor.app'}</p>
                  <span className="inline-block text-xs text-blue-400 font-semibold mt-2">
                    {currentUser?.role || 'Administrator'}
                  </span>
                </div>
                <div className="p-1 space-y-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors">
                    <FiUser size={16} />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors">
                    <FiSettings size={16} />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors border-t border-slate-700 mt-1 pt-1">
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
