export interface User {
  id: string;
  name: string;
  role: 'STUDENT';
}

export interface Exam {
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
}

export interface Attempt {
  id: string;
  examId: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';
  expiresAt: string;
  serverNow: string;
  currentQuestionIndex: number;
  answers: Record<string, string[]>;
  savedAt: Record<string, string>;
}

export interface AttemptQuestion {
  id: string;
  index: number;
  type: 'single' | 'multiple';
  prompt: string;
  points: number;
  options: { id: string; label: string }[];
}

export interface Result {
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
}

export interface QuestionOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  prompt: string;
  type: 'SINGLE' | 'MULTI';
  points: number;
  tags: string[];
  options: QuestionOption[];
  archived: boolean;
}
