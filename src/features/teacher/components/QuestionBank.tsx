'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Question } from '@/features/shared/domain/types';

const control = 'min-h-[44px] rounded-lg border px-3 text-sm';
const button = `${control} text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]`;
const cell = 'p-2 text-sm';

type View = 'default' | 'empty' | 'error';

export function QuestionBank({ questions, view }: { questions: Question[]; view: View }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [hidden, setHidden] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const tags = [...new Set(questions.flatMap((q) => q.tags))].sort();
  const visible = questions.filter(
    (q) => (tag === 'all' || q.tags.includes(tag)) && q.prompt.includes(query.trim()),
  );
  const status = (q: Question) =>
    hidden.includes(q.id) || q.archived ? 'Đã lưu trữ' : 'Đang dùng';
  const actions = (q: Question) => (
    <div className="flex gap-2">
      <button type="button" onClick={() => setMessage(`Sửa ${q.id}: mô phỏng`)} className={button}>
        Sửa
      </button>
      <button
        type="button"
        onClick={() => {
          setHidden((ids) => [...ids, q.id]);
          setMessage(`Đã lưu trữ ${q.id}`);
        }}
        className={button}
      >
        Lưu trữ
      </button>
    </div>
  );

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Ngân hàng câu hỏi</h1>
      {message && (
        <p role="status" className={cell}>
          {message}
        </p>
      )}
      {view !== 'default' ? (
        <p role={view === 'error' ? 'alert' : 'status'} className={cell}>
          {view === 'error' ? 'Không tải được dữ liệu' : 'Chưa có câu hỏi'}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-1 text-sm text-[var(--color-neutral-600)]">
              Tìm kiếm
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={control}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[var(--color-neutral-600)]">
              Tag
              <select value={tag} onChange={(e) => setTag(e.target.value)} className={control}>
                <option value="all">Tất cả</option>
                {tags.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <table className="hidden w-full border-collapse rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] md:table">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                {['Câu hỏi', 'Loại', 'Tag', 'Điểm', 'Trạng thái', 'Thao tác'].map((heading) => (
                  <th key={heading} scope="col" className={cell}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((q) => (
                <tr key={q.id} className="border-t border-[var(--color-neutral-200)]">
                  <td className={cell}>
                    <Link
                      href={`/teacher/questions/${q.id}`}
                      className="inline-flex min-h-[44px] items-center underline"
                    >
                      {q.prompt}
                    </Link>
                  </td>
                  <td className={cell}>{q.type === 'MULTI' ? 'Nhiều đáp án' : 'Một đáp án'}</td>
                  <td className={cell}>{q.tags.join(', ')}</td>
                  <td className={cell}>{q.points}</td>
                  <td className={cell}>{status(q)}</td>
                  <td className={cell}>{actions(q)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="space-y-2 md:hidden">
            {visible.map((q) => (
              <li key={q.id} className="rounded-xl border border-[var(--color-neutral-200)] p-3">
                <Link
                  href={`/teacher/questions/${q.id}`}
                  className="inline-flex min-h-[44px] items-center font-medium underline"
                >
                  {q.prompt}
                </Link>
                <p className={cell}>
                  {q.tags.join(', ')} · {q.points} điểm · {status(q)}
                </p>
                {actions(q)}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
