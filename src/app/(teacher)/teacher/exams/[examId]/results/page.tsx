import { notFound } from 'next/navigation';
import { getMockExamDetail, getMockResultRows } from '@/features/exams/mocks/teacher-exams';

// Trang đọc params ở server; id lạ dùng màn 404 chung.
export const instant = false;

type Props = {
  params: Promise<{ examId: string }>;
};

export default async function ExamResultsPage({ params }: Props) {
  const { examId } = await params;
  const exam = getMockExamDetail(examId);
  if (!exam) notFound();
  const rows = getMockResultRows(examId);
  const cell = 'p-2 text-sm break-words';
  const status = (value: string) => (value === 'SUBMITTED' ? 'Đã nộp' : 'Quá hạn');
  const score = (value: number | null) => (value === null ? 'Chưa có' : `${value} điểm`);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">
        Kết quả làm bài: {exam.title}
      </h1>
      {rows.length === 0 ? (
        <p role="status" className={cell}>
          Chưa có lượt làm bài nào cho đề này
        </p>
      ) : (
        <table className="w-full border-collapse rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)]">
          <thead className="bg-[var(--color-neutral-50)]">
            <tr>
              {['Học viên', 'Trạng thái', 'Điểm', 'Nộp lúc'].map((heading) => (
                <th key={heading} scope="col" className={cell}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.studentName} className="border-t border-[var(--color-neutral-200)]">
                <td className={cell}>{row.studentName}</td>
                <td className={cell}>{status(row.status)}</td>
                <td className={cell}>{score(row.score)}</td>
                <td className={cell}>{row.submittedAt || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
