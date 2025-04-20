'use client';

import ProtectedRoute from '../components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        {children}
      </main>
    </ProtectedRoute>
  );
} 