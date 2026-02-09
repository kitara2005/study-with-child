'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { GradingDetail } from '@/lib/grading/auto-grader';

type AnswerBreakdownProps = {
  details: GradingDetail[];
};

export function AnswerBreakdown({ details }: AnswerBreakdownProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Chi tiết câu trả lời</h3>
      {details.map((detail, idx) => (
        <Card key={detail.exerciseId} className="p-4">
          <div className="flex gap-3">
            {detail.isCorrect ? (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 shrink-0 text-red-600" />
            )}
            <div className="flex-1 space-y-2">
              <p className="font-medium">
                Câu {idx + 1}: {detail.question}
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Câu trả lời: </span>
                  <span
                    className={
                      detail.isCorrect ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {detail.userAnswer || '(Chưa trả lời)'}
                  </span>
                </p>
                {!detail.isCorrect && (
                  <p>
                    <span className="text-muted-foreground">Đáp án đúng: </span>
                    <span className="text-green-600">
                      {detail.correctAnswer}
                    </span>
                  </p>
                )}
                {!detail.isCorrect && detail.explanation && (
                  <p className="text-muted-foreground mt-2">
                    💡 {detail.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
