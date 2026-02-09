import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { BreadcrumbNavigation } from '@/components/content/breadcrumb-navigation';
import { ChapterCard } from '@/components/content/chapter-card';
import * as Icons from 'lucide-react';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ subjectSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { subjectSlug } = await params;

  try {
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) return { title: 'Không tìm thấy' };

    return {
      title: `${subject.name} - Học cùng con`,
      description: `Học ${subject.name} lớp 4 theo chương trình Chân Trời Sáng Tạo`,
    };
  } catch (error) {
    return { title: 'Học cùng con' };
  }
}

export default async function SubjectPage({ params }: PageProps) {
  const { subjectSlug } = await params;

  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
    include: {
      chapters: {
        orderBy: { orderIndex: 'asc' },
        include: {
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
  });

  if (!subject) {
    notFound();
  }

  // Dynamically get icon component
  const IconComponent = (Icons as any)[subject.icon] || Icons.BookOpen;

  return (
    <div className="container py-8">
      <BreadcrumbNavigation
        items={[{ label: 'Trang chủ', href: '/' }, { label: subject.name }]}
      />

      {/* Subject banner */}
      <div className="mt-6 mb-8 rounded-xl border bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`rounded-lg bg-white p-4 shadow-sm ${subject.color}`}>
            <IconComponent className="h-10 w-10" />
          </div>
          <div>
            <h1 className="mb-1 text-3xl font-bold">{subject.name}</h1>
            <p className="text-muted-foreground">
              {subject.chapters.length} chương học
            </p>
          </div>
        </div>
      </div>

      {/* Chapters grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subject.chapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            subjectSlug={subject.slug}
          />
        ))}
      </div>
    </div>
  );
}
