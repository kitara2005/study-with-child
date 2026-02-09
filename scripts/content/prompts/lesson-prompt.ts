/**
 * Template for generating lesson theory content via Claude API
 * This is for future use when Claude API key is configured
 */

export interface LessonPromptParams {
  subject: string;
  chapter: string;
  lessonTitle: string;
  lessonNumber: number;
  grade: number;
  textbookSeries: string;
}

export function generateLessonPrompt(params: LessonPromptParams): string {
  return `You are an expert Vietnamese education content creator for Grade ${params.grade} students using the "${params.textbookSeries}" textbook series.

Create comprehensive lesson theory content for:

**Subject:** ${params.subject}
**Chapter:** ${params.chapter}
**Lesson:** ${params.lessonTitle}
**Lesson Number:** ${params.lessonNumber}
**Target Audience:** Grade ${params.grade} students (age 9-10)

Requirements:
1. Write in clear, age-appropriate Vietnamese
2. Include 4-6 theory sections with headings and paragraphs
3. Provide 2-3 concrete examples with questions and solutions
4. Create 3-4 key learning points
5. Ensure educational accuracy and curriculum alignment
6. Use engaging, student-friendly language

Output format (JSON):
{
  "sections": [
    { "type": "heading", "content": "..." },
    { "type": "paragraph", "content": "..." },
    { "type": "example", "question": "...", "solution": "..." }
  ],
  "keyPoints": ["...", "..."]
}

Focus on:
- Clear explanations building on prior knowledge
- Real-world applications and relatable examples
- Step-by-step problem-solving approaches
- Encouraging critical thinking

Generate the lesson content now.`;
}

export function generateLessonPromptWithContext(
  params: LessonPromptParams,
  referenceContent?: string
): string {
  const basePrompt = generateLessonPrompt(params);

  if (referenceContent) {
    return `${basePrompt}

**Reference Content (for inspiration, do not copy verbatim):**
${referenceContent}

Create original content that covers the same topics but with fresh explanations and examples.`;
  }

  return basePrompt;
}
