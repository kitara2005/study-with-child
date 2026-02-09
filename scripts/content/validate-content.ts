import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { LessonData, validateLessonData, logError } from './content-schema';

const CONTENT_DIR = join(process.cwd(), 'content');

let errorCount = { count: 0 };
let warningCount = { count: 0 };
let fileCount = 0;

function validateLessonFile(filePath: string): boolean {
  const relativePath = filePath.replace(process.cwd(), '');

  try {
    const content = readFileSync(filePath, 'utf-8');
    const data: LessonData = JSON.parse(content);

    const valid = validateLessonData(
      data,
      relativePath,
      errorCount,
      warningCount
    );

    fileCount++;
    if (valid) {
      console.log(`✅ ${relativePath}`);
    }

    return valid;
  } catch (error) {
    if (error instanceof SyntaxError) {
      logError(relativePath, `invalid JSON: ${error.message}`, errorCount);
    } else {
      logError(relativePath, `error reading file: ${error}`, errorCount);
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
console.log(`   Errors: ${errorCount.count}`);
console.log(`   Warnings: ${warningCount.count}`);
console.log('='.repeat(60));

if (errorCount.count > 0) {
  console.error('\n❌ Validation failed with errors');
  process.exit(1);
} else if (warningCount.count > 0) {
  console.warn('\n⚠️  Validation passed with warnings');
  process.exit(0);
} else {
  console.log('\n✅ All content files are valid!');
  process.exit(0);
}
