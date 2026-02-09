'use client';

import { useState } from 'react';
import { Exercise } from '@/lib/generated/prisma';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExerciseRenderer } from './exercise-renderer';
import { ResultScreen } from '@/components/results/result-screen';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GradingResult } from '@/lib/grading/auto-grader';

type ExerciseContainerProps = {
  exercises: Exercise[];
  lessonId: string;
  onNext?: () => void;
};

export function ExerciseContainer({
  exercises,
  lessonId,
  onNext,
}: ExerciseContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string>>(
    new Map()
  );
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [startTime] = useState(Date.now());

  if (exercises.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        Chưa có bài tập nào cho bài học này
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const currentAnswer = userAnswers.get(currentExercise.id) || '';
  const allAnswered = exercises.every((ex) => userAnswers.has(ex.id));

  const handleAnswer = (answer: string) => {
    const newAnswers = new Map(userAnswers);
    newAnswers.set(currentExercise.id, answer);
    setUserAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleSubmit = async () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const answers = Array.from(userAnswers.entries()).map(
      ([exerciseId, answer]) => ({
        exerciseId,
        answer,
      })
    );

    try {
      const response = await fetch('/api/exercises/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, answers, timeSpent }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      const data = await response.json();
      setResult(data);
      setSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    }
  };

  const handleRetry = () => {
    setUserAnswers(new Map());
    setSubmitted(false);
    setResult(null);
    setCurrentIndex(0);
  };

  if (submitted && result) {
    return (
      <ResultScreen
        score={result.score}
        stars={result.stars}
        details={result.details}
        onRetry={handleRetry}
        onNext={onNext}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="text-muted-foreground text-sm">
        Câu {currentIndex + 1}/{exercises.length}
      </div>

      {/* Exercise card */}
      <Card className="p-6">
        <ExerciseRenderer
          exercise={currentExercise}
          selectedAnswer={currentAnswer}
          onAnswer={handleAnswer}
        />
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Câu trước
        </Button>
        <div className="flex-1" />
        {currentIndex < exercises.length - 1 ? (
          <Button onClick={handleNext}>
            Câu tiếp
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!allAnswered}>
            Nộp bài
          </Button>
        )}
      </div>
    </div>
  );
}
