import type { Exam } from '@/features/shared/domain/types';

const exams: Exam[] = [
  {
    id: 'e-1',
    title: 'Kiểm tra giữa kỳ',
    durationMinutes: 45,
    questionCount: 30,
    maxScore: 10,
    maxAttempts: 2,
    attemptsUsed: 0,
    openAt: '2026-11-01T00:00:00.000Z',
    closeAt: '2026-12-31T23:59:59.000Z',
    status: 'open',
  },
  {
    id: 'e-2',
    title: 'Bài ôn tập tuần 3',
    durationMinutes: 20,
    questionCount: 15,
    maxScore: 5,
    maxAttempts: 1,
    attemptsUsed: 1,
    openAt: '2026-11-01T00:00:00.000Z',
    closeAt: '2026-12-31T23:59:59.000Z',
    status: 'open',
  },
  {
    id: 'e-3',
    title: 'Đề thi thử số 1',
    durationMinutes: 60,
    questionCount: 40,
    maxScore: 10,
    maxAttempts: 1,
    attemptsUsed: 1,
    openAt: '2026-09-01T00:00:00.000Z',
    closeAt: '2026-10-31T23:59:59.000Z',
    status: 'closed',
  },
  {
    id: 'e-4',
    title: 'Đề thi thử số 2',
    durationMinutes: 60,
    questionCount: 40,
    maxScore: 10,
    maxAttempts: 1,
    attemptsUsed: 0,
    openAt: '2026-09-01T00:00:00.000Z',
    closeAt: '2026-10-31T23:59:59.000Z',
    status: 'closed',
  },
];

export function getMockExams(): Exam[] {
  return exams;
}

export function getMockExam(id: string): Exam | undefined {
  return exams.find((exam) => exam.id === id);
}
