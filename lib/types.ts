/**
 * Pokemon Type Compatibility
 * Filters and validates Pokemon pairs based on type compatibility
 */

import type { Pokemon, PokemonType } from './pokemon';

/**
 * Type compatibility matrix
 * true = types are compatible for fusion
 * false = types should not be fused (rare/impossible combinations)
 *
 * Currently: All types are compatible (MVP approach)
 * Future: Can be refined based on game lore or preferences
 */
const COMPATIBILITY_MATRIX: Record<PokemonType, Record<PokemonType, boolean>> = {
  Normal: createCompatibleRow(),
  Fire: createCompatibleRow(),
  Water: createCompatibleRow(),
  Electric: createCompatibleRow(),
  Grass: createCompatibleRow(),
  Ice: createCompatibleRow(),
  Fighting: createCompatibleRow(),
  Poison: createCompatibleRow(),
  Ground: createCompatibleRow(),
  Flying: createCompatibleRow(),
  Psychic: createCompatibleRow(),
  Bug: createCompatibleRow(),
  Rock: createCompatibleRow(),
  Ghost: createCompatibleRow(),
  Dragon: createCompatibleRow(),
  Steel: createCompatibleRow(),
  Fairy: createCompatibleRow(),
  Dark: createCompatibleRow(),
};

/**
 * Helper to create a row where all types are compatible
 */
function createCompatibleRow(): Record<PokemonType, boolean> {
  return {
    Normal: true,
    Fire: true,
    Water: true,
    Electric: true,
    Grass: true,
    Ice: true,
    Fighting: true,
    Poison: true,
    Ground: true,
    Flying: true,
    Psychic: true,
    Bug: true,
    Rock: true,
    Ghost: true,
    Dragon: true,
    Steel: true,
    Fairy: true,
    Dark: true,
  };
}

/**
 * Check if two Pokemon types are compatible for fusion
 *
 * @param type1 - First Pokemon's type
 * @param type2 - Second Pokemon's type
 * @returns true if compatible, false otherwise
 *
 * @example
 * ```ts
 * areTypesCompatible('Fire', 'Water') // true (opposing but compatible)
 * areTypesCompatible('Fire', 'Grass') // true
 * ```
 */
export function areTypesCompatible(type1: PokemonType, type2: PokemonType): boolean {
  return COMPATIBILITY_MATRIX[type1]?.[type2] ?? true;
}

/**
 * Check if two Pokemon are compatible for fusion
 * Checks all type combinations (Pokemon can have 1-2 types)
 *
 * @param pokemon1 - First Pokemon
 * @param pokemon2 - Second Pokemon
 * @returns true if any type combination is compatible
 *
 * @example
 * ```ts
 * const charmander = await getPokemonById(4); // Fire
 * const bulbasaur = await getPokemonById(1);  // Grass/Poison
 * arePokemonCompatible(charmander, bulbasaur) // true
 * ```
 */
export function arePokemonCompatible(pokemon1: Pokemon, pokemon2: Pokemon): boolean {
  // Check all type combinations
  for (const type1 of pokemon1.type) {
    for (const type2 of pokemon2.type) {
      if (areTypesCompatible(type1, type2)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get all Pokemon compatible with a given Pokemon
 *
 * @param pokemon - The Pokemon to check compatibility against
 * @param allPokemon - Array of all Pokemon to filter
 * @returns Array of compatible Pokemon
 */
export function getCompatiblePokemon(pokemon: Pokemon, allPokemon: Pokemon[]): Pokemon[] {
  return allPokemon.filter((p) => p.id !== pokemon.id && arePokemonCompatible(pokemon, p));
}

/**
 * Get N random compatible Pokemon pairs
 *
 * @param count - Number of pairs to generate
 * @param allPokemon - Array of all Pokemon
 * @returns Array of Pokemon pairs
 */
export async function getRandomCompatiblePairs(
  count: number,
  allPokemon: Pokemon[]
): Promise<[Pokemon, Pokemon][]> {
  const pairs: [Pokemon, Pokemon][] = [];
  const usedIds = new Set<number>();
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops

  while (pairs.length < count && attempts < maxAttempts) {
    attempts++;

    // Get two random unused Pokemon
    const availablePokemon = allPokemon.filter((p) => !usedIds.has(p.id));

    if (availablePokemon.length < 2) {
      break; // Not enough available Pokemon
    }

    // Shuffle and pick first two
    const shuffled = [...availablePokemon].sort(() => Math.random() - 0.5);
    const pokemon1 = shuffled[0];
    const pokemon2 = shuffled[1];

    // Check compatibility
    if (arePokemonCompatible(pokemon1, pokemon2)) {
      pairs.push([pokemon1, pokemon2]);
      usedIds.add(pokemon1.id);
      usedIds.add(pokemon2.id);
    }
  }

  if (pairs.length < count) {
    console.warn(`Could only generate ${pairs.length} of ${count} compatible pairs`);
  }

  return pairs;
}

/**
 * Get type combination description
 * Returns a human-readable description of the type fusion
 *
 * @param type1 - First type
 * @param type2 - Second type
 * @returns Description of the type combination
 */
export function getTypeCombinationDescription(type1: PokemonType, type2: PokemonType): string {
  if (type1 === type2) {
    return `Pure ${type1} type`;
  }

  // Type combinations that have special synergy
  const synergies: Record<string, string> = {
    'Fire-Water': 'Steam融合',
    'Water-Grass': 'Natural harmony',
    'Electric-Water': 'Conducting power',
    'Fire-Grass': 'Burning forest',
    'Psychic-Ghost': 'Mystic powers',
  };

  const key1 = `${type1}-${type2}`;
  const key2 = `${type2}-${type1}`;

  return synergies[key1] || synergies[key2] || `${type1}/${type2} blend`;
}
