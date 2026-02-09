import { Exercise, ExerciseType } from '@/lib/generated/prisma';
import { calculateStars } from './star-calculator';

export type UserAnswer = {
  exerciseId: string;
  answer: string;
};

export type GradingDetail = {
  exerciseId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
};

export type GradingResult = {
  score: number; // 0-100
  stars: number; // 0-3
  totalQuestions: number;
  correctCount: number;
  details: GradingDetail[];
};

export function gradeExercises(
  exercises: Exercise[],
  userAnswers: UserAnswer[]
): GradingResult {
  const answerMap = new Map(userAnswers.map((a) => [a.exerciseId, a.answer]));

  const details: GradingDetail[] = exercises.map((exercise) => {
    const userAnswer = answerMap.get(exercise.id) || '';
    const isCorrect = checkAnswer(
      exercise.type,
      userAnswer,
      exercise.correctAnswer
    );

    return {
      exerciseId: exercise.id,
      question: exercise.question,
      userAnswer,
      correctAnswer: exercise.correctAnswer,
      isCorrect,
      explanation: exercise.explanation || undefined,
    };
  });

  const correctCount = details.filter((d) => d.isCorrect).length;
  const score =
    exercises.length > 0
      ? Math.round((correctCount / exercises.length) * 100)
      : 0;
  const stars = calculateStars(score);

  return {
    score,
    stars,
    totalQuestions: exercises.length,
    correctCount,
    details,
  };
}

function checkAnswer(
  type: ExerciseType,
  userAnswer: string,
  correctAnswer: string
): boolean {
  const normalizedUser = userAnswer.trim().toLowerCase();
  const normalizedCorrect = correctAnswer.trim().toLowerCase();

  switch (type) {
    case 'MULTIPLE_CHOICE':
    case 'TRUE_FALSE':
      return normalizedUser === normalizedCorrect;
    case 'FILL_BLANK':
      return normalizedUser === normalizedCorrect;
    case 'DRAG_DROP':
      // Skip drag-drop in MVP
      return false;
    default:
      return false;
  }
}
