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

export function getMockResult(attemptId: string): Result | undefined {
  return attemptId === ATTEMPT_ID ? result : undefined;
}
