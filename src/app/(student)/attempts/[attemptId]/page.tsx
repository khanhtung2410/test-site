'use client';

import { Suspense, use, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { AttemptHeader, primary, secondary } from '@/features/attempts/components/AttemptHeader';
import { QuestionNavigator } from '@/features/attempts/components/QuestionNavigator';
import { QuestionOptions } from '@/features/attempts/components/QuestionOptions';
import { SubmitDialog } from '@/features/attempts/components/SubmitDialog';
import { getMockAttempt, getMockQuestions } from '@/features/attempts/mocks/attempts';

type Props = {
  params: Promise<{ attemptId: string }>;
  searchParams: Promise<{ state?: string | string[] }>;
};

const shade = 'fixed inset-0 bg-[var(--color-neutral-900)]/50';
const sheet =
  'fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-[var(--color-neutral-200)] bg-[var(--color-surface)] p-4 md:static md:z-auto md:max-h-none md:w-60 md:shrink-0 md:rounded-none md:border-0 md:bg-transparent md:p-0';
const navButton = `${secondary} disabled:opacity-50`;

export default function AttemptPage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<p className="p-4">Đang tải bài làm...</p>}>
      <Content params={params} searchParams={searchParams} />
    </Suspense>
  );
}

function Content({ params, searchParams }: Props) {
  const { attemptId } = use(params);
  const { state } = use(searchParams);
  const view = state === 'offline' || state === 'expired' || state === 'near' ? state : 'default';
  const router = useRouter();
  const attempt = getMockAttempt(attemptId);
  const [index, setIndex] = useState(attempt?.currentQuestionIndex ?? 0);
  const [answers, setAnswers] = useState<Record<string, string[]>>(attempt?.answers ?? {});
  const flagged = [4];
  const [saved, setSaved] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  if (!attempt) notFound();

  const questions = getMockQuestions(attempt);
  const question = questions[index];
  const answered = questions.flatMap((item) =>
    (answers[item.id] ?? []).length ? [item.index - 1] : [],
  );
  const unanswered = questions.flatMap((item) =>
    (answers[item.id] ?? []).length ? [] : [item.index],
  );
  const result = `/attempts/${attempt.id}/result`;

  function toggleOption(optionId: string) {
    setAnswers((current) => {
      const old = current[question.id] ?? [];
      const next =
        question.type === 'single'
          ? [optionId]
          : old.includes(optionId)
            ? old.filter((value) => value !== optionId)
            : [...old, optionId];
      return { ...current, [question.id]: next };
    });
    if (view === 'offline') setSaved(false);
  }

  const navigator = (
    <QuestionNavigator
      questions={questions}
      currentIndex={index}
      flagged={flagged}
      answered={answered}
      onSelect={(value) => {
        setIndex(value);
        setNavOpen(false);
      }}
    />
  );

  return (
    <main className="min-h-screen bg-[var(--color-neutral-50)] pb-10">
      <AttemptHeader
        attempt={attempt}
        label={`Câu ${index + 1}/${questions.length}`}
        saved={saved}
        timerState={view === 'near' ? 'near' : undefined}
        onToggleNav={() => setNavOpen(true)}
        onExit={() => router.push('/exams')}
        onSubmit={() => setSubmitOpen(true)}
      />
      {view === 'offline' && (
        <div
          role="alert"
          className="mx-auto mt-4 flex max-w-6xl flex-wrap items-center gap-2 rounded-lg border border-[var(--color-warning)] bg-[var(--color-surface)] px-4 py-2 text-sm"
        >
          <span>Không có kết nối. Đáp án chưa được lưu.</span>
          <button type="button" onClick={() => setSaved(true)} className={secondary}>
            Thử lại
          </button>
        </div>
      )}
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <section className="min-w-0 flex-1">
          <QuestionOptions
            question={question}
            selected={answers[question.id] ?? []}
            onToggle={toggleOption}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
              className={navButton}
            >
              Câu trước
            </button>
            <button
              type="button"
              disabled={index === questions.length - 1}
              onClick={() => setIndex(index + 1)}
              className={navButton}
            >
              Câu sau
            </button>
          </div>
        </section>
        {navOpen && <div className={`${shade} z-40 md:hidden`} onClick={() => setNavOpen(false)} />}
        <aside className={`${navOpen ? 'block' : 'hidden'} ${sheet}`}>
          <div className="mb-3 flex items-center justify-between md:hidden">
            <h2 className="font-semibold">Danh sách câu</h2>
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              aria-label="Đóng danh sách câu"
              className={`${secondary} min-w-[44px]`}
            >
              Đóng
            </button>
          </div>
          {navigator}
        </aside>
      </div>
      {submitOpen && (
        <SubmitDialog
          unansweredCount={unanswered.length}
          unansweredNumbers={unanswered}
          onCancel={() => setSubmitOpen(false)}
          onSubmit={() => router.push(result)}
        />
      )}
      {view === 'expired' && (
        <div
          className={`${shade} z-50 flex items-center justify-center p-4`}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="expired-title"
        >
          <div className="w-full max-w-md rounded-xl bg-[var(--color-surface)] p-5 text-center shadow-lg">
            <h2 id="expired-title" className="text-lg font-semibold">
              Hết giờ làm bài
            </h2>
            <p className="mt-2 text-sm text-[var(--color-neutral-600)]">
              Thời gian đã kết thúc. Bài làm đã được ghi nhận.
            </p>
            <button type="button" onClick={() => router.push(result)} className={`${primary} mt-5`}>
              Xem kết quả
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
