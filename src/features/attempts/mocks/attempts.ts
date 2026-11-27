import type { Attempt, AttemptQuestion } from '@/features/shared/domain/types';

const COUNT = 30;
const MULTIPLE = 9;
const ATTEMPT_ID = 'a-1';

const questionId = (index: number) => `${ATTEMPT_ID}-q-${index}`;

function makeQuestions(): AttemptQuestion[] {
  return Array.from({ length: COUNT }, (_, n) => {
    const index = n + 1;
    const id = questionId(index);
    return {
      id,
      index,
      type: index === MULTIPLE ? 'multiple' : 'single',
      prompt: `Câu ${index}: chọn đáp án đúng cho nhận định sau.`,
      points: 1,
      options: ['A', 'B', 'C', 'D'].map((letter) => ({
        id: `${id}-${letter.toLowerCase()}`,
        label: `Phương án ${letter}`,
      })),
    };
  });
}

const questions = makeQuestions();
const answers: Record<string, string[]> = {};
const savedAt: Record<string, string> = {};
questions.forEach((question, n) => {
  if (question.index === 7 || question.index === 12) return;
  answers[question.id] = [question.options[n % question.options.length].id];
  savedAt[question.id] = new Date(Date.parse('2026-11-27T08:01:00.000Z') + n * 1000).toISOString();
});

const attempt: Attempt = {
  id: ATTEMPT_ID,
  examId: 'e-1',
  status: 'IN_PROGRESS',
  expiresAt: '2026-11-27T08:42:13.000Z',
  serverNow: '2026-11-27T08:00:00.000Z',
  currentQuestionIndex: 2,
  answers,
  savedAt,
};

export function getMockAttempt(key: string): Attempt | undefined {
  // 'e-1' là alias để nút Làm bài từ /exams mở được attempt demo.
  return key === ATTEMPT_ID || key === 'e-1' ? attempt : undefined;
}

export function getMockQuestions(current: Attempt): AttemptQuestion[] {
  return current.id === ATTEMPT_ID ? questions : makeQuestions();
}
