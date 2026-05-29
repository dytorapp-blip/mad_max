'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiActivity,
  FiTarget,
  FiBarChart2,
  FiCreditCard,
  FiLogOut,
  FiBook,
  FiHelpCircle,
  FiAlertCircle,
} from 'react-icons/fi';

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard',        path: '/',              icon: FiHome       },
    { label: 'User Management',  path: '/users',         icon: FiUsers      },
    { label: 'Analytics',        path: '/analytics',     icon: FiBarChart2  },
    { label: 'Billing',          path: '/billing',       icon: FiCreditCard },
    { label: 'Teams',            path: '/teams',         icon: FiTarget     },
    { label: 'Appeals',          path: '/appeals',       icon: FiAlertCircle },
    { label: 'Infrastructure',   path: '/infrastructure',icon: FiActivity   },
    { label: 'Settings',         path: '/settings',      icon: FiSettings   },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <img src="/Dytor_logo_name.png" alt="Dytor" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Links */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase px-4 mb-2">
          Resources
        </p>
        <a
          href="https://docs.dytor.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
        >
          <FiBook size={18} />
          Documentation
        </a>
        <a
          href="https://support.dytor.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
        >
          <FiHelpCircle size={18} />
          Support
        </a>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
