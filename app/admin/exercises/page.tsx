import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { prisma } from '@/lib/prisma';
import { Edit } from 'lucide-react';

export default async function ExercisesPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      lesson: {
        include: {
          chapter: {
            include: {
              subject: true,
            },
          },
        },
      },
    },
  });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MULTIPLE_CHOICE: 'Trắc nghiệm',
      FILL_BLANK: 'Điền từ',
      DRAG_DROP: 'Kéo thả',
      TRUE_FALSE: 'Đúng/Sai',
    };
    return labels[type] || type;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bài tập</h1>
        <Button asChild>
          <Link href="/admin/exercises/new">Tạo bài tập mới</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Câu hỏi</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Bài học</TableHead>
            <TableHead>Môn học</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell className="max-w-md truncate font-medium">
                {exercise.question}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{getTypeLabel(exercise.type)}</Badge>
              </TableCell>
              <TableCell>{exercise.lesson.title}</TableCell>
              <TableCell>{exercise.lesson.chapter.subject.name}</TableCell>
              <TableCell>
                {new Date(exercise.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/exercises/${exercise.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
