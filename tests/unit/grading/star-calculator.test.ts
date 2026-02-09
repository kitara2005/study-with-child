import { describe, it, expect } from 'vitest';
import { calculateStars } from '@/lib/grading/star-calculator';

describe('calculateStars', () => {
  describe('3 stars', () => {
    it('should return 3 stars for score 80', () => {
      expect(calculateStars(80)).toBe(3);
    });

    it('should return 3 stars for score 90', () => {
      expect(calculateStars(90)).toBe(3);
    });

    it('should return 3 stars for score 100', () => {
      expect(calculateStars(100)).toBe(3);
    });

    it('should return 3 stars for score above 100', () => {
      expect(calculateStars(110)).toBe(3);
    });
  });

  describe('2 stars', () => {
    it('should return 2 stars for score 50', () => {
      expect(calculateStars(50)).toBe(2);
    });

    it('should return 2 stars for score 60', () => {
      expect(calculateStars(60)).toBe(2);
    });

    it('should return 2 stars for score 79', () => {
      expect(calculateStars(79)).toBe(2);
    });
  });

  describe('1 star', () => {
    it('should return 1 star for score 1', () => {
      expect(calculateStars(1)).toBe(1);
    });

    it('should return 1 star for score 25', () => {
      expect(calculateStars(25)).toBe(1);
    });

    it('should return 1 star for score 49', () => {
      expect(calculateStars(49)).toBe(1);
    });
  });

  describe('0 stars', () => {
    it('should return 0 stars for score 0', () => {
      expect(calculateStars(0)).toBe(0);
    });

    it('should return 0 stars for negative score', () => {
      expect(calculateStars(-10)).toBe(0);
    });
  });

  describe('boundary values', () => {
    it('should handle exact boundary at 50', () => {
      expect(calculateStars(49)).toBe(1);
      expect(calculateStars(50)).toBe(2);
      expect(calculateStars(51)).toBe(2);
    });

    it('should handle exact boundary at 80', () => {
      expect(calculateStars(79)).toBe(2);
      expect(calculateStars(80)).toBe(3);
      expect(calculateStars(81)).toBe(3);
    });

    it('should handle boundary at 0-1', () => {
      expect(calculateStars(0)).toBe(0);
      expect(calculateStars(1)).toBe(1);
    });
  });
});
