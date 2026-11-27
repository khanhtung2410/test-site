'use client';

import type { AttemptQuestion } from '@/features/shared/domain/types';

export function QuestionOptions({
  question,
  selected,
  onToggle,
}: {
  question: AttemptQuestion;
  selected: string[];
  onToggle: (optionId: string) => void;
}) {
  const multiple = question.type === 'multiple';
  return (
    <fieldset className="rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] p-4">
      <legend className="px-1 text-base font-semibold">{question.prompt}</legend>
      <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
        {question.points} điểm ·{' '}
        {multiple ? 'Chọn nhiều đáp án, đúng hết mới có điểm' : 'Chọn một đáp án'}
      </p>
      <div className="mt-3 space-y-2">
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex min-h-[44px] items-center gap-3 rounded-lg border border-[var(--color-neutral-200)] px-3 py-2 text-sm hover:border-[var(--color-primary)]"
          >
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={question.id}
              value={option.id}
              checked={selected.includes(option.id)}
              onChange={() => onToggle(option.id)}
              className="h-5 w-5 shrink-0 accent-[var(--color-primary)]"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
