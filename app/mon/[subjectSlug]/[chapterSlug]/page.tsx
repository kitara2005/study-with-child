import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { BreadcrumbNavigation } from '@/components/content/breadcrumb-navigation';
import { LessonCard } from '@/components/content/lesson-card';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ subjectSlug: string; chapterSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { subjectSlug, chapterSlug } = await params;

  try {
    const chapter = await prisma.chapter.findFirst({
      where: {
        slug: chapterSlug,
        subject: { slug: subjectSlug },
      },
      include: { subject: true },
    });

    if (!chapter) return { title: 'Không tìm thấy' };

    return {
      title: `${chapter.name} - ${chapter.subject.name} - Học cùng con`,
      description: `Học ${chapter.name} trong môn ${chapter.subject.name} lớp 4`,
    };
  } catch (error) {
    return { title: 'Học cùng con' };
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { subjectSlug, chapterSlug } = await params;

  const chapter = await prisma.chapter.findFirst({
    where: {
      slug: chapterSlug,
      subject: { slug: subjectSlug },
    },
    include: {
      subject: true,
      lessons: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  if (!chapter) {
    notFound();
  }

  return (
    <div className="container py-8">
      <BreadcrumbNavigation
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: chapter.subject.name, href: `/mon/${subjectSlug}` },
          { label: chapter.name },
        ]}
      />

      {/* Chapter header */}
      <div className="mt-6 mb-8">
        <h1 className="mb-2 text-3xl font-bold">{chapter.name}</h1>
        <p className="text-muted-foreground">
          {chapter.lessons.length} bài học
        </p>
      </div>

      {/* Lessons list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chapter.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            subjectSlug={subjectSlug}
            chapterSlug={chapterSlug}
          />
        ))}
      </div>
    </div>
  );
}
