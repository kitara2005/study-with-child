'use client';

import { useState } from 'react';
import { LessonContent } from '@/types/content';
import { Exercise } from '@/lib/generated/prisma';
import { TheoryRenderer } from './theory-renderer';
import { ExerciseContainer } from '@/components/exercises/exercise-container';
import { Button } from '@/components/ui/button';
import { BookOpen, PenTool } from 'lucide-react';

type LessonTabsProps = {
  theoryContent: LessonContent;
  exercises: Exercise[];
  lessonId: string;
  onNext?: () => void;
};

export function LessonTabs({
  theoryContent,
  exercises,
  lessonId,
  onNext,
}: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<'theory' | 'exercises'>('theory');

  return (
    <div className="space-y-6">
      {/* Tab buttons */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'theory' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('theory')}
          className="rounded-b-none"
        >
          <BookOpen className="h-4 w-4" />
          Lý thuyết
        </Button>
        <Button
          variant={activeTab === 'exercises' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('exercises')}
          className="rounded-b-none"
        >
          <PenTool className="h-4 w-4" />
          Bài tập ({exercises.length})
        </Button>
      </div>

      {/* Tab content */}
      <div className="py-4">
        {activeTab === 'theory' ? (
          <TheoryRenderer content={theoryContent} />
        ) : (
          <ExerciseContainer
            exercises={exercises}
            lessonId={lessonId}
            onNext={onNext}
          />
        )}
      </div>
    </div>
  );
}
