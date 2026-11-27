import { AttemptView } from '@/features/attempts/components/AttemptView';

// Trang đọc params/searchParams ở server để HTML có nội dung state ngay.
export const instant = false;

type Props = {
  params: Promise<{ attemptId: string }>;
  searchParams: Promise<{ state?: string | string[] }>;
};

export default async function AttemptPage({ params, searchParams }: Props) {
  const { attemptId } = await params;
  const { state } = await searchParams;
  const view = state === 'offline' || state === 'expired' || state === 'near' ? state : 'default';
  return <AttemptView attemptId={attemptId} view={view} />;
}
