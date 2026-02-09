'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TrueFalseExerciseProps = {
  question: string;
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
};

export function TrueFalseExercise({
  question,
  selectedAnswer,
  onAnswer,
}: TrueFalseExerciseProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">{question}</div>
      <div className="flex gap-4">
        <Button
          size="lg"
          variant={selectedAnswer === 'Đúng' ? 'default' : 'outline'}
          className={cn(
            'flex-1',
            selectedAnswer === 'Đúng' && 'ring-primary ring-2'
          )}
          onClick={() => onAnswer('Đúng')}
        >
          Đúng
        </Button>
        <Button
          size="lg"
          variant={selectedAnswer === 'Sai' ? 'default' : 'outline'}
          className={cn(
            'flex-1',
            selectedAnswer === 'Sai' && 'ring-primary ring-2'
          )}
          onClick={() => onAnswer('Sai')}
        >
          Sai
        </Button>
      </div>
    </div>
  );
}
