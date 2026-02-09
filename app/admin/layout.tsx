import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { getCurrentUser } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/admin';

  return (
    <div className="flex h-screen">
      <AdminSidebar currentPath={pathname} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
