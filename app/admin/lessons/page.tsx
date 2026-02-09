import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

export default async function LessonsPage() {
  const lessons = await prisma.lesson.findMany({
    orderBy: [
      { chapter: { subject: { orderIndex: 'asc' } } },
      { orderIndex: 'asc' },
    ],
    include: {
      chapter: {
        include: {
          subject: true,
        },
      },
      exercises: true,
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bài học</h1>
        <Button asChild>
          <Link href="/admin/lessons/new">Tạo bài học mới</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Môn học</TableHead>
            <TableHead>Chương</TableHead>
            <TableHead>Số bài tập</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow key={lesson.id}>
              <TableCell className="font-medium">{lesson.title}</TableCell>
              <TableCell>{lesson.chapter.subject.name}</TableCell>
              <TableCell>{lesson.chapter.name}</TableCell>
              <TableCell>{lesson.exercises.length}</TableCell>
              <TableCell>
                {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/lessons/${lesson.id}/edit`}>
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
