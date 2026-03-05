/**
 * Tests for lib/fusion.ts
 */

import {
  fuseStats,
  calculateTotalStats,
  calculateFusedTotalStats,
  getHighestStat,
} from '../fusion';
import type { Pokemon } from '../pokemon';

// Mock Pokemon data
const mockPokemon1: Pokemon = {
  id: 1,
  name: {
    english: 'Bulbasaur',
    japanese: 'フシギダネ',
    chinese: '妙蛙种子',
    french: 'Bulbizarre',
  },
  type: ['Grass', 'Poison'],
  base: {
    HP: 45,
    Attack: 49,
    Defense: 49,
    'Sp. Attack': 65,
    'Sp. Defense': 65,
    Speed: 45,
  },
};

const mockPokemon2: Pokemon = {
  id: 4,
  name: {
    english: 'Charmander',
    japanese: 'ヒトカゲ',
    chinese: '小火龙',
    french: 'Salamèche',
  },
  type: ['Fire'],
  base: {
    HP: 39,
    Attack: 52,
    Defense: 43,
    'Sp. Attack': 60,
    'Sp. Defense': 50,
    Speed: 65,
  },
};

describe('Fusion utilities', () => {
  describe('fuseStats', () => {
    it('should average stats from two Pokemon', () => {
      const fused = fuseStats(mockPokemon1, mockPokemon2);

      expect(fused.HP).toBe(42); // (45 + 39) / 2 = 42
      expect(fused.Attack).toBe(51); // (49 + 52) / 2 = 50.5 -> 51
      expect(fused.Defense).toBe(46); // (49 + 43) / 2 = 46
      expect(fused['Sp. Attack']).toBe(63); // (65 + 60) / 2 = 62.5 -> 63
      expect(fused['Sp. Defense']).toBe(58); // (65 + 50) / 2 = 57.5 -> 58
      expect(fused.Speed).toBe(55); // (45 + 65) / 2 = 55
    });

    it('should include source metadata', () => {
      const fused = fuseStats(mockPokemon1, mockPokemon2);

      expect(fused.sources.pokemon1.name).toBe('Bulbasaur');
      expect(fused.sources.pokemon2.name).toBe('Charmander');
      expect(fused.sources.pokemon1.stats.HP).toBe(45);
      expect(fused.sources.pokemon2.stats.HP).toBe(39);
    });

    it('should calculate total stats', () => {
      const fused = fuseStats(mockPokemon1, mockPokemon2);
      expect(fused.total).toBe(315); // 42 + 51 + 46 + 63 + 58 + 55 = 315
    });

    it('should handle same Pokemon fusion', () => {
      const fused = fuseStats(mockPokemon1, mockPokemon1);

      expect(fused.HP).toBe(45);
      expect(fused.Attack).toBe(49);
      expect(fused.Defense).toBe(49);
    });
  });

  describe('calculateTotalStats', () => {
    it('should sum all stat values', () => {
      const stats = {
        HP: 100,
        Attack: 80,
        Defense: 70,
        'Sp. Attack': 90,
        'Sp. Defense': 85,
        Speed: 75,
      };

      expect(calculateTotalStats(stats)).toBe(500);
    });
  });

  describe('calculateFusedTotalStats', () => {
    it('should sum fused stats excluding metadata', () => {
      const fused = fuseStats(mockPokemon1, mockPokemon2);
      expect(calculateFusedTotalStats(fused)).toBe(315);
    });
  });

  describe('getHighestStat', () => {
    it('should find the highest stat', () => {
      const stats = {
        HP: 45,
        Attack: 49,
        Defense: 49,
        'Sp. Attack': 100,
        'Sp. Defense': 65,
        Speed: 45,
      };

      const result = getHighestStat(stats);
      expect(result.stat).toBe('Sp. Attack');
      expect(result.value).toBe(100);
    });

    it('should handle tied stats', () => {
      const stats = {
        HP: 50,
        Attack: 100,
        Defense: 100,
        'Sp. Attack': 80,
        'Sp. Defense': 85,
        Speed: 75,
      };

      const result = getHighestStat(stats);
      expect(result.value).toBe(100);
      expect(['Attack', 'Defense']).toContain(result.stat);
    });
  });
});
