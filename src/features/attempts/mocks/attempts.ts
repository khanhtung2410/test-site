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

function submittedAttempt(id: string, examId: string, submittedAt: string): Attempt {
  return {
    id,
    examId,
    status: 'SUBMITTED',
    expiresAt: submittedAt,
    serverNow: submittedAt,
    currentQuestionIndex: 0,
    answers: {},
    savedAt: {},
  };
}

const submittedAttempts = [
  submittedAttempt('a-2', 'e-2', '2026-11-27T08:18:00.000Z'),
  submittedAttempt('a-3', 'e-3', '2026-10-31T22:40:00.000Z'),
];

export function getMockAttempt(key: string): Attempt | undefined {
  // 'e-1' là alias để nút Làm bài từ /exams mở được attempt demo.
  if (key === ATTEMPT_ID || key === 'e-1') return attempt;
  return submittedAttempts.find((item) => item.id === key || item.examId === key);
}

export function getMockQuestions(current: Attempt): AttemptQuestion[] {
  return current.id === ATTEMPT_ID ? questions : makeQuestions();
}
