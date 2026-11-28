import { notFound } from 'next/navigation';
import { QuestionDetail } from '@/features/teacher/components/QuestionDetail';
import { getMockQuestion } from '@/features/questions/mocks/questions';

// Trang đọc params ở server; id lạ dùng màn 404 chung.
export const instant = false;

type Props = {
  params: Promise<{ questionId: string }>;
};

export default async function QuestionDetailPage({ params }: Props) {
  const { questionId } = await params;
  const question = getMockQuestion(questionId);
  if (!question) notFound();
  return <QuestionDetail question={question} />;
}
