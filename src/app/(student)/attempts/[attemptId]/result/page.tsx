import { notFound } from 'next/navigation';
import { ResultSummary } from '@/features/attempts/components/ResultSummary';
import { ResultTable } from '@/features/attempts/components/ResultTable';
import { getMockAttempt } from '@/features/attempts/mocks/attempts';
import { getMockResult } from '@/features/attempts/mocks/results';
import { StudentHeader } from '@/features/shared/components/StudentHeader';

// Trang đọc params/searchParams ở server để HTML có nội dung state ngay.
export const instant = false;

type Props = {
  params: Promise<{ attemptId: string }>;
  searchParams: Promise<{ state?: string | string[] }>;
};

export default async function ResultPage({ params, searchParams }: Props) {
  const { attemptId } = await params;
  const { state } = await searchParams;

  const attempt = getMockAttempt(attemptId);
  if (!attempt) notFound();
  const result = getMockResult(attempt.id);
  if (!result) notFound();

  const locked = state === 'locked';

  return (
    <main className="min-h-screen bg-[var(--color-neutral-50)] pb-10">
      <StudentHeader title="Kết quả bài làm" showBack />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-[320px_minmax(0,1fr)]">
          <ResultSummary result={result} locked={locked} />
          <ResultTable result={result} />
        </div>
      </div>
    </main>
  );
}
