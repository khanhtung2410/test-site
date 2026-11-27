import type { ExamDetail, ResultRow } from '@/features/shared/domain/types';

const exams: ExamDetail[] = [
  {
    id: 'e-1',
    title: 'Kiểm tra giữa kỳ',
    durationMinutes: 45,
    maxScore: 6,
    opensAt: '2026-11-01',
    closesAt: '2026-12-31',
    status: 'open',
    questionIds: ['q-1', 'q-2', 'q-3', 'q-4', 'q-5'],
  },
  {
    id: 'e-2',
    title: 'Bài ôn tập tuần 3',
    durationMinutes: 20,
    maxScore: 3,
    opensAt: '2026-11-01',
    closesAt: '2026-12-31',
    status: 'open',
    questionIds: ['q-1', 'q-3', 'q-5'],
  },
  {
    id: 'e-3',
    title: 'Đề thi thử số 1',
    durationMinutes: 60,
    maxScore: 5,
    opensAt: '2026-09-01',
    closesAt: '2026-10-31',
    status: 'closed',
    questionIds: ['q-1', 'q-2', 'q-4', 'q-5'],
  },
  {
    id: 'e-4',
    title: 'Đề thi thử số 2',
    durationMinutes: 60,
    maxScore: 2,
    opensAt: '2026-11-20',
    closesAt: '2026-12-31',
    status: 'open',
    questionIds: ['q-1', 'q-3'],
  },
];

type ResultSeed = [string, 'SUBMITTED' | 'EXPIRED', number | null, string];
const seeds: Record<string, ResultSeed[]> = {
  'e-1': [
    ['Nguyễn Văn A', 'SUBMITTED', 5.5, '2026-11-20'],
    ['Trần Thị B', 'SUBMITTED', 6, '2026-11-20'],
    ['Lê Văn C', 'EXPIRED', null, ''],
  ],
  'e-2': [['Phạm Thị D', 'SUBMITTED', 3, '2026-11-21']],
  'e-3': [['Hoàng Văn E', 'SUBMITTED', 4, '2026-10-30']],
};

export function getMockTeacherExams(state?: string): ExamDetail[] {
  return state === 'empty' || state === 'error' ? [] : exams;
}

export function getMockExamDetail(id: string): ExamDetail | undefined {
  return exams.find((exam) => exam.id === id);
}

export function getMockResultRows(examId: string): ResultRow[] {
  return (seeds[examId] ?? []).map(([studentName, status, score, submittedAt]) => ({
    studentName,
    status,
    score,
    submittedAt,
  }));
}
