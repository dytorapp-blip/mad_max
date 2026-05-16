import type { Metadata } from 'next';
import { AdminProvider } from '@/lib/context/AdminContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dytor Manager - Admin Dashboard',
  description: 'Comprehensive admin and infrastructure management system for Dytor',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="%232563eb" width="32" height="32"/><text x="50%" y="50%" font-size="18" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">DM</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
