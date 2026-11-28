'use client';

import { useRouter } from 'next/navigation';

type Role = 'student' | 'teacher' | 'admin';

const roles: { role: Role; label: string; href: string }[] = [
  { role: 'student', label: 'Học viên', href: '/exams' },
  { role: 'teacher', label: 'Giáo viên', href: '/teacher/questions' },
  { role: 'admin', label: 'Admin', href: '/admin/users' },
];

const base = 'min-h-[44px] rounded-lg px-3 text-sm font-medium';
const activeClass = 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]';
const idleClass = 'text-[var(--color-neutral-600)]';

export function RoleSwitch({ current }: { current: Role }) {
  const router = useRouter();

  return (
    <nav aria-label="Chuyển đổi vai trò" className="flex flex-wrap gap-1">
      {roles.map(({ role, label, href }) => (
        <button
          key={role}
          type="button"
          onClick={() => router.push(href)}
          aria-current={role === current ? 'page' : undefined}
          className={`${base} ${role === current ? activeClass : idleClass}`}
        >
          {role === current && <span aria-hidden="true">✓ </span>}
          {label}
        </button>
      ))}
    </nav>
  );
}
