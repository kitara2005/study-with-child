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

interface Lesson {
  id: string;
  title: string;
  chapter: {
    name: string;
    subject: { name: string };
  };
}

interface ExerciseFormProps {
  lessons: Lesson[];
  exercise?: {
    id: string;
    lessonId: string;
    type: string;
    question: string;
    options: any;
    correctAnswer: string;
    explanation: string | null;
    orderIndex: number;
  };
}

export function ExerciseForm({ lessons, exercise }: ExerciseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    lessonId: exercise?.lessonId || '',
    type: exercise?.type || 'MULTIPLE_CHOICE',
    question: exercise?.question || '',
    options: exercise ? JSON.stringify(exercise.options, null, 2) : '',
    correctAnswer: exercise?.correctAnswer || '',
    explanation: exercise?.explanation || '',
    orderIndex: exercise?.orderIndex || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = exercise
        ? `/api/admin/exercises/${exercise.id}`
        : '/api/admin/exercises';
      const method = exercise ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          options: formData.options ? JSON.parse(formData.options) : null,
          orderIndex: Number(formData.orderIndex),
        }),
      });

      if (response.ok) {
        router.push('/admin/exercises');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Bài học</Label>
        <Select
          value={formData.lessonId}
          onValueChange={(value) =>
            setFormData({ ...formData, lessonId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn bài học" />
          </SelectTrigger>
          <SelectContent>
            {lessons.map((lesson) => (
              <SelectItem key={lesson.id} value={lesson.id}>
                {lesson.chapter.subject.name} - {lesson.chapter.name} -{' '}
                {lesson.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Loại bài tập</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MULTIPLE_CHOICE">Trắc nghiệm</SelectItem>
            <SelectItem value="FILL_BLANK">Điền từ</SelectItem>
            <SelectItem value="DRAG_DROP">Kéo thả</SelectItem>
            <SelectItem value="TRUE_FALSE">Đúng/Sai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="question">Câu hỏi</Label>
        <Textarea
          id="question"
          value={formData.question}
          onChange={(e) =>
            setFormData({ ...formData, question: e.target.value })
          }
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="options">Đáp án (JSON)</Label>
        <Textarea
          id="options"
          value={formData.options}
          onChange={(e) =>
            setFormData({ ...formData, options: e.target.value })
          }
          rows={5}
          className="font-mono text-xs"
          placeholder='[{"label": "A", "value": "..."}]'
        />
      </div>

      <div>
        <Label htmlFor="correctAnswer">Đáp án đúng</Label>
        <Input
          id="correctAnswer"
          value={formData.correctAnswer}
          onChange={(e) =>
            setFormData({ ...formData, correctAnswer: e.target.value })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="explanation">Giải thích</Label>
        <Textarea
          id="explanation"
          value={formData.explanation}
          onChange={(e) =>
            setFormData({ ...formData, explanation: e.target.value })
          }
          rows={3}
        />
      </div>

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

      <Button type="submit" disabled={loading}>
        {loading ? 'Đang lưu...' : 'Lưu'}
      </Button>
    </form>
  );
}
