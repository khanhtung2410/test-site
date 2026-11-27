'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import type { UserAccount } from '@/features/shared/domain/types';

type View = 'default' | 'empty' | 'error';
type Role = UserAccount['role'];

const cell = 'p-2 text-sm';
const button = 'min-h-[44px] rounded-lg border px-3 text-sm';
const primary = `${button} bg-[var(--color-primary)] text-white`;
const control = 'min-h-[44px] w-full rounded-lg border px-3 text-sm';
const field = 'flex flex-col gap-1 text-sm text-[var(--color-neutral-600)]';

const roleLabel = (role: Role) =>
  role === 'ADMIN' ? 'Quản trị' : role === 'TEACHER' ? 'Giáo viên' : 'Học viên';

const status = (locked: boolean) => (
  <span>
    <span aria-hidden="true">{locked ? '× ' : '✓ '}</span>
    {locked ? 'Đã khóa' : 'Đang dùng'}
  </span>
);

export function UsersTable({ users, view }: { users: UserAccount[]; view: View }) {
  const [accounts, setAccounts] = useState(users);
  const [toast, setToast] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');

  const toggleLock = (user: UserAccount) => {
    setAccounts((list) =>
      list.map((item) => (item.id === user.id ? { ...item, locked: !item.locked } : item)),
    );
    setToast(`${user.locked ? 'Đã mở khóa' : 'Đã khóa'} tài khoản ${user.username}`);
  };

  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const added: UserAccount = {
      id: `u-${accounts.length + 1}`,
      name: name.trim(),
      username: username.trim(),
      role,
      locked: false,
    };
    setAccounts((list) => [...list, added]);
    setToast(`Đã tạo tài khoản (mô phỏng): ${added.username}`);
    setName('');
    setUsername('');
    setRole('STUDENT');
    setShowCreate(false);
  };

  const actions = (user: UserAccount) => (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => toggleLock(user)} className={button}>
        {user.locked ? 'Mở khóa' : 'Khóa'}
      </button>
      <button
        type="button"
        onClick={() => setToast(`Đã đặt lại mật khẩu (mô phỏng): ${user.username}`)}
        className={button}
      >
        Đặt lại mật khẩu
      </button>
    </div>
  );

  const nameLink = (user: UserAccount) => (
    <Link
      href={`/admin/users/${user.id}`}
      className="inline-flex min-h-[44px] items-center font-medium underline"
    >
      {user.name}
    </Link>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Người dùng</h1>
        {view === 'default' && (
          <button
            type="button"
            onClick={() => setShowCreate((shown) => !shown)}
            className={primary}
          >
            Tạo tài khoản
          </button>
        )}
      </div>
      {toast && (
        <p role="status" className="rounded-lg bg-[var(--color-primary-soft)] p-2 text-sm">
          {toast}
        </p>
      )}
      {view !== 'default' ? (
        <p role={view === 'error' ? 'alert' : 'status'} className={cell}>
          {view === 'error' ? 'Không tải được dữ liệu' : 'Chưa có người dùng'}
        </p>
      ) : (
        <>
          {showCreate && (
            <form onSubmit={create} className="flex flex-wrap gap-3 rounded-xl border p-3">
              <label className={field}>
                Họ tên
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className={control}
                />
              </label>
              <label className={field}>
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  className={control}
                />
              </label>
              <label className={field}>
                Vai trò
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as Role)}
                  className={control}
                >
                  <option value="ADMIN">Quản trị</option>
                  <option value="TEACHER">Giáo viên</option>
                  <option value="STUDENT">Học viên</option>
                </select>
              </label>
              <div className="flex items-end">
                <button type="submit" className={primary}>
                  Lưu tài khoản
                </button>
              </div>
            </form>
          )}
          <table className="hidden w-full border-collapse rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] md:table">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                {['Họ tên', 'Username', 'Vai trò', 'Trạng thái', 'Thao tác'].map((heading) => (
                  <th key={heading} scope="col" className={cell}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map((user) => (
                <tr key={user.id} className="border-t border-[var(--color-neutral-200)]">
                  <td className={cell}>{nameLink(user)}</td>
                  <td className={cell}>{user.username}</td>
                  <td className={cell}>{roleLabel(user.role)}</td>
                  <td className={cell}>{status(user.locked)}</td>
                  <td className={cell}>{actions(user)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="space-y-2 md:hidden">
            {accounts.map((user) => (
              <li key={user.id} className="rounded-xl border border-[var(--color-neutral-200)] p-3">
                {nameLink(user)}
                <p className={cell}>
                  {user.username} · {roleLabel(user.role)} · {status(user.locked)}
                </p>
                {actions(user)}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
