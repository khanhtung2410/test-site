'use client';

import type { Exam } from '@/features/shared/domain/types';

const SCORING_RULE = 'Câu nhiều đáp án: đúng hết mới có điểm, không trừ điểm';

const primaryButton =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-surface)] hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';
const secondaryButton =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--color-neutral-200)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60';

export function ExamCard({
  exam,
  hasResult,
  onStart,
  onViewResult,
}: {
  exam: Exam;
  hasResult: boolean;
  onStart: () => void;
  onViewResult: () => void;
}) {
  const canStart = exam.status === 'open' && exam.attemptsUsed < exam.maxAttempts;
  const attemptsBadge =
    exam.status === 'closed'
      ? 'Đề đã đóng'
      : canStart
        ? `Còn ${exam.maxAttempts - exam.attemptsUsed}/${exam.maxAttempts} lượt`
        : `Đã dùng ${exam.attemptsUsed}/${exam.maxAttempts} lượt`;

  return (
    <article className="flex flex-col rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">{exam.title}</h3>
      <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
        {exam.durationMinutes} phút · {exam.questionCount} câu · {exam.maxScore} điểm
      </p>
      <p className="mt-2 inline-flex w-fit items-center rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
        {attemptsBadge}
      </p>
      <p className="mt-3 text-xs text-[var(--color-neutral-600)]">{SCORING_RULE}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {canStart && (
          <button type="button" onClick={onStart} className={primaryButton}>
            Làm bài
          </button>
        )}
        {(exam.attemptsUsed > 0 || !canStart) && (
          <button
            type="button"
            onClick={onViewResult}
            disabled={!hasResult}
            className={secondaryButton}
          >
            Xem kết quả
          </button>
        )}
      </div>
    </article>
  );
}
