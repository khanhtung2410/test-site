import type { Result } from '@/features/shared/domain/types';

const ATTEMPT_ID = 'a-1';

// Số liệu cố định theo wireframe D3: đề 30 câu, thang điểm 10.
export const mockResultStats = {
  correct: 8,
  wrong: 2,
  duration: '38:12',
};

const result: Result = {
  attemptId: ATTEMPT_ID,
  score: 8,
  maxScore: 10,
  submittedAt: '2026-11-26T09:42:00.000Z',
  breakdown: [
    {
      questionId: 'Thủ đô của Việt Nam là thành phố nào?',
      chosen: ['Hà Nội'],
      correct: true,
      awarded: 1,
    },
    {
      questionId: 'Sông nào dài nhất Việt Nam?',
      chosen: ['Sông Hồng'],
      correct: false,
      awarded: 0,
    },
    {
      questionId: 'Việt Nam có bao nhiêu tỉnh thành?',
      chosen: ['63'],
      correct: true,
      awarded: 1,
    },
    {
      questionId: 'Đà Nẵng thuộc vùng nào?',
      chosen: ['Miền Trung'],
      correct: true,
      awarded: 1,
    },
    {
      questionId: 'Thành phố nào là trung tâm kinh tế lớn nhất?',
      chosen: ['TP. Hồ Chí Minh'],
      correct: true,
      awarded: 1,
    },
  ],
  canReviewAnswers: false,
};

const result2: Result = {
  ...result,
  attemptId: 'a-2',
  score: 4,
  maxScore: 5,
  submittedAt: '2026-11-27T08:18:00.000Z',
};

const extraRows = ['Câu 6', 'Câu 7', 'Câu 8', 'Câu 9'].map((label, index) => ({
  questionId: `${label}: chọn đáp án đúng cho nhận định sau.`,
  chosen: [`Đáp án ${index + 6}`],
  correct: true,
  awarded: 1,
}));

const result3: Result = {
  ...result,
  attemptId: 'a-3',
  score: 8,
  maxScore: 10,
  submittedAt: '2026-10-31T22:40:00.000Z',
  breakdown: [...result.breakdown, ...extraRows],
};

const results: Record<string, Result> = {
  [ATTEMPT_ID]: result,
  'a-2': result2,
  'a-3': result3,
};

const RESULT_EXAM_IDS = new Set(['e-1', 'e-2', 'e-3']);

export function hasMockResultForExam(examId: string): boolean {
  return RESULT_EXAM_IDS.has(examId);
}

export function getMockResult(attemptId: string): Result | undefined {
  const alias = attemptId === 'e-2' ? 'a-2' : attemptId === 'e-3' ? 'a-3' : attemptId;
  return results[alias];
}
