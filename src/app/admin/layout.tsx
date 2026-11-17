import React from 'react';
import { getAdminSession } from '@/lib/auth';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export const metadata = {
  title: 'Admin Management Console | Desi Signs',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Session verification is handled in client or middleware; client layout wraps all admin routes
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

