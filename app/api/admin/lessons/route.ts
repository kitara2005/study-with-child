import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET() {
  try {
    await requireAdmin();

    const lessons = await prisma.lesson.findMany({
      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
        exercises: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/admin/lessons error:', error);
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
    const { title, slug, chapterId, theoryContent, orderIndex } = body;

    // Validate required fields
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Slug is required and must be a string' },
        { status: 400 }
      );
    }
    if (!chapterId || typeof chapterId !== 'string') {
      return NextResponse.json(
        { error: 'ChapterId is required and must be a string' },
        { status: 400 }
      );
    }
    if (!theoryContent || typeof theoryContent !== 'object') {
      return NextResponse.json(
        { error: 'TheoryContent is required and must be an object' },
        { status: 400 }
      );
    }
    if (typeof orderIndex !== 'number') {
      return NextResponse.json(
        { error: 'OrderIndex must be a number' },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        slug,
        chapterId,
        theoryContent,
        orderIndex,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('POST /api/admin/lessons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
