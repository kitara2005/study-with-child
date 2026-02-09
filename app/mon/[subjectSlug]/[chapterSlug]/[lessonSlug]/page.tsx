import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BreadcrumbNavigation } from '@/components/content/breadcrumb-navigation';
import { LessonTabs } from '@/components/content/lesson-tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { LessonContent } from '@/types/content';

export const revalidate = 3600; // ISR: revalidate every 1 hour

type PageProps = {
  params: Promise<{
    subjectSlug: string;
    chapterSlug: string;
    lessonSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { subjectSlug, chapterSlug, lessonSlug } = await params;

  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
        chapter: {
          slug: chapterSlug,
          subject: { slug: subjectSlug },
        },
      },
      include: {
        chapter: {
          include: { subject: true },
        },
      },
    });

    if (!lesson) return { title: 'Không tìm thấy' };

    return {
      title: `${lesson.title} - ${lesson.chapter.name} - Học cùng con`,
      description: `Học ${lesson.title} trong ${lesson.chapter.name} môn ${lesson.chapter.subject.name}`,
    };
  } catch (error) {
    return { title: 'Học cùng con' };
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { subjectSlug, chapterSlug, lessonSlug } = await params;

  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      chapter: {
        slug: chapterSlug,
        subject: { slug: subjectSlug },
      },
    },
    include: {
      chapter: {
        include: { subject: true },
      },
      exercises: {
        orderBy: { orderIndex: 'asc' },
      },
      _count: {
        select: { exercises: true },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  // Find next lesson
  const nextLesson = await prisma.lesson.findFirst({
    where: {
      chapterId: lesson.chapterId,
      orderIndex: { gt: lesson.orderIndex },
    },
    orderBy: { orderIndex: 'asc' },
  });

  const theoryContent = lesson.theoryContent as LessonContent;

  return (
    <div className="container max-w-4xl py-8">
      <BreadcrumbNavigation
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: lesson.chapter.subject.name, href: `/mon/${subjectSlug}` },
          {
            label: lesson.chapter.name,
            href: `/mon/${subjectSlug}/${chapterSlug}`,
          },
          { label: lesson.title },
        ]}
      />

      {/* Lesson header */}
      <div className="mt-6 mb-8">
        <h1 className="mb-2 text-3xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground">
          Bài {lesson.orderIndex} - {lesson.chapter.name}
        </p>
      </div>

      {/* Lesson content tabs */}
      <LessonTabs
        theoryContent={theoryContent}
        exercises={lesson.exercises}
        lessonId={lesson.id}
        nextLessonUrl={
          nextLesson
            ? `/mon/${subjectSlug}/${chapterSlug}/${nextLesson.slug}`
            : undefined
        }
      />

      {/* Next lesson button */}
      {nextLesson && (
        <div className="mt-12 border-t pt-8">
          <Link href={`/mon/${subjectSlug}/${chapterSlug}/${nextLesson.slug}`}>
            <Button size="lg" className="w-full sm:w-auto">
              Bài tiếp theo: {nextLesson.title}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
