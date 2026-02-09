'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FillBlankExerciseProps = {
  question: string;
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
};

export function FillBlankExercise({
  question,
  selectedAnswer,
  onAnswer,
}: FillBlankExerciseProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor="answer" className="text-lg font-medium">
        {question}
      </Label>
      <Input
        id="answer"
        type="text"
        placeholder="Nhập câu trả lời..."
        value={selectedAnswer}
        onChange={(e) => onAnswer(e.target.value)}
        className="text-base"
      />
    </div>
  );
}
