'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StarDisplay } from './star-display';
import { AnswerBreakdown } from './answer-breakdown';
import type { GradingDetail } from '@/lib/grading/auto-grader';
import { RotateCcw, ArrowRight } from 'lucide-react';

type ResultScreenProps = {
  score: number;
  stars: number;
  details: GradingDetail[];
  onRetry: () => void;
  onNext?: () => void;
};

export function ResultScreen({
  score,
  stars,
  details,
  onRetry,
  onNext,
}: ResultScreenProps) {
  const correctCount = details.filter((d) => d.isCorrect).length;
  const totalCount = details.length;

  return (
    <div className="space-y-6">
      {/* Score card */}
      <Card className="p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold">Kết quả</h2>
        <div className="mb-4 flex justify-center">
          <StarDisplay stars={stars} size="lg" />
        </div>
        <div className="text-primary mb-2 text-4xl font-bold">{score}/100</div>
        <p className="text-muted-foreground">
          Đúng {correctCount}/{totalCount} câu
        </p>
      </Card>

      {/* Answer breakdown */}
      <AnswerBreakdown details={details} />

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onRetry} className="flex-1">
          <RotateCcw className="h-4 w-4" />
          Làm lại
        </Button>
        {onNext && (
          <Button onClick={onNext} className="flex-1">
            Bài tiếp theo
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
