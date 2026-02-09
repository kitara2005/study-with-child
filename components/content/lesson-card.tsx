import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

type LessonCardProps = {
  lesson: {
    id: string;
    title: string;
    slug: string;
    orderIndex: number;
  };
  subjectSlug: string;
  chapterSlug: string;
};

export function LessonCard({
  lesson,
  subjectSlug,
  chapterSlug,
}: LessonCardProps) {
  return (
    <Link href={`/mon/${subjectSlug}/${chapterSlug}/${lesson.slug}`}>
      <Card className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700">
              {lesson.orderIndex}
            </div>
            <CardTitle className="flex-1 text-base">{lesson.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <FileText className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-xs">Chưa học</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
