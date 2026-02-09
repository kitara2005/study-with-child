// Lesson theory content JSON structure
export type LessonContent = {
  sections: LessonSection[];
  keyPoints: string[];
};

export type LessonSection =
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'visual'; visualType: string; data: Record<string, unknown> }
  | { type: 'example'; question: string; solution: string };
