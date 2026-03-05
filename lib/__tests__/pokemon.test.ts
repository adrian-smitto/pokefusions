/**
 * Tests for lib/pokemon.ts
 */

import { calculateTotalStats } from '../pokemon';

describe('Pokemon utilities', () => {
  describe('calculateTotalStats', () => {
    it('should calculate total stats correctly', () => {
      const stats = {
        HP: 45,
        Attack: 49,
        Defense: 49,
        'Sp. Attack': 65,
        'Sp. Defense': 65,
        Speed: 45,
      };

      const total = calculateTotalStats(stats);
      expect(total).toBe(318);
    });

    it('should handle zero stats', () => {
      const stats = {
        HP: 0,
        Attack: 0,
        Defense: 0,
        'Sp. Attack': 0,
        'Sp. Defense': 0,
        Speed: 0,
      };

      const total = calculateTotalStats(stats);
      expect(total).toBe(0);
    });

    it('should handle high stats', () => {
      const stats = {
        HP: 255,
        Attack: 190,
        Defense: 230,
        'Sp. Attack': 180,
        'Sp. Defense': 200,
        Speed: 150,
      };

      const total = calculateTotalStats(stats);
      expect(total).toBe(1205);
    });
  });
});
