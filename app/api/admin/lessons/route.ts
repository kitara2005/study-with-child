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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { title, slug, chapterId, theoryContent, orderIndex } = body;

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
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
