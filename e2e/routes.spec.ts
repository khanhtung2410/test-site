import { expect, test } from '@playwright/test';

const routes = [
  { path: '/exams', text: 'Đề đang mở' },
  { path: '/login', text: 'Đăng nhập' },
  { path: '/teacher/questions', text: 'Ngân hàng câu hỏi' },
  { path: '/admin/users', text: 'Người dùng' },
];

for (const { path, text } of routes) {
  test(`${path} returns 200 and shows Vietnamese content`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
  });
}

test('/attempts/unknown shows the generic 404 page', async ({ page }) => {
  await page.goto('/attempts/unknown');
  await expect(page.getByRole('heading', { name: 'Không tìm thấy trang' })).toBeVisible();
});
