'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Subject {
  id: string;
  name: string;
  chapters: Array<{ id: string; name: string }>;
}

interface LessonFormProps {
  subjects: Subject[];
  lesson?: {
    id: string;
    title: string;
    slug: string;
    chapterId: string;
    theoryContent: any;
    orderIndex: number;
  };
}

export function LessonForm({ subjects, lesson }: LessonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    lesson
      ? subjects.find((s) => s.chapters.some((c) => c.id === lesson.chapterId))
          ?.id
      : ''
  );

  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    slug: lesson?.slug || '',
    chapterId: lesson?.chapterId || '',
    theoryContent: lesson ? JSON.stringify(lesson.theoryContent, null, 2) : '',
    orderIndex: lesson?.orderIndex || 0,
  });

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = lesson
        ? `/api/admin/lessons/${lesson.id}`
        : '/api/admin/lessons';
      const method = lesson ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          theoryContent: JSON.parse(formData.theoryContent),
          orderIndex: Number(formData.orderIndex),
        }),
      });

      if (response.ok) {
        router.push('/admin/lessons');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Tiêu đề</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
              slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
            })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Môn học</Label>
        <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn môn học" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSubject && (
        <div>
          <Label>Chương</Label>
          <Select
            value={formData.chapterId}
            onValueChange={(value) =>
              setFormData({ ...formData, chapterId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn chương" />
            </SelectTrigger>
            <SelectContent>
              {selectedSubject.chapters.map((chapter) => (
                <SelectItem key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="orderIndex">Thứ tự</Label>
        <Input
          id="orderIndex"
          type="number"
          value={formData.orderIndex}
          onChange={(e) =>
            setFormData({ ...formData, orderIndex: Number(e.target.value) })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="theoryContent">Nội dung (JSON)</Label>
        <Textarea
          id="theoryContent"
          value={formData.theoryContent}
          onChange={(e) =>
            setFormData({ ...formData, theoryContent: e.target.value })
          }
          rows={10}
          className="font-mono text-xs"
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Đang lưu...' : 'Lưu'}
      </Button>
    </form>
  );
}
