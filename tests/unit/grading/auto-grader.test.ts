import { describe, it, expect } from 'vitest';
import { gradeExercises, UserAnswer } from '@/lib/grading/auto-grader';
import { Exercise, ExerciseType } from '@/lib/generated/prisma';

describe('gradeExercises', () => {
  const mockExercise = (
    id: string,
    type: ExerciseType,
    correctAnswer: string,
    question = 'Test question'
  ): Exercise => ({
    id,
    lessonId: 'lesson-1',
    type,
    question,
    options: null,
    correctAnswer,
    explanation: 'Test explanation',
    orderIndex: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  describe('MULTIPLE_CHOICE grading', () => {
    it('should mark correct answer as correct', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.MULTIPLE_CHOICE, 'A'),
      ];
      const userAnswers: UserAnswer[] = [{ exerciseId: 'ex-1', answer: 'A' }];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(1);
      expect(result.totalQuestions).toBe(1);
      expect(result.score).toBe(100);
      expect(result.stars).toBe(3);
      expect(result.details[0].isCorrect).toBe(true);
    });

    it('should mark incorrect answer as incorrect', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.MULTIPLE_CHOICE, 'A'),
      ];
      const userAnswers: UserAnswer[] = [{ exerciseId: 'ex-1', answer: 'B' }];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(0);
      expect(result.totalQuestions).toBe(1);
      expect(result.score).toBe(0);
      expect(result.stars).toBe(0);
      expect(result.details[0].isCorrect).toBe(false);
    });

    it('should be case insensitive', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.MULTIPLE_CHOICE, 'A'),
      ];
      const userAnswers: UserAnswer[] = [{ exerciseId: 'ex-1', answer: 'a' }];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.details[0].isCorrect).toBe(true);
    });

    it('should trim whitespace', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.MULTIPLE_CHOICE, 'A'),
      ];
      const userAnswers: UserAnswer[] = [
        { exerciseId: 'ex-1', answer: '  A  ' },
      ];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.details[0].isCorrect).toBe(true);
    });
  });

  describe('FILL_BLANK grading', () => {
    it('should mark correct answer as correct', () => {
      const exercises = [mockExercise('ex-1', ExerciseType.FILL_BLANK, '42')];
      const userAnswers: UserAnswer[] = [{ exerciseId: 'ex-1', answer: '42' }];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(1);
      expect(result.details[0].isCorrect).toBe(true);
    });

    it('should mark incorrect answer as incorrect', () => {
      const exercises = [mockExercise('ex-1', ExerciseType.FILL_BLANK, '42')];
      const userAnswers: UserAnswer[] = [{ exerciseId: 'ex-1', answer: '43' }];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(0);
      expect(result.details[0].isCorrect).toBe(false);
    });

    it('should be case insensitive for text answers', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.FILL_BLANK, 'Hello'),
      ];
      const userAnswers: UserAnswer[] = [
        { exerciseId: 'ex-1', answer: 'hello' },
      ];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.details[0].isCorrect).toBe(true);
    });
  });

  describe('TRUE_FALSE grading', () => {
    it('should mark correct answer as correct', () => {
      const exercises = [mockExercise('ex-1', ExerciseType.TRUE_FALSE, 'Đúng')];
      const userAnswers: UserAnswer[] = [
        { exerciseId: 'ex-1', answer: 'Đúng' },
      ];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(1);
      expect(result.details[0].isCorrect).toBe(true);
    });

    it('should mark incorrect answer as incorrect', () => {
      const exercises = [mockExercise('ex-1', ExerciseType.TRUE_FALSE, 'Đúng')];
      const userAnswers: UserAnswer[] = [{ exerciseId: 'ex-1', answer: 'Sai' }];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(0);
      expect(result.details[0].isCorrect).toBe(false);
    });
  });

  describe('score calculation', () => {
    it('should calculate correct percentage', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.MULTIPLE_CHOICE, 'A'),
        mockExercise('ex-2', ExerciseType.MULTIPLE_CHOICE, 'B'),
        mockExercise('ex-3', ExerciseType.MULTIPLE_CHOICE, 'C'),
        mockExercise('ex-4', ExerciseType.MULTIPLE_CHOICE, 'D'),
      ];
      const userAnswers: UserAnswer[] = [
        { exerciseId: 'ex-1', answer: 'A' },
        { exerciseId: 'ex-2', answer: 'B' },
        { exerciseId: 'ex-3', answer: 'X' },
        { exerciseId: 'ex-4', answer: 'Y' },
      ];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(2);
      expect(result.totalQuestions).toBe(4);
      expect(result.score).toBe(50);
      expect(result.stars).toBe(2);
    });

    it('should round score to nearest integer', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.MULTIPLE_CHOICE, 'A'),
        mockExercise('ex-2', ExerciseType.MULTIPLE_CHOICE, 'B'),
        mockExercise('ex-3', ExerciseType.MULTIPLE_CHOICE, 'C'),
      ];
      const userAnswers: UserAnswer[] = [
        { exerciseId: 'ex-1', answer: 'A' },
        { exerciseId: 'ex-2', answer: 'X' },
        { exerciseId: 'ex-3', answer: 'Y' },
      ];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(1);
      expect(result.score).toBe(33); // 1/3 = 33.333... rounded to 33
    });
  });

  describe('empty submissions', () => {
    it('should handle empty answers', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.MULTIPLE_CHOICE, 'A'),
      ];
      const userAnswers: UserAnswer[] = [{ exerciseId: 'ex-1', answer: '' }];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(0);
      expect(result.details[0].isCorrect).toBe(false);
      expect(result.details[0].userAnswer).toBe('');
    });

    it('should handle missing answers', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.MULTIPLE_CHOICE, 'A'),
        mockExercise('ex-2', ExerciseType.MULTIPLE_CHOICE, 'B'),
      ];
      const userAnswers: UserAnswer[] = [{ exerciseId: 'ex-1', answer: 'A' }];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.correctCount).toBe(1);
      expect(result.totalQuestions).toBe(2);
      expect(result.details[0].isCorrect).toBe(true);
      expect(result.details[1].isCorrect).toBe(false);
      expect(result.details[1].userAnswer).toBe('');
    });

    it('should return zero score for no exercises', () => {
      const exercises: Exercise[] = [];
      const userAnswers: UserAnswer[] = [];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.score).toBe(0);
      expect(result.stars).toBe(0);
      expect(result.totalQuestions).toBe(0);
      expect(result.correctCount).toBe(0);
    });
  });

  describe('result details', () => {
    it('should include all question details', () => {
      const exercises = [
        mockExercise('ex-1', ExerciseType.MULTIPLE_CHOICE, 'A', 'Question 1'),
      ];
      const userAnswers: UserAnswer[] = [{ exerciseId: 'ex-1', answer: 'B' }];

      const result = gradeExercises(exercises, userAnswers);

      expect(result.details).toHaveLength(1);
      expect(result.details[0]).toMatchObject({
        exerciseId: 'ex-1',
        question: 'Question 1',
        userAnswer: 'B',
        correctAnswer: 'A',
        isCorrect: false,
        explanation: 'Test explanation',
      });
    });
  });
});
