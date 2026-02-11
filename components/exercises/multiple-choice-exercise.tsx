'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

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
        {options.map((option) => {
          const isSelected = selectedAnswer === option.label;
          return (
            <Card
              key={option.value}
              className={cn(
                'cursor-pointer border-2 p-4 transition-all',
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
              onClick={() => onAnswer(option.label)}
            >
              <div className="flex items-center gap-3">
                {isSelected ? (
                  <CircleCheck className="h-6 w-6 shrink-0 text-blue-600" />
                ) : (
                  <div className="h-6 w-6 shrink-0 rounded-full border-2 border-gray-300" />
                )}
                <span className={cn(isSelected && 'font-medium text-blue-900')}>
                  <span className="font-semibold">{option.label}.</span>{' '}
                  {option.value}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
