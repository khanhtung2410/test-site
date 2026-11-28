import { describe, expect, it } from 'vitest';
import { getMockExam, getMockExams } from '@/features/exams/mocks/exams';

describe('getMockExams', () => {
  it('trả về 4 đề, gồm 2 open và 2 closed', () => {
    const exams = getMockExams();
    expect(exams).toHaveLength(4);
    expect(exams.filter((exam) => exam.status === 'open')).toHaveLength(2);
    expect(exams.filter((exam) => exam.status === 'closed')).toHaveLength(2);
  });
});

describe('getMockExam', () => {
  it('trả về undefined khi không tìm thấy đề', () => {
    expect(getMockExam('unknown')).toBeUndefined();
  });
});
