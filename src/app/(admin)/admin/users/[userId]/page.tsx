import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMockUser } from '@/features/users/mocks/users';

// Trang đọc params ở server; id lạ dùng màn 404 chung, không nêu lý do.
export const instant = false;

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserDetailPage({ params }: Props) {
  const { userId } = await params;
  const user = getMockUser(userId);
  if (!user) notFound();
  const role =
    user.role === 'ADMIN' ? 'Quản trị' : user.role === 'TEACHER' ? 'Giáo viên' : 'Học viên';

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Chi tiết tài khoản</h1>
      <article className="space-y-3 rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] p-4">
        <h2 className="text-lg font-medium">{user.name}</h2>
        <p className="text-sm text-[var(--color-neutral-600)]">Username: {user.username}</p>
        <p className="text-sm text-[var(--color-neutral-600)]">Vai trò: {role}</p>
        <p className="text-sm text-[var(--color-neutral-600)]">
          Trạng thái: {user.locked ? 'Đã khóa' : 'Đang dùng'}
        </p>
        <Link
          href="/admin/users"
          className="inline-flex min-h-[44px] items-center text-sm text-[var(--color-primary)] underline"
        >
          Về danh sách người dùng
        </Link>
      </article>
    </section>
  );
}
