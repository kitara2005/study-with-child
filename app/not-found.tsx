import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">404</h2>
      <p className="text-muted-foreground">Không tìm thấy trang này</p>
      <Link href="/" className="text-blue-600 underline">
        Về trang chủ
      </Link>
    </div>
  );
}
