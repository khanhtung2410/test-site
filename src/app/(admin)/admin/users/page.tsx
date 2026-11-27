import { UsersTable } from '@/features/admin/components/UsersTable';
import { getMockUsers } from '@/features/users/mocks/users';

// Trang đọc searchParams ở server; giá trị lạ fallback danh sách mặc định.
export const instant = false;

type Props = {
  searchParams: Promise<{ state?: string | string[] }>;
};

export default async function UsersPage({ searchParams }: Props) {
  const { state } = await searchParams;
  const view = state === 'empty' || state === 'error' ? state : 'default';
  return <UsersTable users={getMockUsers(view)} view={view} />;
}
