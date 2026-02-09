'use client';

import { useState } from 'react';
import { LessonContent } from '@/types/content';
import { TheoryRenderer } from './theory-renderer';
import { Button } from '@/components/ui/button';
import { BookOpen, PenTool } from 'lucide-react';

type LessonTabsProps = {
  theoryContent: LessonContent;
  exerciseCount: number;
};

export function LessonTabs({ theoryContent, exerciseCount }: LessonTabsProps) {
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
          Bài tập ({exerciseCount})
        </Button>
      </div>

      {/* Tab content */}
      <div className="py-4">
        {activeTab === 'theory' ? (
          <TheoryRenderer content={theoryContent} />
        ) : (
          <div className="text-muted-foreground py-12 text-center">
            <PenTool className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>Bài tập sẽ được thêm trong Phase 05</p>
          </div>
        )}
      </div>
    </div>
  );
}
