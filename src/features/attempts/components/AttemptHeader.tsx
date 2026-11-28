'use client';

import Link from 'next/link';
import { getMockExam } from '@/features/exams/mocks/exams';
import type { Attempt } from '@/features/shared/domain/types';
import { Timer } from './Timer';

export const primary =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-surface)] hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';
export const secondary =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--color-neutral-200)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

export function AttemptHeader({
  attempt,
  label,
  saved,
  timerState,
  onToggleNav,
  onExit,
  onSubmit,
}: {
  attempt: Attempt;
  label: string;
  saved: boolean;
  timerState?: string;
  onToggleNav: () => void;
  onExit: () => void;
  onSubmit: () => void;
}) {
  const title = getMockExam(attempt.examId)?.title ?? 'Bài làm';
  const badge = saved ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]';

  return (
    <header className="border-b border-[var(--color-neutral-200)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
        <Link href="/exams" className={`${secondary} font-semibold text-[var(--color-primary)]`}>
          Quay lại
        </Link>
        <h1 className="min-w-0 truncate text-lg font-semibold">{title}</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleNav}
            aria-label="Mở danh sách câu"
            className={`${secondary} md:hidden`}
          >
            <span aria-hidden="true">▦</span> Câu
          </button>
          <span
            role="status"
            className={`inline-flex min-h-[44px] items-center gap-1 rounded-full bg-[var(--color-primary-soft)] px-3 text-sm font-medium ${badge}`}
          >
            <span aria-hidden="true">{saved ? '✓' : '!'}</span>
            {saved ? 'Đã lưu' : 'Chưa lưu'}
          </span>
          <button type="button" onClick={onExit} className={secondary}>
            Lưu & thoát
          </button>
          <button type="button" onClick={onSubmit} className={primary}>
            Nộp bài
          </button>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 pb-3 text-sm">
        <span className="font-medium">{label}</span>
        <Timer
          key={timerState ?? 'default'}
          expiresAt={attempt.expiresAt}
          serverNow={attempt.serverNow}
          state={timerState}
        />
      </div>
    </header>
  );
}
