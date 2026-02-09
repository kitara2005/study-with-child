export function calculateStars(score: number): number {
  if (score >= 80) return 3;
  if (score >= 50) return 2;
  if (score >= 1) return 1;
  return 0;
}
