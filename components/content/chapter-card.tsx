import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

type ChapterCardProps = {
  chapter: {
    id: string;
    name: string;
    slug: string;
    _count?: { lessons: number };
  };
  subjectSlug: string;
};

export function ChapterCard({ chapter, subjectSlug }: ChapterCardProps) {
  const lessonCount = chapter._count?.lessons ?? 0;

  return (
    <Link href={`/mon/${subjectSlug}/${chapter.slug}`}>
      <Card className="h-full cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-start justify-between text-lg">
            <span>{chapter.name}</span>
            <div className="text-muted-foreground flex items-center gap-1 text-sm font-normal">
              <BookOpen className="h-4 w-4" />
              <span>{lessonCount}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {lessonCount} bài học
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
