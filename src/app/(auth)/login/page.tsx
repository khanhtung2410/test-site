'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

const fieldClass =
  'min-h-[44px] w-full rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-neutral-900)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';
const linkButton =
  'min-h-[44px] rounded-lg px-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

export default function LoginPage() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push('/exams');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-50)] px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Đăng nhập</h1>
        <p className="mt-1 text-sm text-[var(--color-neutral-600)]">Site thi trắc nghiệm online</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`${fieldClass} mt-1`}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`${fieldClass} mt-1`}
            />
          </div>
          <label className="flex min-h-[44px] items-center gap-2 text-sm text-[var(--color-neutral-600)]">
            <input
              type="checkbox"
              name="remember"
              className="h-5 w-5 accent-[var(--color-primary)]"
            />
            Ghi nhớ đăng nhập
          </label>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" className={linkButton}>
              Quên mật khẩu?
            </button>
            <button
              type="submit"
              className="min-h-[44px] rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-[var(--color-surface)] hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
