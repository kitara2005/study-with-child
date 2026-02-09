import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Học cùng con. Nền tảng học tập cho học sinh lớp 4.
          </p>
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Điều khoản
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Liên hệ
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
