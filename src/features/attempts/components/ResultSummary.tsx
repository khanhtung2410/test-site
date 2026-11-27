import Link from 'next/link';
import { getMockExam } from '@/features/exams/mocks/exams';
import { getMockAttempt } from '@/features/attempts/mocks/attempts';
import { mockResultStats } from '@/features/attempts/mocks/results';
import type { Result } from '@/features/shared/domain/types';

const card =
  'rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] p-5 shadow-sm';
const primary =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-surface)] hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';
const secondary =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

function formatSubmittedAt(value: string): string {
  const date = new Date(value);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${hours}:${minutes}, ${day}/${month}/${date.getUTCFullYear()}`;
}

function examTitle(result: Result): string {
  const attempt = getMockAttempt(result.attemptId);
  return attempt ? (getMockExam(attempt.examId)?.title ?? 'Bài làm') : 'Bài làm';
}

export function ResultSummary({ result, locked }: { result: Result; locked: boolean }) {
  const badge = locked ? 'Điểm đã có · Chờ mở đáp án' : 'Đã nộp';
  const badgeStyle = locked
    ? 'bg-[var(--color-warning)] text-[var(--color-surface)]'
    : 'bg-[var(--color-success)] text-[var(--color-surface)]';

  return (
    <section aria-label="Tổng hợp kết quả" className="space-y-4">
      <div className={card}>
        <p className="text-center text-sm text-[var(--color-neutral-600)]">{examTitle(result)}</p>
        <p className="mt-2 text-center text-5xl font-bold text-[var(--color-primary)]">
          {result.score}/{result.maxScore}
        </p>
        <p
          role="status"
          className={`mx-auto mt-3 flex w-fit items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${badgeStyle}`}
        >
          <span aria-hidden="true">{locked ? '⌛' : '✓'}</span>
          {badge}
        </p>
        <p className="mt-3 text-center text-sm text-[var(--color-neutral-600)]">
          Nộp lúc {formatSubmittedAt(result.submittedAt)}
        </p>
      </div>
      <div className={`${card} flex justify-around gap-2 text-center`}>
        <div>
          <p className="text-2xl font-semibold text-[var(--color-success)]">
            {mockResultStats.correct}
          </p>
          <p className="text-xs text-[var(--color-neutral-600)]">Câu đúng</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[var(--color-error)]">
            {mockResultStats.wrong}
          </p>
          <p className="text-xs text-[var(--color-neutral-600)]">Câu sai</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[var(--color-neutral-900)]">
            {mockResultStats.duration}
          </p>
          <p className="text-xs text-[var(--color-neutral-600)]">Thời gian</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button type="button" disabled className={secondary}>
          Xem lại bài làm
        </button>
        <Link href="/exams" className={primary}>
          Về danh sách đề
        </Link>
      </div>
    </section>
  );
}
