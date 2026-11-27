'use client';

import { primary, secondary } from './AttemptHeader';

export function SubmitDialog({
  unansweredCount,
  unansweredNumbers = [],
  onCancel,
  onSubmit,
}: {
  unansweredCount: number;
  unansweredNumbers?: number[];
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-neutral-900)]/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-title"
        className="w-full max-w-md rounded-xl bg-[var(--color-surface)] p-5 shadow-lg"
      >
        <h2 id="submit-title" className="text-lg font-semibold">
          Nộp bài?
        </h2>
        <p className="mt-2 text-sm">Bạn còn {unansweredCount} câu chưa trả lời.</p>
        {unansweredNumbers.length > 0 && (
          <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
            Câu chưa trả lời: {unansweredNumbers.map((number) => `Câu ${number}`).join(', ')}
          </p>
        )}
        <p
          role="alert"
          className="mt-3 rounded-lg bg-[var(--color-primary-soft)] p-3 text-sm text-[var(--color-warning)]"
        >
          Sau khi nộp không sửa được đáp án. Câu nhiều đáp án đúng hết mới có điểm, không trừ điểm.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" autoFocus onClick={onCancel} className={secondary}>
            Làm tiếp
          </button>
          <button type="button" onClick={onSubmit} className={primary}>
            Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
}
