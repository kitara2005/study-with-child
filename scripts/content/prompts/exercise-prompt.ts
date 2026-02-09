/**
 * Template for generating exercises via Claude API
 * This is for future use when Claude API key is configured
 */

export interface ExercisePromptParams {
  subject: string;
  lessonTitle: string;
  theoryContent: string;
  grade: number;
  count: number;
}

export function generateExercisePrompt(params: ExercisePromptParams): string {
  return `You are an expert Vietnamese education content creator for Grade ${params.grade} students.

Create ${params.count} exercises based on this lesson:

**Subject:** ${params.subject}
**Lesson:** ${params.lessonTitle}
**Theory Content:**
${params.theoryContent}

Requirements:
1. Mix of exercise types:
   - MULTIPLE_CHOICE (40%): 4 options (A, B, C, D)
   - FILL_BLANK (30%): short answer
   - TRUE_FALSE (30%): true/false questions

2. Difficulty progression: easy → medium → challenging

3. Each exercise must have:
   - Clear, age-appropriate question
   - Correct answer
   - Detailed explanation (why it's correct, common mistakes)
   - Sequential orderIndex (1, 2, 3...)

4. For multiple choice:
   - Include plausible distractors
   - Test understanding, not just memorization
   - Options should be similar in length/format

5. Questions should:
   - Cover different aspects of the lesson
   - Test comprehension, application, and analysis
   - Use Vietnamese language appropriate for 9-10 year olds
   - Be free of ambiguity

Output format (JSON array):
[
  {
    "type": "MULTIPLE_CHOICE",
    "question": "...",
    "options": [
      { "label": "A", "value": "..." },
      { "label": "B", "value": "..." },
      { "label": "C", "value": "..." },
      { "label": "D", "value": "..." }
    ],
    "correctAnswer": "B",
    "explanation": "...",
    "orderIndex": 1
  },
  {
    "type": "FILL_BLANK",
    "question": "...",
    "correctAnswer": "...",
    "explanation": "...",
    "orderIndex": 2
  },
  {
    "type": "TRUE_FALSE",
    "question": "...",
    "correctAnswer": "Đúng",
    "explanation": "...",
    "orderIndex": 3
  }
]

Generate ${params.count} exercises now.`;
}

export function generateExercisePromptWithExamples(
  params: ExercisePromptParams,
  exampleExercises?: string
): string {
  const basePrompt = generateExercisePrompt(params);

  if (exampleExercises) {
    return `${basePrompt}

**Example Exercise Format (for reference):**
${exampleExercises}

Create new exercises following this quality standard.`;
  }

  return basePrompt;
}
