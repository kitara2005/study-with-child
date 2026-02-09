import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '../../lib/generated/prisma';

const prisma = new PrismaClient();

interface LessonSection {
  type: 'heading' | 'paragraph' | 'visual' | 'example';
  content?: string;
  question?: string;
  solution?: string;
  visualType?: string;
  data?: Record<string, unknown>;
}

interface LessonContent {
  sections: LessonSection[];
  keyPoints: string[];
}

interface Exercise {
  type: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRUE_FALSE';
  question: string;
  options?: Array<{ label: string; value: string }>;
  correctAnswer: string;
  explanation: string;
  orderIndex: number;
}

interface LessonData {
  subject: string;
  chapter: string;
  title: string;
  slug: string;
  orderIndex: number;
  theoryContent: LessonContent;
  exercises: Exercise[];
}

const CONTENT_DIR = join(process.cwd(), 'content');

async function importLessonFile(filePath: string): Promise<boolean> {
  const relativePath = filePath.replace(process.cwd(), '');

  try {
    const content = readFileSync(filePath, 'utf-8');
    const data: LessonData = JSON.parse(content);

    // Find subject
    const subject = await prisma.subject.findUnique({
      where: { slug: data.subject },
    });

    if (!subject) {
      console.error(`❌ ${relativePath}: Subject "${data.subject}" not found`);
      return false;
    }

    // Find or create chapter
    const chapter = await prisma.chapter.upsert({
      where: {
        subjectId_slug: {
          subjectId: subject.id,
          slug: data.chapter,
        },
      },
      update: {},
      create: {
        subjectId: subject.id,
        slug: data.chapter,
        name:
          data.chapter === 'chuong-1'
            ? data.subject === 'toan'
              ? 'Ôn tập và bổ sung'
              : 'Thương người như thể thương thân'
            : data.subject === 'toan'
              ? 'Số tự nhiên'
              : 'Măng mọc thẳng',
        semester: 1,
        orderIndex: parseInt(data.chapter.replace('chuong-', '')),
      },
    });

    // Upsert lesson
    const lesson = await prisma.lesson.upsert({
      where: {
        chapterId_slug: {
          chapterId: chapter.id,
          slug: data.slug,
        },
      },
      update: {
        title: data.title,
        theoryContent: data.theoryContent as any,
        orderIndex: data.orderIndex,
      },
      create: {
        chapterId: chapter.id,
        title: data.title,
        slug: data.slug,
        theoryContent: data.theoryContent as any,
        orderIndex: data.orderIndex,
      },
    });

    // Delete existing exercises for this lesson
    await prisma.exercise.deleteMany({
      where: { lessonId: lesson.id },
    });

    // Create exercises
    for (const exercise of data.exercises) {
      await prisma.exercise.create({
        data: {
          lessonId: lesson.id,
          type: exercise.type,
          question: exercise.question,
          options: exercise.options as any,
          correctAnswer: exercise.correctAnswer,
          explanation: exercise.explanation,
          orderIndex: exercise.orderIndex,
        },
      });
    }

    console.log(
      `✅ ${relativePath} → ${data.subject}/${data.chapter}/${data.slug}`
    );
    return true;
  } catch (error) {
    console.error(`❌ ${relativePath}: ${error}`);
    return false;
  }
}

async function scanAndImport(dir: string): Promise<number> {
  let imported = 0;
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      imported += await scanAndImport(fullPath);
    } else if (entry.endsWith('.json')) {
      const success = await importLessonFile(fullPath);
      if (success) imported++;
    }
  }

  return imported;
}

async function main() {
  console.log('📦 Importing lesson content to database...\n');

  if (!statSync(CONTENT_DIR).isDirectory()) {
    console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const imported = await scanAndImport(CONTENT_DIR);

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Import Summary:`);
  console.log(`   Lessons imported: ${imported}`);
  console.log('='.repeat(60));

  if (imported > 0) {
    console.log('\n✅ Content import completed successfully!');
  } else {
    console.error('\n❌ No content was imported');
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Import failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
