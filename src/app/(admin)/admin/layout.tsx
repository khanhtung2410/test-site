import type { ReactNode } from 'react';
import { AdminShell } from '@/features/admin/components/AdminShell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell title="Admin">{children}</AdminShell>;
}
