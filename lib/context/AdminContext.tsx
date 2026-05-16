'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number | 'persistent';
  read?: boolean;
}

interface CurrentUser {
  id: string;
  name: string;
  role: string;
  email: string;
  permissions?: string[];
}

interface SystemStatus {
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  lastUpdate: Date;
}

interface AdminContextType {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => number;
  removeNotification: (id: number) => void;
  systemStatus: SystemStatus;
  setSystemStatus: (status: SystemStatus) => void;
  hasPermission: (permission: string) => boolean;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: 'admin_001',
    name: 'Admin User',
    role: 'administrator',
    email: 'admin@dytor.app',
    permissions: ['read:all', 'write:all', 'delete:all', 'manage:users', 'manage:teams']
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: 'online',
    uptime: '99.9%',
    lastUpdate: new Date()
  });

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);

    if (notification.duration !== 'persistent') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, notification.duration || 5000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const hasPermission = useCallback((permission: string) => {
    return currentUser.permissions?.includes(permission) ||
           currentUser.permissions?.includes('*');
  }, [currentUser.permissions]);

  const value: AdminContextType = {
    currentUser,
    setCurrentUser,
    notifications,
    addNotification,
    removeNotification,
    systemStatus,
    setSystemStatus,
    hasPermission
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
