import { notFound } from 'next/navigation';
import { LessonForm } from '@/components/admin/lesson-form';
import { prisma } from '@/lib/prisma';

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
  });

  if (!lesson) {
    notFound();
  }

  const subjects = await prisma.subject.findMany({
    orderBy: { orderIndex: 'asc' },
    include: {
      chapters: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Chỉnh sửa bài học</h1>
      <div className="max-w-2xl">
        <LessonForm subjects={subjects} lesson={lesson} />
      </div>
    </div>
  );
}
