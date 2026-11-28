import Link from 'next/link';
import type { ReactNode } from 'react';
import { RoleSwitch } from '@/features/shared/components/RoleSwitch';

const navItems = [
  { href: '/teacher/questions', label: 'Ngân hàng câu hỏi' },
  { href: '/teacher/questions/q-1', label: 'Chi tiết câu hỏi' },
  { href: '/teacher/exams', label: 'Danh sách đề thi' },
  { href: '/teacher/exams?mode=create', label: 'Tạo đề thi' },
  { href: '/teacher/exams/e-1/results', label: 'Kết quả làm bài' },
];

const navClass =
  'flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm text-[var(--color-neutral-600)] hover:bg-[var(--color-primary-soft)]';

export function TeacherShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <header className="border-b border-[var(--color-neutral-200)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
          <p className="text-sm font-medium text-[var(--color-neutral-900)]">{title}</p>
          <div className="ml-auto">
            <RoleSwitch current="teacher" />
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row">
        <nav aria-label="Điều hướng giáo viên" className="flex flex-wrap gap-1 md:w-56 md:flex-col">
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
