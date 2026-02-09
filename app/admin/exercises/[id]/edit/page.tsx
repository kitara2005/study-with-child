import { notFound } from 'next/navigation';
import { ExerciseForm } from '@/components/admin/exercise-form';
import { prisma } from '@/lib/prisma';

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id },
  });

  if (!exercise) {
    notFound();
  }

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
      <h1 className="mb-8 text-3xl font-bold">Chỉnh sửa bài tập</h1>
      <div className="max-w-2xl">
        <ExerciseForm lessons={lessons} exercise={exercise} />
      </div>
    </div>
  );
}
