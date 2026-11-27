import Link from 'next/link';

// Màn 404 chung cho mọi id không tồn tại, không nêu lý do phân quyền.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">
        Không tìm thấy trang
      </h1>
      <Link href="/exams" className="min-h-[44px] text-sm text-[var(--color-primary)] underline">
        Về danh sách đề
      </Link>
    </main>
  );
}
