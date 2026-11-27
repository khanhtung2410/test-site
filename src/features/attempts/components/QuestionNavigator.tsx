'use client';

import type { AttemptQuestion } from '@/features/shared/domain/types';

type Props = {
  questions: AttemptQuestion[];
  currentIndex: number;
  flagged: number[];
  onSelect: (index: number) => void;
  answered?: number[];
};

export function QuestionNavigator({
  questions,
  currentIndex,
  flagged,
  onSelect,
  answered = [],
}: Props) {
  return (
    <nav aria-label="Danh sách câu hỏi">
      <h2 className="mb-3 text-sm font-semibold">Danh sách câu</h2>
      <div className="grid grid-cols-5 gap-2 md:grid-cols-6">
        {questions.map((question, index) => {
          const current = index === currentIndex;
          const done = answered.includes(index);
          const flag = flagged.includes(index);
          const label = `Câu ${index + 1}, ${current ? 'đang làm' : done ? 'đã trả lời' : 'chưa trả lời'}${flag ? ', đã đánh dấu' : ''}`;
          const tone = current
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-surface)]'
            : done
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
              : 'border-[var(--color-neutral-200)] bg-[var(--color-surface)]';
          return (
            <button
              key={question.id}
              type="button"
              aria-label={label}
              onClick={() => onSelect(index)}
              className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border text-sm font-medium ${tone}`}
            >
              {index + 1}
              {flag && <span aria-hidden="true">⚑</span>}
              {done && !flag && <span aria-hidden="true">✓</span>}
            </button>
          );
        })}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-3 text-xs text-[var(--color-neutral-600)]">
        <li>Đang làm</li>
        <li>Đã trả lời</li>
        <li>Chưa trả lời</li>
        <li>Đã đánh dấu</li>
      </ul>
    </nav>
  );
}
