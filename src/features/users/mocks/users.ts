import type { UserAccount } from '@/features/shared/domain/types';

const users: UserAccount[] = [
  { id: 'u-1', name: 'Nguyễn Văn Quản', username: 'quan.tri', role: 'ADMIN', locked: false },
  { id: 'u-2', name: 'Trần Thị Giáo', username: 'giao.vien', role: 'TEACHER', locked: false },
  { id: 'u-3', name: 'Lê Văn Học', username: 'hoc.vien', role: 'STUDENT', locked: false },
  { id: 'u-4', name: 'Phạm Thị Tạm', username: 'tam.khoa', role: 'STUDENT', locked: true },
];

export function getMockUsers(state?: string): UserAccount[] {
  return state === 'empty' || state === 'error' ? [] : users;
}

export function getMockUser(id: string): UserAccount | undefined {
  return users.find((user) => user.id === id);
}
