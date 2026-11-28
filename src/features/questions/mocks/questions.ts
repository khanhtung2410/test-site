import type { Question, QuestionOption } from '@/features/shared/domain/types';

function options(id: string, correct: number[], labels: string[]): QuestionOption[] {
  return labels.map((label, index) => ({
    id: `${id}-o${index + 1}`,
    label,
    isCorrect: correct.includes(index),
  }));
}

const questions: Question[] = [
  {
    id: 'q-1',
    prompt: 'Thủ đô của Việt Nam là gì?',
    type: 'SINGLE',
    points: 1,
    tags: ['dia-ly', 'on-tap'],
    options: options('q-1', [0], ['Hà Nội', 'Huế', 'Đà Nẵng']),
    archived: false,
  },
  {
    id: 'q-2',
    prompt: 'Những thành phố nào thuộc miền Nam?',
    type: 'MULTI',
    points: 2,
    tags: ['dia-ly'],
    options: options('q-2', [0, 2], ['Thành phố Hồ Chí Minh', 'Hà Nội', 'Cần Thơ']),
    archived: false,
  },
  {
    id: 'q-3',
    prompt: 'Phép cộng 7 + 5 bằng bao nhiêu?',
    type: 'SINGLE',
    points: 1,
    tags: ['on-tap'],
    options: options('q-3', [2], ['10', '11', '12']),
    archived: false,
  },
  {
    id: 'q-4',
    prompt: 'Chất nào sau đây là kim loại?',
    type: 'SINGLE',
    points: 1,
    tags: ['on-tap'],
    options: options('q-4', [1], ['Nước', 'Sắt', 'Giấy']),
    archived: false,
  },
  {
    id: 'q-5',
    prompt: 'Đâu là đơn vị đo thời gian?',
    type: 'SINGLE',
    points: 1,
    tags: ['on-tap'],
    options: options('q-5', [2], ['Met', 'Lít', 'Giây']),
    archived: false,
  },
  {
    id: 'q-6',
    prompt: 'Câu hỏi cũ về lịch sử đã lưu trữ?',
    type: 'SINGLE',
    points: 1,
    tags: ['on-tap'],
    options: options('q-6', [0], ['Năm 1945', 'Năm 1975', 'Năm 1986']),
    archived: true,
  },
];

export const getMockQuestions = (state?: string): Question[] =>
  state === 'empty' || state === 'error' ? [] : questions;

export const getMockQuestion = (id: string): Question | undefined =>
  questions.find((question) => question.id === id);
