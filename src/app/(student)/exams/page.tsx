'use client';

import { useRouter } from 'next/navigation';
import { Suspense, use } from 'react';
import { getMockExams } from '@/features/exams/mocks/exams';
import { ExamCard } from '@/features/shared/components/ExamCard';
import { StudentHeader } from '@/features/shared/components/StudentHeader';
import type { Exam } from '@/features/shared/domain/types';

type ExamsPageProps = {
  searchParams: Promise<{ state?: string | string[] }>;
};

const retryButton =
  'min-h-[44px] rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-[var(--color-surface)] hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

export default function ExamsPage({ searchParams }: ExamsPageProps) {
  return (
    <Suspense fallback={<p className="p-4 text-sm">Đang tải danh sách đề...</p>}>
      <ExamsContent searchParams={searchParams} />
    </Suspense>
  );
}

function ExamsContent({ searchParams }: ExamsPageProps) {
  const { state } = use(searchParams);
  const router = useRouter();
  const exams = getMockExams();
  const viewState = state === 'empty' || state === 'error' ? state : 'default';

  function renderGrid(list: Exam[]) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onStart={() => router.push(`/attempts/${exam.id}`)}
            onViewResult={() => router.push(`/attempts/${exam.id}/result`)}
          />
        ))}
      </div>
    );
  }

  if (viewState !== 'default') {
    const isEmpty = viewState === 'empty';
    return (
      <main className="min-h-screen bg-[var(--color-neutral-50)]">
        <StudentHeader title="Xin chào, An" />
        <section className="mx-auto max-w-5xl px-4 py-10 text-center">
          <p role={isEmpty ? 'status' : 'alert'} className="text-base font-medium">
            {isEmpty ? 'Chưa có đề nào' : 'Không tải được dữ liệu'}
          </p>
          <button type="button" onClick={() => router.refresh()} className={`${retryButton} mt-4`}>
            {isEmpty ? 'Tải lại' : 'Thử lại'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-neutral-50)] pb-10">
      <StudentHeader title="Xin chào, An" />
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-6">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-neutral-900)]">Đề đang mở</h2>
          {renderGrid(exams.filter((exam) => exam.status === 'open'))}
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-neutral-900)]">
            Đã kết thúc
          </h2>
          {renderGrid(exams.filter((exam) => exam.status === 'closed'))}
        </section>
      </div>
    </main>
  );
}
