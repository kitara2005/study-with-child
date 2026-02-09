import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

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
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  try {
    await execAsync('npx tsx scripts/content/import-content.ts');
    console.log('✅ All lessons and exercises imported from content files');
  } catch (error) {
    console.error('❌ Failed to import content:', error);
    throw error;
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
