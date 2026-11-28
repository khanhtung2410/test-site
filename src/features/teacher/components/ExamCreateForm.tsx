'use client';

import { useState } from 'react';
import type { Question } from '@/features/shared/domain/types';

const input = 'min-h-[44px] w-full rounded-lg border px-3 text-sm';
const field = 'flex flex-col gap-1 text-sm text-[var(--color-neutral-600)]';
const hint = 'text-xs text-[var(--color-neutral-600)]';
const button = 'min-h-[44px] rounded-lg px-4 text-sm';

export function ExamCreateForm({ questions }: { questions: Question[] }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const points = questions.reduce(
    (sum, question) => sum + (chosen.includes(question.id) ? question.points : 0),
    0,
  );
  const toggle = (id: string) =>
    setChosen((list) =>
      list.includes(id)
        ? list.filter((item) => item !== id)
        : list.length < questions.length
          ? [...list, id]
          : list,
    );

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Tạo đề thi</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(`Đã tạo đề thi (mô phỏng): ${chosen.length} câu, ${points} điểm.`);
        }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-3 rounded-xl border border-[var(--color-neutral-200)] p-4">
          <label className={field}>
            Tên đề thi
            <input name="title" required className={input} />
          </label>
          <label className={field}>
            Thời lượng (phút)
            <input name="duration" type="number" defaultValue={45} className={input} />
          </label>
          <label className={field}>
            Số lượt tối đa
            <input name="attempts" type="number" defaultValue={1} className={input} />
          </label>
          <label className={field}>
            Mở lúc
            <input name="opensAt" type="datetime-local" className={input} />
          </label>
          <label className={field}>
            Đóng lúc
            <input name="closesAt" type="datetime-local" className={input} />
          </label>
          <p className={hint}>
            VR-02: 2-6 đáp án; VR-03: đúng 1 hoặc nhiều; VR-04: 1-100 điểm; VR-05: 0-5 tag; VR-06:
            1-480 phút; VR-07: 1-10 lượt; VR-08: closesAt &gt; opensAt; VR-09: tối đa{' '}
            {questions.length} câu trong ngân hàng.
          </p>
        </div>
        <div className="space-y-3 rounded-xl border border-[var(--color-neutral-200)] p-4">
          <fieldset className="space-y-2">
            <legend className="font-semibold text-[var(--color-neutral-900)]">Chọn câu hỏi</legend>
            {questions.map((question) => (
              <label
                key={question.id}
                className="flex min-h-[44px] items-start gap-3 rounded-lg border p-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={chosen.includes(question.id)}
                  onChange={() => toggle(question.id)}
                />
                <span>
                  {question.prompt} · {question.points} điểm
                </span>
              </label>
            ))}
          </fieldset>
          <p role="status" className="text-sm">
            Đã chọn {chosen.length}/{questions.length} câu · Tổng {points} điểm
          </p>
          <button type="submit" className={`${button} bg-[var(--color-primary)] text-white`}>
            Lưu đề thi
          </button>
          {message && (
            <p role="status" className="text-sm text-[var(--color-success)]">
              {message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
