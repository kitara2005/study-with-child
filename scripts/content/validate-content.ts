import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

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
const VALID_SUBJECTS = ['toan', 'tieng-viet'];
const VALID_EXERCISE_TYPES = ['MULTIPLE_CHOICE', 'FILL_BLANK', 'TRUE_FALSE'];
const VALID_SECTION_TYPES = ['heading', 'paragraph', 'visual', 'example'];

let errorCount = 0;
let warningCount = 0;
let fileCount = 0;

function logError(file: string, message: string) {
  console.error(`❌ ERROR in ${file}: ${message}`);
  errorCount++;
}

function logWarning(file: string, message: string) {
  console.warn(`⚠️  WARNING in ${file}: ${message}`);
  warningCount++;
}

function validateSection(
  section: LessonSection,
  file: string,
  index: number
): boolean {
  if (!VALID_SECTION_TYPES.includes(section.type)) {
    logError(file, `Section ${index}: invalid type "${section.type}"`);
    return false;
  }

  if (section.type === 'heading' || section.type === 'paragraph') {
    if (!section.content || section.content.trim() === '') {
      logError(file, `Section ${index}: missing or empty content`);
      return false;
    }
  }

  if (section.type === 'example') {
    if (!section.question || !section.solution) {
      logError(file, `Section ${index}: example missing question or solution`);
      return false;
    }
  }

  return true;
}

function validateExercise(
  exercise: Exercise,
  file: string,
  index: number
): boolean {
  let valid = true;

  if (!VALID_EXERCISE_TYPES.includes(exercise.type)) {
    logError(file, `Exercise ${index}: invalid type "${exercise.type}"`);
    valid = false;
  }

  if (!exercise.question || exercise.question.trim() === '') {
    logError(file, `Exercise ${index}: missing or empty question`);
    valid = false;
  }

  if (!exercise.correctAnswer || exercise.correctAnswer.trim() === '') {
    logError(file, `Exercise ${index}: missing correctAnswer`);
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
        `Exercise ${index}: MULTIPLE_CHOICE must have options array`
      );
      valid = false;
    } else {
      const labels = exercise.options.map((opt) => opt.label);
      const values = exercise.options.map((opt) => opt.value);

      if (labels.some((l) => !l)) {
        logError(file, `Exercise ${index}: option missing label`);
        valid = false;
      }

      if (values.some((v) => !v)) {
        logError(file, `Exercise ${index}: option missing value`);
        valid = false;
      }

      const correctOption = exercise.options.find(
        (opt) => opt.label === exercise.correctAnswer
      );
      if (!correctOption) {
        logError(
          file,
          `Exercise ${index}: correctAnswer "${exercise.correctAnswer}" not found in options`
        );
        valid = false;
      }
    }
  }

  if (!exercise.explanation || exercise.explanation.trim() === '') {
    logWarning(file, `Exercise ${index}: missing explanation`);
  }

  if (typeof exercise.orderIndex !== 'number' || exercise.orderIndex < 1) {
    logError(file, `Exercise ${index}: invalid orderIndex`);
    valid = false;
  }

  return valid;
}

function validateLessonFile(filePath: string): boolean {
  const relativePath = filePath.replace(process.cwd(), '');
  let valid = true;

  try {
    const content = readFileSync(filePath, 'utf-8');
    const data: LessonData = JSON.parse(content);

    // Validate required fields
    if (!data.subject || !VALID_SUBJECTS.includes(data.subject)) {
      logError(relativePath, `invalid subject "${data.subject}"`);
      valid = false;
    }

    if (!data.chapter || !data.chapter.match(/^chuong-\d+$/)) {
      logError(relativePath, `invalid chapter format "${data.chapter}"`);
      valid = false;
    }

    if (!data.title || data.title.trim() === '') {
      logError(relativePath, 'missing or empty title');
      valid = false;
    }

    if (!data.slug || !data.slug.match(/^bai-\d+$/)) {
      logError(relativePath, `invalid slug format "${data.slug}"`);
      valid = false;
    }

    if (typeof data.orderIndex !== 'number' || data.orderIndex < 1) {
      logError(relativePath, 'invalid orderIndex');
      valid = false;
    }

    // Validate theoryContent
    if (!data.theoryContent || typeof data.theoryContent !== 'object') {
      logError(relativePath, 'missing theoryContent');
      valid = false;
    } else {
      if (
        !Array.isArray(data.theoryContent.sections) ||
        data.theoryContent.sections.length === 0
      ) {
        logError(
          relativePath,
          'theoryContent.sections must be non-empty array'
        );
        valid = false;
      } else {
        data.theoryContent.sections.forEach((section, idx) => {
          if (!validateSection(section, relativePath, idx + 1)) {
            valid = false;
          }
        });
      }

      if (
        !Array.isArray(data.theoryContent.keyPoints) ||
        data.theoryContent.keyPoints.length === 0
      ) {
        logError(
          relativePath,
          'theoryContent.keyPoints must be non-empty array'
        );
        valid = false;
      } else if (data.theoryContent.keyPoints.length < 3) {
        logWarning(
          relativePath,
          `only ${data.theoryContent.keyPoints.length} keyPoints (recommend 3-4)`
        );
      }
    }

    // Validate exercises
    if (!Array.isArray(data.exercises) || data.exercises.length === 0) {
      logError(relativePath, 'exercises must be non-empty array');
      valid = false;
    } else {
      if (data.exercises.length < 5) {
        logWarning(
          relativePath,
          `only ${data.exercises.length} exercises (recommend 5-6)`
        );
      }

      data.exercises.forEach((exercise, idx) => {
        if (!validateExercise(exercise, relativePath, idx + 1)) {
          valid = false;
        }
      });
    }

    fileCount++;
    if (valid) {
      console.log(`✅ ${relativePath}`);
    }

    return valid;
  } catch (error) {
    if (error instanceof SyntaxError) {
      logError(relativePath, `invalid JSON: ${error.message}`);
    } else {
      logError(relativePath, `error reading file: ${error}`);
    }
    return false;
  }
}

function scanDirectory(dir: string) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.endsWith('.json')) {
      validateLessonFile(fullPath);
    }
  }
}

console.log('🔍 Validating lesson content files...\n');

if (!statSync(CONTENT_DIR).isDirectory()) {
  console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
  process.exit(1);
}

scanDirectory(CONTENT_DIR);

console.log('\n' + '='.repeat(60));
console.log(`📊 Validation Summary:`);
console.log(`   Files processed: ${fileCount}`);
console.log(`   Errors: ${errorCount}`);
console.log(`   Warnings: ${warningCount}`);
console.log('='.repeat(60));

if (errorCount > 0) {
  console.error('\n❌ Validation failed with errors');
  process.exit(1);
} else if (warningCount > 0) {
  console.warn('\n⚠️  Validation passed with warnings');
  process.exit(0);
} else {
  console.log('\n✅ All content files are valid!');
  process.exit(0);
}
