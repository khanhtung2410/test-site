import { notFound } from 'next/navigation';
import { getMockExamDetail } from '@/features/exams/mocks/teacher-exams';
import { getMockQuestions } from '@/features/questions/mocks/questions';
import { MockActionButton } from '@/features/teacher/components/ExamTable';

// Trang đọc params ở server; id lạ dùng màn 404 chung.
export const instant = false;

type Props = {
  params: Promise<{ examId: string }>;
};

export default async function ExamDetailPage({ params }: Props) {
  const { examId } = await params;
  const exam = getMockExamDetail(examId);
  if (!exam) notFound();
  const questions = getMockQuestions().filter((question) => exam.questionIds.includes(question.id));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Chi tiết đề thi</h1>
      <article className="space-y-3 rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] p-4">
        <h2 className="text-lg font-medium">{exam.title}</h2>
        <p className="text-sm text-[var(--color-neutral-600)]">
          {exam.durationMinutes} phút · {questions.length} câu · {exam.maxScore} điểm ·{' '}
          {exam.status === 'open' ? 'Đang mở' : 'Đã đóng'}
        </p>
        <p className="text-sm text-[var(--color-neutral-600)]">
          Từ <time dateTime={exam.opensAt}>{exam.opensAt.slice(0, 10)}</time> đến{' '}
          <time dateTime={exam.closesAt}>{exam.closesAt.slice(0, 10)}</time>
        </p>
        <h3 className="font-semibold">Câu hỏi trong đề ({questions.length})</h3>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {questions.map((question) => (
            <li key={question.id}>
              {question.prompt} · {question.type} · {question.points} điểm
            </li>
          ))}
        </ol>
        <MockActionButton label="Sửa đề" message="Sửa đề: đang mô phỏng" />
      </article>
    </section>
  );
}
