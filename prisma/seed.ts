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

  // Seed Lessons
  const toanLesson1 = await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: toanChapter1.id, slug: 'bai-1' } },
    update: {},
    create: {
      chapterId: toanChapter1.id,
      title: 'Bảng nhân, bảng chia',
      slug: 'bai-1',
      orderIndex: 1,
      theoryContent: {
        sections: [
          { type: 'heading', content: 'Ôn tập bảng nhân và bảng chia' },
          {
            type: 'paragraph',
            content:
              'Bảng nhân và bảng chia là kiến thức cơ bản quan trọng trong toán học. Chúng ta đã học từ lớp 2 và lớp 3, hôm nay chúng ta sẽ ôn tập lại.',
          },
          { type: 'heading', content: 'Bảng nhân' },
          {
            type: 'paragraph',
            content:
              'Bảng nhân là phép tính lấy một số nhân với các số từ 1 đến 10. Ví dụ: 2 × 3 = 6, nghĩa là lấy số 2 cộng với chính nó 3 lần.',
          },
          {
            type: 'example',
            question: 'Tính: 7 × 8 = ?',
            solution:
              '7 × 8 = 56. Ta có thể tính bằng cách cộng số 7 với chính nó 8 lần: 7 + 7 + 7 + 7 + 7 + 7 + 7 + 7 = 56',
          },
          { type: 'heading', content: 'Bảng chia' },
          {
            type: 'paragraph',
            content:
              'Bảng chia là phép tính ngược lại của phép nhân. Nếu biết 7 × 8 = 56, thì ta có: 56 : 7 = 8 hoặc 56 : 8 = 7.',
          },
        ],
        keyPoints: [
          'Bảng nhân là phép tính cộng lặp lại một số nhiều lần',
          'Bảng chia là phép tính ngược của phép nhân',
          'Cần thuộc bảng nhân từ 2 đến 9 để tính nhanh',
        ],
      },
    },
  });

  await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: toanChapter2.id, slug: 'bai-1' } },
    update: {},
    create: {
      chapterId: toanChapter2.id,
      title: 'Số lớn hơn 100 000',
      slug: 'bai-1',
      orderIndex: 1,
      theoryContent: {
        sections: [
          { type: 'heading', content: 'Số có 6 chữ số' },
          {
            type: 'paragraph',
            content:
              'Sau số 99 999 là số 100 000 (một trăm nghìn). Đây là số nhỏ nhất có 6 chữ số. Số lớn nhất có 6 chữ số là 999 999.',
          },
          {
            type: 'example',
            question: 'Đọc số: 345 678',
            solution: 'Ba trăm bốn mươi lăm nghìn, sáu trăm bảy mươi tám',
          },
          { type: 'heading', content: 'Giá trị của các chữ số' },
          {
            type: 'paragraph',
            content:
              'Trong số 345 678: chữ số 3 có giá trị 300 000, chữ số 4 có giá trị 40 000, chữ số 5 có giá trị 5 000.',
          },
        ],
        keyPoints: [
          'Số có 6 chữ số nhỏ nhất là 100 000',
          'Số có 6 chữ số lớn nhất là 999 999',
          'Mỗi chữ số có giá trị khác nhau tùy vào vị trí',
        ],
      },
    },
  });

  await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: tvChapter1.id, slug: 'bai-1' } },
    update: {},
    create: {
      chapterId: tvChapter1.id,
      title: 'Đọc: Sợ ai, sợ chính mình',
      slug: 'bai-1',
      orderIndex: 1,
      theoryContent: {
        sections: [
          { type: 'heading', content: 'Bài đọc: Sợ ai, sợ chính mình' },
          {
            type: 'paragraph',
            content:
              'Có một anh chàng luôn lo lắng về những gì người khác nghĩ về mình. Anh ta sợ bị chê cười, sợ làm sai, sợ không được mọi người yêu quý.',
          },
          {
            type: 'paragraph',
            content:
              'Một hôm, người thầy nói với anh: "Đừng sợ người khác, hãy sợ chính mình. Nếu mình làm điều tốt, ai cũng kính trọng. Còn nếu mình làm điều xấu thì dù có giấu cũng không ai quý."',
          },
          { type: 'heading', content: 'Bài học rút ra' },
          {
            type: 'paragraph',
            content:
              'Hãy sống thật với chính mình. Làm điều tốt không cần ngại người ta biết. Làm điều xấu thì phải hổ thẹn với chính mình trước hết.',
          },
        ],
        keyPoints: [
          'Không nên quá lo lắng về ý kiến của người khác',
          'Làm việc tốt, lương tâm trong sáng là điều quan trọng nhất',
          'Phải tự trọng và tôn trọng chính mình',
        ],
      },
    },
  });

  await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: tvChapter2.id, slug: 'bai-1' } },
    update: {},
    create: {
      chapterId: tvChapter2.id,
      title: 'Đọc: Cây tre Việt Nam',
      slug: 'bai-1',
      orderIndex: 1,
      theoryContent: {
        sections: [
          { type: 'heading', content: 'Cây tre Việt Nam' },
          {
            type: 'paragraph',
            content:
              'Tre là loài cây quen thuộc với người Việt Nam. Tre mọc thẳng, vươn cao, tượng trưng cho sự ngay thẳng và mạnh mẽ.',
          },
          {
            type: 'paragraph',
            content:
              'Người ta thường nói: "Măng mọc thẳng" để so sánh với con người có tính cách thẳng thắn, không vòng vo, gian dối.',
          },
          {
            type: 'example',
            question: 'Vì sao người ta ví người ngay thẳng với cây tre?',
            solution:
              'Vì cây tre luôn mọc thẳng, không cong queo. Tre cũng rất bền, khó bẻ gãy, tượng trưng cho sự kiên cường.',
          },
        ],
        keyPoints: [
          'Tre là biểu tượng của sự ngay thẳng',
          'Măng mọc thẳng là hình ảnh về tính cách tốt đẹp',
          'Tre tượng trưng cho người Việt Nam mạnh mẽ, kiên cường',
        ],
      },
    },
  });

  console.log('✅ Lessons seeded');

  // Seed Exercises for Toán Bài 1
  await prisma.exercise.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      lessonId: toanLesson1.id,
      type: 'MULTIPLE_CHOICE',
      question: 'Tính: 6 × 7 = ?',
      options: [
        { label: 'A', value: '40' },
        { label: 'B', value: '42' },
        { label: 'C', value: '48' },
        { label: 'D', value: '56' },
      ],
      correctAnswer: 'B',
      explanation:
        '6 × 7 = 42. Ta có thể tính bằng cách cộng 6 với chính nó 7 lần.',
      orderIndex: 1,
    },
  });

  await prisma.exercise.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      lessonId: toanLesson1.id,
      type: 'MULTIPLE_CHOICE',
      question: 'Tính: 48 : 6 = ?',
      options: [
        { label: 'A', value: '6' },
        { label: 'B', value: '7' },
        { label: 'C', value: '8' },
        { label: 'D', value: '9' },
      ],
      correctAnswer: 'C',
      explanation: '48 : 6 = 8. Vì 6 × 8 = 48.',
      orderIndex: 2,
    },
  });

  await prisma.exercise.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      lessonId: toanLesson1.id,
      type: 'FILL_BLANK',
      question: 'Điền số thích hợp vào chỗ trống: 9 × ... = 63',
      correctAnswer: '7',
      explanation: '9 × 7 = 63. Hoặc có thể tính 63 : 9 = 7.',
      orderIndex: 3,
    },
  });

  console.log('✅ Exercises seeded');
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
