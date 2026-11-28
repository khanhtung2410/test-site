import Link from 'next/link';
import type { ReactNode } from 'react';
import { RoleSwitch } from '@/features/shared/components/RoleSwitch';

const navItems = [
  { href: '/admin/users', label: 'Người dùng' },
  { href: '/admin/users/u-1', label: 'Chi tiết tài khoản' },
];

const navClass =
  'flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm text-[var(--color-neutral-600)] hover:bg-[var(--color-primary-soft)]';

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <header className="border-b border-[var(--color-neutral-200)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
          <p className="text-sm font-medium text-[var(--color-neutral-900)]">{title}</p>
          <div className="ml-auto">
            <RoleSwitch current="admin" />
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row">
        <nav aria-label="Điều hướng quản trị" className="flex flex-wrap gap-1 md:w-56 md:flex-col">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navClass}>
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
