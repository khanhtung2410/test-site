import { ExamCreateForm } from '@/features/teacher/components/ExamCreateForm';
import { ExamTable } from '@/features/teacher/components/ExamTable';
import { getMockTeacherExams } from '@/features/exams/mocks/teacher-exams';
import { getMockQuestions } from '@/features/questions/mocks/questions';

// Trang đọc searchParams ở server; giá trị lạ fallback danh sách mặc định.
export const instant = false;

type Props = {
  searchParams: Promise<{ mode?: string | string[]; state?: string | string[] }>;
};

export default async function ExamsPage({ searchParams }: Props) {
  const { mode, state } = await searchParams;
  const view = state === 'empty' || state === 'error' ? state : 'default';
  if (mode === 'create') {
    return <ExamCreateForm questions={getMockQuestions()} />;
  }
  return <ExamTable exams={getMockTeacherExams(view)} view={view} />;
}
