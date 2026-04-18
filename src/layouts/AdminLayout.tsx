import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/src/components/admin/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
