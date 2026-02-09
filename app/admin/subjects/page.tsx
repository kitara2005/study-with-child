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

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { orderIndex: 'asc' },
    include: {
      chapters: {
        include: {
          lessons: true,
        },
      },
    },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Môn học</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên môn học</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Số chương</TableHead>
            <TableHead>Số bài học</TableHead>
            <TableHead>Màu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => {
            const totalLessons = subject.chapters.reduce(
              (sum, chapter) => sum + chapter.lessons.length,
              0
            );

            return (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.name}</TableCell>
                <TableCell>
                  <code className="text-muted-foreground text-xs">
                    {subject.slug}
                  </code>
                </TableCell>
                <TableCell>{subject.chapters.length}</TableCell>
                <TableCell>{totalLessons}</TableCell>
                <TableCell>
                  <Badge>{subject.color}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
