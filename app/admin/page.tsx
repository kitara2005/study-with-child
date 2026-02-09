import { BookOpen, FileText, ListChecks, Users, Layers } from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [
    subjectsCount,
    chaptersCount,
    lessonsCount,
    exercisesCount,
    usersCount,
  ] = await Promise.all([
    prisma.subject.count(),
    prisma.chapter.count(),
    prisma.lesson.count(),
    prisma.exercise.count(),
    prisma.user.count(),
  ]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Bảng điều khiển</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Môn học" value={subjectsCount} icon={BookOpen} />
        <StatsCard title="Chương" value={chaptersCount} icon={Layers} />
        <StatsCard title="Bài học" value={lessonsCount} icon={FileText} />
        <StatsCard title="Bài tập" value={exercisesCount} icon={ListChecks} />
        <StatsCard title="Người dùng" value={usersCount} icon={Users} />
      </div>
    </div>
  );
}
