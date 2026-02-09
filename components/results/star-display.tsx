'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarDisplayProps = {
  stars: number;
  size?: 'sm' | 'md' | 'lg';
};

export function StarDisplay({ stars, size = 'md' }: StarDisplayProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= stars
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-300 text-gray-300'
          )}
        />
      ))}
    </div>
  );
}
