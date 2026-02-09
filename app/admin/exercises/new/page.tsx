import { ExerciseForm } from '@/components/admin/exercise-form';
import { prisma } from '@/lib/prisma';

export default async function NewExercisePage() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      chapter: {
        include: {
          subject: true,
        },
      },
    },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Tạo bài tập mới</h1>
      <div className="max-w-2xl">
        <ExerciseForm lessons={lessons} />
      </div>
    </div>
  );
}
