/**
 * Pokemon data utilities
 * Loads and provides access to local Pokemon data
 */

// TypeScript types for Pokemon data
export type PokemonType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Steel'
  | 'Fairy'
  | 'Dark';

export interface PokemonName {
  english: string;
  japanese: string;
  chinese: string;
  french: string;
}

export interface PokemonStats {
  HP: number;
  Attack: number;
  Defense: number;
  'Sp. Attack': number;
  'Sp. Defense': number;
  Speed: number;
}

export interface Pokemon {
  id: number;
  name: PokemonName;
  type: PokemonType[];
  base: PokemonStats;
}

// Cached Pokemon data
let cachedPokemonData: Pokemon[] | null = null;

/**
 * Load Pokemon data from local pokedex.json
 * Caches the data for subsequent calls
 */
export async function loadPokemonData(): Promise<Pokemon[]> {
  if (cachedPokemonData) {
    return cachedPokemonData;
  }

  try {
    // Dynamic import to avoid issues with Next.js build
    const data = await import('../data/pokedex.json');
    cachedPokemonData = data.default as Pokemon[];
    return cachedPokemonData;
  } catch (error) {
    console.error('Failed to load Pokemon data:', error);
    throw new Error('Could not load Pokemon data. Please ensure data/pokedex.json exists.');
  }
}

/**
 * Get a Pokemon by its ID
 * @param id - Pokemon ID (1-151 for Gen 1)
 * @returns Pokemon or null if not found
 */
export async function getPokemonById(id: number): Promise<Pokemon | null> {
  const allPokemon = await loadPokemonData();
  return allPokemon.find((p) => p.id === id) || null;
}

/**
 * Get a Pokemon by its English name
 * @param name - Pokemon English name (case-insensitive)
 * @returns Pokemon or null if not found
 */
export async function getPokemonByName(name: string): Promise<Pokemon | null> {
  const allPokemon = await loadPokemonData();
  return (
    allPokemon.find((p) => p.name.english.toLowerCase() === name.toLowerCase()) || null
  );
}

/**
 * Get N random Pokemon from the dataset
 * @param count - Number of random Pokemon to return
 * @param exclude - Optional array of Pokemon IDs to exclude
 * @returns Array of random Pokemon
 */
export async function getRandomPokemon(
  count: number,
  exclude?: number[]
): Promise<Pokemon[]> {
  const allPokemon = await loadPokemonData();

  // Filter out excluded Pokemon
  const availablePokemon = exclude
    ? allPokemon.filter((p) => !exclude.includes(p.id))
    : allPokemon;

  if (availablePokemon.length < count) {
    throw new Error(
      `Not enough Pokemon available. Requested: ${count}, Available: ${availablePokemon.length}`
    );
  }

  // Fisher-Yates shuffle for random selection
  const shuffled = [...availablePokemon];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

/**
 * Get all Pokemon of a specific type
 * @param type - Pokemon type to filter by
 * @returns Array of Pokemon matching the type
 */
export async function getPokemonByType(type: PokemonType): Promise<Pokemon[]> {
  const allPokemon = await loadPokemonData();
  return allPokemon.filter((p) => p.type.includes(type));
}

/**
 * Calculate total stats for a Pokemon
 * @param stats - Pokemon stats object
 * @returns Sum of all stat values
 */
export function calculateTotalStats(stats: PokemonStats): number {
  return (
    stats.HP +
    stats.Attack +
    stats.Defense +
    stats['Sp. Attack'] +
    stats['Sp. Defense'] +
    stats.Speed
  );
}

/**
 * Get the English name from a Pokemon object
 * @param pokemon - Pokemon object
 * @returns English name
 */
export function getPokemonName(pokemon: Pokemon): string {
  return pokemon.name.english;
}

/**
 * Check if two Pokemon are the same
 * @param pokemon1 - First Pokemon
 * @param pokemon2 - Second Pokemon
 * @returns True if they have the same ID
 */
export function isSamePokemon(pokemon1: Pokemon, pokemon2: Pokemon): boolean {
  return pokemon1.id === pokemon2.id;
}
