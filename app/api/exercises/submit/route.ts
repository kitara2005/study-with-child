import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { gradeExercises, type UserAnswer } from '@/lib/grading/auto-grader';
import { calculateStars } from '@/lib/grading/star-calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, answers, timeSpent } = body as {
      lessonId: string;
      answers: UserAnswer[];
      timeSpent?: number;
    };

    if (!lessonId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch exercises for this lesson
    const exercises = await prisma.exercise.findMany({
      where: { lessonId },
      orderBy: { orderIndex: 'asc' },
    });

    if (exercises.length === 0) {
      return NextResponse.json(
        { error: 'No exercises found' },
        { status: 404 }
      );
    }

    // Grade the exercises
    const gradingResult = gradeExercises(exercises, answers);

    // TODO: Save result to database when auth is implemented
    // For now, just return the grading result

    return NextResponse.json(gradingResult);
  } catch (error) {
    console.error('Submit exercise error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
