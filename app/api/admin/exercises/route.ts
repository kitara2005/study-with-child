import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET() {
  try {
    await requireAdmin();

    const exercises = await prisma.exercise.findMany({
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/admin/exercises error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      lessonId,
      type,
      question,
      options,
      correctAnswer,
      explanation,
      orderIndex,
    } = body;

    // Validate required fields
    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json(
        { error: 'LessonId is required and must be a string' },
        { status: 400 }
      );
    }
    if (
      !type ||
      !['MULTIPLE_CHOICE', 'FILL_BLANK', 'TRUE_FALSE'].includes(type)
    ) {
      return NextResponse.json(
        { error: 'Type must be MULTIPLE_CHOICE, FILL_BLANK, or TRUE_FALSE' },
        { status: 400 }
      );
    }
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }
    if (!correctAnswer || typeof correctAnswer !== 'string') {
      return NextResponse.json(
        { error: 'CorrectAnswer is required and must be a string' },
        { status: 400 }
      );
    }
    if (typeof orderIndex !== 'number') {
      return NextResponse.json(
        { error: 'OrderIndex must be a number' },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.create({
      data: {
        lessonId,
        type,
        question,
        options,
        correctAnswer,
        explanation,
        orderIndex,
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('POST /api/admin/exercises error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
