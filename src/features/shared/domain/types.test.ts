import { describe, expectTypeOf, it } from 'vitest';
import type { Attempt, AttemptQuestion, Exam, Result, User } from '@/features/shared/domain/types';

describe('DTO của học viên giữ nguyên tên field', () => {
  it('User giữ nguyên id, name, role', () => {
    expectTypeOf<User>().toEqualTypeOf<{
      id: string;
      name: string;
      role: 'STUDENT';
    }>();
  });

  it('Exam giữ nguyên questionCount, maxScore, maxAttempts', () => {
    expectTypeOf<Exam>().toEqualTypeOf<{
      id: string;
      title: string;
      durationMinutes: number;
      questionCount: number;
      maxScore: number;
      maxAttempts: number;
      attemptsUsed: number;
      openAt: string;
      closeAt: string;
      status: 'open' | 'closed';
    }>();
  });

  it('Attempt giữ nguyên expiresAt, serverNow, answers, savedAt', () => {
    expectTypeOf<Attempt>().toEqualTypeOf<{
      id: string;
      examId: string;
      status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';
      expiresAt: string;
      serverNow: string;
      currentQuestionIndex: number;
      answers: Record<string, string[]>;
      savedAt: Record<string, string>;
    }>();
  });

  it('AttemptQuestion giữ nguyên index, type, prompt, points, options', () => {
    expectTypeOf<AttemptQuestion>().toEqualTypeOf<{
      id: string;
      index: number;
      type: 'single' | 'multiple';
      prompt: string;
      points: number;
      options: { id: string; label: string }[];
    }>();
  });

  it('Result giữ nguyên score, breakdown, canReviewAnswers', () => {
    expectTypeOf<Result>().toEqualTypeOf<{
      attemptId: string;
      score: number;
      maxScore: number;
      submittedAt: string;
      breakdown: {
        questionId: string;
        chosen: string[];
        correct: boolean;
        awarded: number;
      }[];
      canReviewAnswers: boolean;
    }>();
  });
});
