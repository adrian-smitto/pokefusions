/**
 * Tests for lib/types.ts
 */

import {
  areTypesCompatible,
  arePokemonCompatible,
  getTypeCombinationDescription,
} from '../types';
import type { Pokemon } from '../pokemon';

// Mock Pokemon data
const grassPokemon: Pokemon = {
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

const firePokemon: Pokemon = {
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

describe('Type compatibility utilities', () => {
  describe('areTypesCompatible', () => {
    it('should return true for all type combinations (MVP)', () => {
      expect(areTypesCompatible('Fire', 'Water')).toBe(true);
      expect(areTypesCompatible('Fire', 'Grass')).toBe(true);
      expect(areTypesCompatible('Water', 'Grass')).toBe(true);
      expect(areTypesCompatible('Psychic', 'Ghost')).toBe(true);
    });

    it('should return true for same types', () => {
      expect(areTypesCompatible('Fire', 'Fire')).toBe(true);
      expect(areTypesCompatible('Water', 'Water')).toBe(true);
    });
  });

  describe('arePokemonCompatible', () => {
    it('should return true for compatible Pokemon', () => {
      expect(arePokemonCompatible(grassPokemon, firePokemon)).toBe(true);
    });

    it('should return true for same Pokemon', () => {
      expect(arePokemonCompatible(grassPokemon, grassPokemon)).toBe(true);
    });

    it('should check all type combinations', () => {
      const dualTypePokemon: Pokemon = {
        ...grassPokemon,
        type: ['Fire', 'Water'],
      };

      expect(arePokemonCompatible(firePokemon, dualTypePokemon)).toBe(true);
    });
  });

  describe('getTypeCombinationDescription', () => {
    it('should return pure type description for same types', () => {
      expect(getTypeCombinationDescription('Fire', 'Fire')).toBe('Pure Fire type');
    });

    it('should return blend description for different types', () => {
      // Use types without special descriptions
      const desc = getTypeCombinationDescription('Normal', 'Fighting');
      expect(desc).toContain('Normal');
      expect(desc).toContain('Fighting');
    });

    it('should return special descriptions for certain combinations', () => {
      expect(getTypeCombinationDescription('Fire', 'Water')).toBe('Steam融合');
      expect(getTypeCombinationDescription('Water', 'Grass')).toBe('Natural harmony');
      expect(getTypeCombinationDescription('Electric', 'Water')).toBe('Conducting power');
    });
  });
});
