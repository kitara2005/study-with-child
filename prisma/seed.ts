import { PrismaClient } from '../lib/generated/prisma';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

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

async function importLessonFile(filePath: string): Promise<boolean> {
  const relativePath = filePath.replace(process.cwd(), '');

  try {
    const content = readFileSync(filePath, 'utf-8');
    const data: LessonData = JSON.parse(content);

    const subject = await prisma.subject.findUnique({
      where: { slug: data.subject },
    });

    if (!subject) {
      console.error(`❌ ${relativePath}: Subject "${data.subject}" not found`);
      return false;
    }

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

    await prisma.exercise.deleteMany({
      where: { lessonId: lesson.id },
    });

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
  console.log('🌱 Starting seed...');

  // Seed Subjects
  const subjects = [
    {
      name: 'Toán',
      slug: 'toan',
      icon: 'Calculator',
      color: 'blue',
      orderIndex: 1,
    },
    {
      name: 'Tiếng Việt',
      slug: 'tieng-viet',
      icon: 'BookOpen',
      color: 'green',
      orderIndex: 2,
    },
    {
      name: 'Khoa học',
      slug: 'khoa-hoc',
      icon: 'Microscope',
      color: 'purple',
      orderIndex: 3,
    },
    {
      name: 'Lịch sử & Địa lý',
      slug: 'lich-su-dia-ly',
      icon: 'Globe',
      color: 'orange',
      orderIndex: 4,
    },
    {
      name: 'Đạo đức',
      slug: 'dao-duc',
      icon: 'Heart',
      color: 'red',
      orderIndex: 5,
    },
    {
      name: 'Âm nhạc',
      slug: 'am-nhac',
      icon: 'Music',
      color: 'pink',
      orderIndex: 6,
    },
    {
      name: 'Mỹ thuật',
      slug: 'my-thuat',
      icon: 'Palette',
      color: 'yellow',
      orderIndex: 7,
    },
    {
      name: 'Thể dục',
      slug: 'the-duc',
      icon: 'Activity',
      color: 'cyan',
      orderIndex: 8,
    },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {},
      create: subject,
    });
  }
  console.log('✅ Subjects seeded');

  // Get Toán and Tiếng Việt subjects
  const toan = await prisma.subject.findUnique({ where: { slug: 'toan' } });
  const tiengViet = await prisma.subject.findUnique({
    where: { slug: 'tieng-viet' },
  });

  if (!toan || !tiengViet) {
    throw new Error('Failed to find subjects');
  }

  // Seed Toán Chapters
  const toanChapter1 = await prisma.chapter.upsert({
    where: { subjectId_slug: { subjectId: toan.id, slug: 'chuong-1' } },
    update: {},
    create: {
      subjectId: toan.id,
      name: 'Ôn tập và bổ sung',
      slug: 'chuong-1',
      semester: 1,
      orderIndex: 1,
    },
  });

  const toanChapter2 = await prisma.chapter.upsert({
    where: { subjectId_slug: { subjectId: toan.id, slug: 'chuong-2' } },
    update: {},
    create: {
      subjectId: toan.id,
      name: 'Số tự nhiên',
      slug: 'chuong-2',
      semester: 1,
      orderIndex: 2,
    },
  });

  // Seed Tiếng Việt Chapters
  const tvChapter1 = await prisma.chapter.upsert({
    where: { subjectId_slug: { subjectId: tiengViet.id, slug: 'chuong-1' } },
    update: {},
    create: {
      subjectId: tiengViet.id,
      name: 'Thương người như thể thương thân',
      slug: 'chuong-1',
      semester: 1,
      orderIndex: 1,
    },
  });

  const tvChapter2 = await prisma.chapter.upsert({
    where: { subjectId_slug: { subjectId: tiengViet.id, slug: 'chuong-2' } },
    update: {},
    create: {
      subjectId: tiengViet.id,
      name: 'Măng mọc thẳng',
      slug: 'chuong-2',
      semester: 1,
      orderIndex: 2,
    },
  });

  console.log('✅ Chapters seeded');

  // Import all 20 lessons from content/ directory
  console.log('📦 Importing lessons from content files...');
  const contentDir = join(process.cwd(), 'content');

  if (!statSync(contentDir).isDirectory()) {
    console.error(`❌ Content directory not found: ${contentDir}`);
    throw new Error('Content directory not found');
  }

  const imported = await scanAndImport(contentDir);

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Import Summary:`);
  console.log(`   Lessons imported: ${imported}`);
  console.log('='.repeat(60));

  if (imported > 0) {
    console.log('\n✅ All lessons and exercises imported from content files');
  } else {
    console.error('\n❌ No content was imported');
    throw new Error('No content imported');
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
