'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MultipleChoiceExerciseProps = {
  question: string;
  options: { label: string; value: string }[];
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
};

export function MultipleChoiceExercise({
  question,
  options,
  selectedAnswer,
  onAnswer,
}: MultipleChoiceExerciseProps) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">{question}</div>
      <div className="space-y-3">
        {options.map((option) => (
          <Card
            key={option.value}
            className={cn(
              'hover:border-primary cursor-pointer p-4 transition-all',
              selectedAnswer === option.value &&
                'border-primary bg-primary/5 ring-primary ring-2'
            )}
            onClick={() => onAnswer(option.value)}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-5 w-5 rounded-full border-2 transition-all',
                  selectedAnswer === option.value
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                )}
              >
                {selectedAnswer === option.value && (
                  <div className="h-full w-full scale-50 rounded-full bg-white" />
                )}
              </div>
              <span>{option.label}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
