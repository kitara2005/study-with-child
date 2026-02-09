export interface LessonSection {
  type: 'heading' | 'paragraph' | 'visual' | 'example';
  content?: string;
  question?: string;
  solution?: string;
  visualType?: string;
  data?: Record<string, unknown>;
}

export interface LessonContent {
  sections: LessonSection[];
  keyPoints: string[];
}

export interface Exercise {
  type: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRUE_FALSE';
  question: string;
  options?: Array<{ label: string; value: string }>;
  correctAnswer: string;
  explanation: string;
  orderIndex: number;
}

export interface LessonData {
  subject: string;
  chapter: string;
  title: string;
  slug: string;
  orderIndex: number;
  theoryContent: LessonContent;
  exercises: Exercise[];
}

export const VALID_SUBJECTS = ['toan', 'tieng-viet'];
export const VALID_EXERCISE_TYPES = [
  'MULTIPLE_CHOICE',
  'FILL_BLANK',
  'TRUE_FALSE',
];
export const VALID_SECTION_TYPES = [
  'heading',
  'paragraph',
  'visual',
  'example',
];

export function logError(
  file: string,
  message: string,
  errorCount: { count: number }
) {
  console.error(`❌ ERROR in ${file}: ${message}`);
  errorCount.count++;
}

export function logWarning(
  file: string,
  message: string,
  warningCount: { count: number }
) {
  console.warn(`⚠️  WARNING in ${file}: ${message}`);
  warningCount.count++;
}

export function validateSection(
  section: LessonSection,
  file: string,
  index: number,
  errorCount: { count: number }
): boolean {
  if (!VALID_SECTION_TYPES.includes(section.type)) {
    logError(
      file,
      `Section ${index}: invalid type "${section.type}"`,
      errorCount
    );
    return false;
  }

  if (section.type === 'heading' || section.type === 'paragraph') {
    if (!section.content || section.content.trim() === '') {
      logError(file, `Section ${index}: missing or empty content`, errorCount);
      return false;
    }
  }

  if (section.type === 'example') {
    if (!section.question || !section.solution) {
      logError(
        file,
        `Section ${index}: example missing question or solution`,
        errorCount
      );
      return false;
    }
  }

  return true;
}

export function validateExercise(
  exercise: Exercise,
  file: string,
  index: number,
  errorCount: { count: number },
  warningCount: { count: number }
): boolean {
  let valid = true;

  if (!VALID_EXERCISE_TYPES.includes(exercise.type)) {
    logError(
      file,
      `Exercise ${index}: invalid type "${exercise.type}"`,
      errorCount
    );
    valid = false;
  }

  if (!exercise.question || exercise.question.trim() === '') {
    logError(file, `Exercise ${index}: missing or empty question`, errorCount);
    valid = false;
  }

  if (!exercise.correctAnswer || exercise.correctAnswer.trim() === '') {
    logError(file, `Exercise ${index}: missing correctAnswer`, errorCount);
    valid = false;
  }

  if (exercise.type === 'MULTIPLE_CHOICE') {
    if (
      !exercise.options ||
      !Array.isArray(exercise.options) ||
      exercise.options.length === 0
    ) {
      logError(
        file,
        `Exercise ${index}: MULTIPLE_CHOICE must have options array`,
        errorCount
      );
      valid = false;
    } else {
      const labels = exercise.options.map((opt) => opt.label);
      const values = exercise.options.map((opt) => opt.value);

      if (labels.some((l) => !l)) {
        logError(file, `Exercise ${index}: option missing label`, errorCount);
        valid = false;
      }

      if (values.some((v) => !v)) {
        logError(file, `Exercise ${index}: option missing value`, errorCount);
        valid = false;
      }

      const correctOption = exercise.options.find(
        (opt) => opt.label === exercise.correctAnswer
      );
      if (!correctOption) {
        logError(
          file,
          `Exercise ${index}: correctAnswer "${exercise.correctAnswer}" not found in options`,
          errorCount
        );
        valid = false;
      }
    }
  }

  if (!exercise.explanation || exercise.explanation.trim() === '') {
    logWarning(file, `Exercise ${index}: missing explanation`, warningCount);
  }

  if (typeof exercise.orderIndex !== 'number' || exercise.orderIndex < 1) {
    logError(file, `Exercise ${index}: invalid orderIndex`, errorCount);
    valid = false;
  }

  return valid;
}

export function validateLessonData(
  data: LessonData,
  file: string,
  errorCount: { count: number },
  warningCount: { count: number }
): boolean {
  let valid = true;

  if (!data.subject || !VALID_SUBJECTS.includes(data.subject)) {
    logError(file, `invalid subject "${data.subject}"`, errorCount);
    valid = false;
  }

  if (!data.chapter || !data.chapter.match(/^chuong-\d+$/)) {
    logError(file, `invalid chapter format "${data.chapter}"`, errorCount);
    valid = false;
  }

  if (!data.title || data.title.trim() === '') {
    logError(file, 'missing or empty title', errorCount);
    valid = false;
  }

  if (!data.slug || !data.slug.match(/^bai-\d+$/)) {
    logError(file, `invalid slug format "${data.slug}"`, errorCount);
    valid = false;
  }

  if (typeof data.orderIndex !== 'number' || data.orderIndex < 1) {
    logError(file, 'invalid orderIndex', errorCount);
    valid = false;
  }

  if (!data.theoryContent || typeof data.theoryContent !== 'object') {
    logError(file, 'missing theoryContent', errorCount);
    valid = false;
  } else {
    if (
      !Array.isArray(data.theoryContent.sections) ||
      data.theoryContent.sections.length === 0
    ) {
      logError(
        file,
        'theoryContent.sections must be non-empty array',
        errorCount
      );
      valid = false;
    } else {
      data.theoryContent.sections.forEach((section, idx) => {
        if (!validateSection(section, file, idx + 1, errorCount)) {
          valid = false;
        }
      });
    }

    if (
      !Array.isArray(data.theoryContent.keyPoints) ||
      data.theoryContent.keyPoints.length === 0
    ) {
      logError(
        file,
        'theoryContent.keyPoints must be non-empty array',
        errorCount
      );
      valid = false;
    } else if (data.theoryContent.keyPoints.length < 3) {
      logWarning(
        file,
        `only ${data.theoryContent.keyPoints.length} keyPoints (recommend 3-4)`,
        warningCount
      );
    }
  }

  if (!Array.isArray(data.exercises) || data.exercises.length === 0) {
    logError(file, 'exercises must be non-empty array', errorCount);
    valid = false;
  } else {
    if (data.exercises.length < 5) {
      logWarning(
        file,
        `only ${data.exercises.length} exercises (recommend 5-6)`,
        warningCount
      );
    }

    data.exercises.forEach((exercise, idx) => {
      if (
        !validateExercise(exercise, file, idx + 1, errorCount, warningCount)
      ) {
        valid = false;
      }
    });
  }

  return valid;
}
