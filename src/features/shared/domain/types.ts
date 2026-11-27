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

export interface ExamDetail {
  id: string;
  title: string;
  durationMinutes: number;
  maxScore: number;
  opensAt: string;
  closesAt: string;
  status: 'open' | 'closed';
  questionIds: string[];
}

export interface ResultRow {
  studentName: string;
  status: 'SUBMITTED' | 'EXPIRED';
  score: number | null;
  submittedAt: string;
}

// Tài khoản quản trị: type riêng, không dùng lại type User của học viên.
export interface UserAccount {
  id: string;
  name: string;
  username: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  locked: boolean;
}
