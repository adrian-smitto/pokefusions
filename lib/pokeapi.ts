/**
 * PokeAPI Integration
 * Fetches Pokemon descriptions and flavor text from the official PokeAPI
 */

import type { Pokemon } from './pokemon';

// Simple in-memory cache for API responses
const descriptionCache = new Map<string, string>();

// PokeAPI endpoints
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

/**
 * PokeAPI response types
 */
interface PokeAPIPokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }>;
}

/**
 * Fetch Pokemon description/flavor text from PokeAPI
 *
 * @param idOrName - Pokemon ID or name
 * @returns Flavor text description
 *
 * @example
 * ```ts
 * const description = await fetchPokemonDescription("bulbasaur");
 * // Returns: "For some time after its birth, it grows by gaining nourishment from the seed on its back."
 * ```
 */
export async function fetchPokemonDescription(idOrName: number | string): Promise<string> {
  const cacheKey = String(idOrName);

  // Check cache first
  if (descriptionCache.has(cacheKey)) {
    return descriptionCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon-species/${idOrName}`);

    if (!response.ok) {
      throw new Error(`PokeAPI error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as PokeAPIPokemonSpecies;

    // Find English flavor text from recent games (prefer newer versions)
    const englishEntry = data.flavor_text_entries
      .filter((entry) => entry.language.name === 'en')
      .filter((entry) => {
        // Prefer newer game versions
        const recentVersions = ['scarlet', 'violet', 'sword', 'shield', 'lets-go', 'ultra-sun'];
        return recentVersions.some((v) => entry.version.name.includes(v));
      })
      .sort((a, b) => a.version.name.localeCompare(b.version.name))[0];

    // Fallback to any English entry if no recent versions found
    const flavorText =
      englishEntry?.flavor_text ||
      data.flavor_text_entries.find((entry) => entry.language.name === 'en')?.flavor_text ||
      '';

    // Clean up the text (remove form feeds, extra whitespace)
    const cleanedText = flavorText
      .replace(/\f/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Cache the result
    if (cleanedText) {
      descriptionCache.set(cacheKey, cleanedText);
    }

    return cleanedText;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch description for ${idOrName}:`, error.message);
    }
    throw error;
  }
}

/**
 * Fetch Pokemon description with fallback
 * Returns a basic description if API fails
 *
 * @param idOrName - Pokemon ID or name
 * @param name - Pokemon name (for fallback)
 * @returns Flavor text or fallback description
 */
export async function fetchPokemonDescriptionWithFallback(
  idOrName: number | string,
  name: string
): Promise<string> {
  try {
    const description = await fetchPokemonDescription(idOrName);
    if (description) {
      return description;
    }
  } catch (error) {
    console.warn(`PokeAPI unavailable for ${idOrName}, using fallback`);
  }

  // Fallback description
  return `${name} is a Pokemon with unique abilities and characteristics.`;
}

/**
 * Fetch descriptions for multiple Pokemon in parallel
 *
 * @param pokemon - Array of Pokemon
 * @returns Map of Pokemon ID to description
 */
export async function fetchMultipleDescriptions(
  pokemon: Pokemon[]
): Promise<Map<number, string>> {
  const descriptions = new Map<number, string>();

  // Fetch in parallel with Promise.all
  await Promise.all(
    pokemon.map(async (p) => {
      try {
        const desc = await fetchPokemonDescriptionWithFallback(p.id, p.name.english);
        descriptions.set(p.id, desc);
      } catch (error) {
        console.error(`Failed to fetch description for ${p.name.english}:`, error);
        // Set fallback on error
        descriptions.set(p.id, `${p.name.english} is a unique Pokemon.`);
      }
    })
  );

  return descriptions;
}

/**
 * Clear the description cache
 * Useful for testing or forcing fresh data
 */
export function clearDescriptionCache(): void {
  descriptionCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: descriptionCache.size,
    keys: Array.from(descriptionCache.keys()),
  };
}
