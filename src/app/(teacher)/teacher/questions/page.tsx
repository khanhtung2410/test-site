import { QuestionBank } from '@/features/teacher/components/QuestionBank';
import { getMockQuestions } from '@/features/questions/mocks/questions';

// Trang đọc searchParams ở server để HTML có nội dung state ngay.
export const instant = false;

type Props = {
  searchParams: Promise<{ state?: string | string[] }>;
};

export default async function QuestionsPage({ searchParams }: Props) {
  const { state } = await searchParams;
  const view = state === 'empty' || state === 'error' ? state : 'default';
  return <QuestionBank questions={getMockQuestions(view)} view={view} />;
}
