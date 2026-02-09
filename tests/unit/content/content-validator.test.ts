import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Content Validation', () => {
  const VALID_SUBJECTS = ['toan', 'tieng-viet'];
  const VALID_EXERCISE_TYPES = ['MULTIPLE_CHOICE', 'FILL_BLANK', 'TRUE_FALSE'];
  const VALID_SECTION_TYPES = ['heading', 'paragraph', 'visual', 'example'];

  interface LessonSection {
    type: string;
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
    type: string;
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

  const validateSection = (section: LessonSection): string | null => {
    if (!VALID_SECTION_TYPES.includes(section.type)) {
      return `invalid type "${section.type}"`;
    }

    if (section.type === 'heading' || section.type === 'paragraph') {
      if (!section.content || section.content.trim() === '') {
        return 'missing or empty content';
      }
    }

    if (section.type === 'example') {
      if (!section.question || !section.solution) {
        return 'example missing question or solution';
      }
    }

    return null;
  };

  const validateExercise = (exercise: Exercise): string | null => {
    if (!VALID_EXERCISE_TYPES.includes(exercise.type)) {
      return `invalid type "${exercise.type}"`;
    }

    if (!exercise.question || exercise.question.trim() === '') {
      return 'missing or empty question';
    }

    if (!exercise.correctAnswer || exercise.correctAnswer.trim() === '') {
      return 'missing correctAnswer';
    }

    if (exercise.type === 'MULTIPLE_CHOICE') {
      if (
        !exercise.options ||
        !Array.isArray(exercise.options) ||
        exercise.options.length === 0
      ) {
        return 'MULTIPLE_CHOICE must have options array';
      }

      const labels = exercise.options.map((opt) => opt.label);
      const values = exercise.options.map((opt) => opt.value);

      if (labels.some((l) => !l)) {
        return 'option missing label';
      }

      if (values.some((v) => !v)) {
        return 'option missing value';
      }

      const correctOption = exercise.options.find(
        (opt) => opt.label === exercise.correctAnswer
      );
      if (!correctOption) {
        return `correctAnswer "${exercise.correctAnswer}" not found in options`;
      }
    }

    if (typeof exercise.orderIndex !== 'number' || exercise.orderIndex < 1) {
      return 'invalid orderIndex';
    }

    return null;
  };

  const validateLesson = (data: LessonData): string | null => {
    if (!data.subject || !VALID_SUBJECTS.includes(data.subject)) {
      return `invalid subject "${data.subject}"`;
    }

    if (!data.chapter || !data.chapter.match(/^chuong-\d+$/)) {
      return `invalid chapter format "${data.chapter}"`;
    }

    if (!data.title || data.title.trim() === '') {
      return 'missing or empty title';
    }

    if (!data.slug || !data.slug.match(/^bai-\d+$/)) {
      return `invalid slug format "${data.slug}"`;
    }

    if (typeof data.orderIndex !== 'number' || data.orderIndex < 1) {
      return 'invalid orderIndex';
    }

    if (!data.theoryContent || typeof data.theoryContent !== 'object') {
      return 'missing theoryContent';
    }

    if (
      !Array.isArray(data.theoryContent.sections) ||
      data.theoryContent.sections.length === 0
    ) {
      return 'theoryContent.sections must be non-empty array';
    }

    for (const section of data.theoryContent.sections) {
      const error = validateSection(section);
      if (error) return error;
    }

    if (
      !Array.isArray(data.theoryContent.keyPoints) ||
      data.theoryContent.keyPoints.length === 0
    ) {
      return 'theoryContent.keyPoints must be non-empty array';
    }

    if (!Array.isArray(data.exercises) || data.exercises.length === 0) {
      return 'exercises must be non-empty array';
    }

    for (const exercise of data.exercises) {
      const error = validateExercise(exercise);
      if (error) return error;
    }

    return null;
  };

  describe('real lesson file validation', () => {
    it('should validate real lesson file successfully', () => {
      const filePath = join(process.cwd(), 'content/toan/chuong-1/bai-01.json');
      const content = readFileSync(filePath, 'utf-8');
      const data: LessonData = JSON.parse(content);

      const error = validateLesson(data);
      expect(error).toBeNull();
    });
  });

  describe('lesson validation', () => {
    it('should pass valid lesson data', () => {
      const validLesson: LessonData = {
        subject: 'toan',
        chapter: 'chuong-1',
        title: 'Test Lesson',
        slug: 'bai-1',
        orderIndex: 1,
        theoryContent: {
          sections: [
            { type: 'heading', content: 'Test Heading' },
            { type: 'paragraph', content: 'Test paragraph content' },
          ],
          keyPoints: ['Point 1', 'Point 2', 'Point 3'],
        },
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'Test question?',
            options: [
              { label: 'A', value: 'Option A' },
              { label: 'B', value: 'Option B' },
            ],
            correctAnswer: 'A',
            explanation: 'Test explanation',
            orderIndex: 1,
          },
        ],
      };

      const error = validateLesson(validLesson);
      expect(error).toBeNull();
    });

    it('should fail for invalid subject', () => {
      const invalidLesson = {
        subject: 'invalid-subject',
        chapter: 'chuong-1',
        title: 'Test',
        slug: 'bai-1',
        orderIndex: 1,
        theoryContent: {
          sections: [{ type: 'heading', content: 'Test' }],
          keyPoints: ['Point'],
        },
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'Q?',
            options: [{ label: 'A', value: 'A' }],
            correctAnswer: 'A',
            explanation: 'E',
            orderIndex: 1,
          },
        ],
      } as LessonData;

      const error = validateLesson(invalidLesson);
      expect(error).toContain('invalid subject');
    });

    it('should fail for missing required fields', () => {
      const invalidLesson = {
        subject: 'toan',
        chapter: 'chuong-1',
        title: '',
        slug: 'bai-1',
        orderIndex: 1,
        theoryContent: {
          sections: [{ type: 'heading', content: 'Test' }],
          keyPoints: ['Point'],
        },
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'Q?',
            options: [{ label: 'A', value: 'A' }],
            correctAnswer: 'A',
            explanation: 'E',
            orderIndex: 1,
          },
        ],
      } as LessonData;

      const error = validateLesson(invalidLesson);
      expect(error).toBe('missing or empty title');
    });

    it('should fail for empty sections array', () => {
      const invalidLesson = {
        subject: 'toan',
        chapter: 'chuong-1',
        title: 'Test',
        slug: 'bai-1',
        orderIndex: 1,
        theoryContent: {
          sections: [],
          keyPoints: ['Point'],
        },
        exercises: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'Q?',
            options: [{ label: 'A', value: 'A' }],
            correctAnswer: 'A',
            explanation: 'E',
            orderIndex: 1,
          },
        ],
      } as LessonData;

      const error = validateLesson(invalidLesson);
      expect(error).toBe('theoryContent.sections must be non-empty array');
    });
  });

  describe('exercise validation', () => {
    it('should pass valid MULTIPLE_CHOICE exercise', () => {
      const exercise: Exercise = {
        type: 'MULTIPLE_CHOICE',
        question: 'What is 2+2?',
        options: [
          { label: 'A', value: '3' },
          { label: 'B', value: '4' },
        ],
        correctAnswer: 'B',
        explanation: 'Because 2+2=4',
        orderIndex: 1,
      };

      const error = validateExercise(exercise);
      expect(error).toBeNull();
    });

    it('should fail for invalid exercise type', () => {
      const exercise: Exercise = {
        type: 'INVALID_TYPE',
        question: 'Test?',
        correctAnswer: 'A',
        explanation: 'E',
        orderIndex: 1,
      };

      const error = validateExercise(exercise);
      expect(error).toContain('invalid type');
    });

    it('should fail for MULTIPLE_CHOICE without options', () => {
      const exercise: Exercise = {
        type: 'MULTIPLE_CHOICE',
        question: 'Test?',
        correctAnswer: 'A',
        explanation: 'E',
        orderIndex: 1,
      };

      const error = validateExercise(exercise);
      expect(error).toBe('MULTIPLE_CHOICE must have options array');
    });

    it('should fail when correctAnswer not in options', () => {
      const exercise: Exercise = {
        type: 'MULTIPLE_CHOICE',
        question: 'Test?',
        options: [
          { label: 'A', value: 'Option A' },
          { label: 'B', value: 'Option B' },
        ],
        correctAnswer: 'C',
        explanation: 'E',
        orderIndex: 1,
      };

      const error = validateExercise(exercise);
      expect(error).toContain('not found in options');
    });
  });

  describe('section validation', () => {
    it('should pass valid heading section', () => {
      const section: LessonSection = {
        type: 'heading',
        content: 'Test Heading',
      };

      const error = validateSection(section);
      expect(error).toBeNull();
    });

    it('should fail for heading without content', () => {
      const section: LessonSection = {
        type: 'heading',
        content: '',
      };

      const error = validateSection(section);
      expect(error).toBe('missing or empty content');
    });

    it('should fail for invalid section type', () => {
      const section: LessonSection = {
        type: 'invalid-type',
      };

      const error = validateSection(section);
      expect(error).toContain('invalid type');
    });

    it('should fail for example without question', () => {
      const section: LessonSection = {
        type: 'example',
        solution: 'Solution here',
      };

      const error = validateSection(section);
      expect(error).toBe('example missing question or solution');
    });
  });
});
