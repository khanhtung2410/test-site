import type { ReactNode } from 'react';
import { TeacherShell } from '@/features/teacher/components/TeacherShell';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return <TeacherShell title="Giáo viên">{children}</TeacherShell>;
}
