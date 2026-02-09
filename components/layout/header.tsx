import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNavigation } from './mobile-navigation';
import { UserMenu } from './user-menu';

export function Header() {
  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/mon-hoc', label: 'Môn học' },
    { href: '/ve-chung-toi', label: 'Về chúng tôi' },
  ];

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <BookOpen className="h-6 w-6" />
          <span>Học cùng con</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <UserMenu />
        </nav>

        {/* Mobile Navigation */}
        <MobileNavigation navLinks={navLinks} />
      </div>
    </header>
  );
}
