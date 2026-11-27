'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ExamDetail } from '@/features/shared/domain/types';

const cell = 'p-2 text-sm';
const button = 'min-h-[44px] rounded-lg px-3 text-sm';
const primary = `${button} bg-[var(--color-primary)] text-white`;

// Nút mô phỏng dùng chung cho thao tác không mutation thật (Sửa đề, lựa chọn).
export function MockActionButton({ label, message }: { label: string; message: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => setShown(true)} className={primary}>
        {label}
      </button>
      {shown && (
        <p role="status" className="text-sm text-[var(--color-primary)]">
          {message}
        </p>
      )}
    </div>
  );
}

export function ExamTable({
  exams,
  view,
}: {
  exams: ExamDetail[];
  view: 'default' | 'empty' | 'error';
}) {
  const headings = ['Đề thi', 'Số câu', 'Điểm', 'Thời lượng', 'Trạng thái'];
  const titleLink = (exam: ExamDetail) => (
    <Link
      href={`/teacher/exams/${exam.id}`}
      className="inline-flex min-h-[44px] items-center font-medium underline"
    >
      {exam.title}
    </Link>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Danh sách đề thi</h1>
        <Link href="/teacher/exams?mode=create" className={primary}>
          Tạo đề thi
        </Link>
      </div>
      {view !== 'default' ? (
        <p role={view === 'error' ? 'alert' : 'status'} className={cell}>
          {view === 'error' ? 'Không tải được dữ liệu' : 'Chưa có đề thi'}
        </p>
      ) : (
        <>
          <table className="hidden w-full border-collapse rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] md:table">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                {headings.map((heading) => (
                  <th key={heading} className={cell}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id} className="border-t border-[var(--color-neutral-200)]">
                  <td className={cell}>{titleLink(exam)}</td>
                  <td className={cell}>{exam.questionIds.length}</td>
                  <td className={cell}>{exam.maxScore}</td>
                  <td className={cell}>{exam.durationMinutes} phút</td>
                  <td className={cell}>{exam.status === 'open' ? 'Đang mở' : 'Đã đóng'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="space-y-2 md:hidden">
            {exams.map((exam) => (
              <li key={exam.id} className="rounded-xl border border-[var(--color-neutral-200)] p-3">
                {titleLink(exam)}
                <p className={cell}>
                  {exam.questionIds.length} câu · {exam.maxScore} điểm · {exam.durationMinutes} phút
                  · {exam.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
