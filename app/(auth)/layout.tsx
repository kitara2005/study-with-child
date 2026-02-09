import { Geist } from 'next/font/google';
import '../globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={`${geist.variable} flex min-h-screen items-center justify-center bg-gray-50 font-[family-name:var(--font-geist)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
