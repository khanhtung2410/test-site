import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trắc nghiệm',
  description: 'Site thi trắc nghiệm online cho học viên và giáo viên.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
