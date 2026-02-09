'use client';

import { Exercise, ExerciseType } from '@/lib/generated/prisma';
import { MultipleChoiceExercise } from './multiple-choice-exercise';
import { FillBlankExercise } from './fill-blank-exercise';
import { TrueFalseExercise } from './true-false-exercise';

type ExerciseRendererProps = {
  exercise: Exercise;
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
};

export function ExerciseRenderer({
  exercise,
  selectedAnswer,
  onAnswer,
}: ExerciseRendererProps) {
  switch (exercise.type) {
    case ExerciseType.MULTIPLE_CHOICE:
      return (
        <MultipleChoiceExercise
          question={exercise.question}
          options={exercise.options as { label: string; value: string }[]}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
        />
      );
    case ExerciseType.FILL_BLANK:
      return (
        <FillBlankExercise
          question={exercise.question}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
        />
      );
    case ExerciseType.TRUE_FALSE:
      return (
        <TrueFalseExercise
          question={exercise.question}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
        />
      );
    case ExerciseType.DRAG_DROP:
      return (
        <div className="text-muted-foreground py-8 text-center">
          Dạng bài kéo thả sẽ có trong phiên bản sau
        </div>
      );
    default:
      return null;
  }
}
