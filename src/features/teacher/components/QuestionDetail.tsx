'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Question } from '@/features/shared/domain/types';

const button = 'min-h-[44px] rounded-lg bg-[var(--color-primary)] px-4 text-sm text-white';

export function QuestionDetail({ question }: { question: Question }) {
  const [message, setMessage] = useState('');
  const inputType = question.type === 'MULTI' ? 'checkbox' : 'radio';

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Chi tiết câu hỏi</h1>
      <article className="space-y-4 rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] p-4">
        <p className="text-base font-medium">{question.prompt}</p>
        <p className="text-sm text-[var(--color-neutral-600)]">
          Loại: {question.type} · Điểm: {question.points} · Tag: {question.tags.join(', ')}
        </p>
        <fieldset className="space-y-2">
          <legend className="font-semibold">Đáp án</legend>
          {question.options.map(({ id, label, isCorrect }) => (
            <label key={id} className="flex min-h-[44px] gap-3 border-b text-sm">
              <input type={inputType} defaultChecked={isCorrect} disabled className="h-5 w-5" />
              <span>{label}</span>
              {isCorrect && (
                <span className="ml-auto text-xs text-[var(--color-success)]">✓ Đáp án đúng</span>
              )}
            </label>
          ))}
        </fieldset>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setMessage('Sửa: đang mô phỏng')} className={button}>
            Sửa
          </button>
          <Link href="/teacher/questions" className="min-h-[44px] rounded-lg border px-4 text-sm">
            Quay lại
          </Link>
        </div>
        {message && (
          <p role="status" className="text-sm text-[var(--color-primary)]">
            {message}
          </p>
        )}
      </article>
    </section>
  );
}
