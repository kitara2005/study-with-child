import { LessonForm } from '@/components/admin/lesson-form';
import { prisma } from '@/lib/prisma';

export default async function NewLessonPage() {
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
      <h1 className="mb-8 text-3xl font-bold">Tạo bài học mới</h1>
      <div className="max-w-2xl">
        <LessonForm subjects={subjects} />
      </div>
    </div>
  );
}
