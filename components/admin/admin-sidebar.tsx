import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ListChecks,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { href: '/admin/subjects', label: 'Môn học', icon: BookOpen },
  { href: '/admin/lessons', label: 'Bài học', icon: FileText },
  { href: '/admin/exercises', label: 'Bài tập', icon: ListChecks },
  { href: '/admin/users', label: 'Người dùng', icon: Users },
];

export function AdminSidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="bg-card w-64 flex-shrink-0 border-r">
      <div className="p-6">
        <h1 className="text-xl font-bold">Quản trị viên</h1>
      </div>
      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
