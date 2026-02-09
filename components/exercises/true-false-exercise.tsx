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
          variant={selectedAnswer === 'true' ? 'default' : 'outline'}
          className={cn(
            'flex-1',
            selectedAnswer === 'true' && 'ring-primary ring-2'
          )}
          onClick={() => onAnswer('true')}
        >
          Đúng
        </Button>
        <Button
          size="lg"
          variant={selectedAnswer === 'false' ? 'default' : 'outline'}
          className={cn(
            'flex-1',
            selectedAnswer === 'false' && 'ring-primary ring-2'
          )}
          onClick={() => onAnswer('false')}
        >
          Sai
        </Button>
      </div>
    </div>
  );
}
