import Link from 'next/link';
import { mockUser } from '@/features/auth/mocks/session';

const linkClass =
  'inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-[var(--color-neutral-600)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

export function StudentHeader({ title, showBack = false }: { title: string; showBack?: boolean }) {
  return (
    <header className="border-b border-[var(--color-neutral-200)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-2">
        <Link href="/exams" className={`${linkClass} font-semibold text-[var(--color-primary)]`}>
          Trắc nghiệm
        </Link>
        <nav aria-label="Điều hướng chính" className="ml-auto flex items-center gap-1">
          {showBack && (
            <Link href="/exams" className={linkClass}>
              Quay lại
            </Link>
          )}
          <Link href="/exams" className={linkClass}>
            Đề thi
          </Link>
          <button type="button" disabled className={`${linkClass} opacity-60`}>
            Kết quả
          </button>
        </nav>
        <div className="flex items-center gap-2 pl-1">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-sm font-semibold text-[var(--color-primary)]"
          >
            {mockUser.name.charAt(0)}
          </span>
          <span className="text-sm text-[var(--color-neutral-900)]">{mockUser.name}</span>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 pb-4">
        <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">{title}</h1>
      </div>
    </header>
  );
}
