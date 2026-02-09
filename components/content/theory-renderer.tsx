import { LessonContent } from '@/types/content';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

type TheoryRendererProps = {
  content: LessonContent;
};

export function TheoryRenderer({ content }: TheoryRendererProps) {
  return (
    <div className="space-y-6">
      {/* Render sections */}
      {content.sections.map((section, index) => {
        switch (section.type) {
          case 'heading':
            return (
              <h2
                key={index}
                className="text-foreground mt-8 text-2xl font-bold first:mt-0"
              >
                {section.content}
              </h2>
            );

          case 'paragraph':
            return (
              <p
                key={index}
                className="text-foreground/90 text-base leading-relaxed"
              >
                {section.content}
              </p>
            );

          case 'example':
            return (
              <Card key={index} className="border-amber-200 bg-amber-50">
                <CardContent className="space-y-3 pt-6">
                  <div>
                    <p className="mb-2 font-semibold text-amber-900">Ví dụ:</p>
                    <p className="text-amber-950">{section.question}</p>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-amber-900">
                      Lời giải:
                    </p>
                    <p className="text-amber-950">{section.solution}</p>
                  </div>
                </CardContent>
              </Card>
            );

          case 'visual':
            return (
              <Card key={index} className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-700 italic">
                    [Hình minh họa: {section.visualType}]
                  </p>
                </CardContent>
              </Card>
            );

          default:
            return null;
        }
      })}

      {/* Render key points */}
      {content.keyPoints && content.keyPoints.length > 0 && (
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-700" />
              <div className="flex-1">
                <h3 className="mb-3 font-semibold text-green-900">
                  Điểm cần nhớ:
                </h3>
                <ul className="space-y-2">
                  {content.keyPoints.map((point, index) => (
                    <li key={index} className="flex gap-2 text-green-950">
                      <span className="text-green-700">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
