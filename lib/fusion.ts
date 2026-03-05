/**
 * Pokemon Stat Fusion
 * Calculates and averages stats from parent Pokemon
 */

import type { Pokemon, PokemonStats } from './pokemon';

/**
 * Fused Pokemon stats with metadata
 */
export interface FusedStats extends PokemonStats {
  total: number;
  sources: {
    pokemon1: {
      name: string;
      stats: PokemonStats;
    };
    pokemon2: {
      name: string;
      stats: PokemonStats;
    };
  };
}

/**
 * Calculate average of two stat values
 * Handles rounding to nearest integer
 */
function averageStats(stat1: number, stat2: number): number {
  return Math.round((stat1 + stat2) / 2);
}

/**
 * Fuse two Pokemon stats by averaging each stat
 *
 * @param pokemon1 - First Pokemon
 * @param pokemon2 - Second Pokemon
 * @returns Fused stats object
 *
 * @example
 * ```ts
 * const bulbasaur = await getPokemonById(1);
 * const charmander = await getPokemonById(4);
 * const fused = fuseStats(bulbasaur, charmander);
 * // Returns: { HP: 42, Attack: 51, Defense: 46, ... }
 * ```
 */
export function fuseStats(pokemon1: Pokemon, pokemon2: Pokemon): FusedStats {
  const stats1 = pokemon1.base;
  const stats2 = pokemon2.base;

  const fused: FusedStats = {
    HP: averageStats(stats1.HP, stats2.HP),
    Attack: averageStats(stats1.Attack, stats2.Attack),
    Defense: averageStats(stats1.Defense, stats2.Defense),
    'Sp. Attack': averageStats(stats1['Sp. Attack'], stats2['Sp. Attack']),
    'Sp. Defense': averageStats(stats1['Sp. Defense'], stats2['Sp. Defense']),
    Speed: averageStats(stats1.Speed, stats2.Speed),
    total: 0,
    sources: {
      pokemon1: {
        name: pokemon1.name.english,
        stats: stats1,
      },
      pokemon2: {
        name: pokemon2.name.english,
        stats: stats2,
      },
    },
  };

  // Calculate total stats
  fused.total = calculateFusedTotalStats(fused);

  return fused;
}

/**
 * Calculate total stats from a Pokemon stats object
 *
 * @param stats - Pokemon stats
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
 * Calculate total stats from a FusedStats object
 * Excludes the sources metadata
 *
 * @param stats - Fused stats object
 * @returns Sum of all stat values
 */
export function calculateFusedTotalStats(stats: FusedStats): number {
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
 * Get stat change information
 * Shows how much each stat changed from the parents
 *
 * @param fused - Fused stats
 * @returns Object with stat change details
 */
export function getStatChanges(fused: FusedStats) {
  const { pokemon1, pokemon2 } = fused.sources;

  return {
    HP: {
      from: `${pokemon1.stats.HP} + ${pokemon2.stats.HP}`,
      average: fused.HP,
    },
    Attack: {
      from: `${pokemon1.stats.Attack} + ${pokemon2.stats.Attack}`,
      average: fused.Attack,
    },
    Defense: {
      from: `${pokemon1.stats.Defense} + ${pokemon2.stats.Defense}`,
      average: fused.Defense,
    },
    'Sp. Attack': {
      from: `${pokemon1.stats['Sp. Attack']} + ${pokemon2.stats['Sp. Attack']}`,
      average: fused['Sp. Attack'],
    },
    'Sp. Defense': {
      from: `${pokemon1.stats['Sp. Defense']} + ${pokemon2.stats['Sp. Defense']}`,
      average: fused['Sp. Defense'],
    },
    Speed: {
      from: `${pokemon1.stats.Speed} + ${pokemon2.stats.Speed}`,
      average: fused.Speed,
    },
  };
}

/**
 * Format stats for display
 * Returns a formatted string representation
 *
 * @param stats - Stats to format
 * @returns Formatted string
 */
export function formatStats(stats: PokemonStats | FusedStats): string {
  const lines = [
    `HP: ${stats.HP}`,
    `Attack: ${stats.Attack}`,
    `Defense: ${stats.Defense}`,
    `Sp. Attack: ${stats['Sp. Attack']}`,
    `Sp. Defense: ${stats['Sp. Defense']}`,
    `Speed: ${stats.Speed}`,
  ];

  if ('total' in stats) {
    lines.push(`Total: ${stats.total}`);
  }

  return lines.join('\n');
}

/**
 * Find the highest stat
 *
 * @param stats - Stats to analyze
 * @returns Object with stat name and value
 */
export function getHighestStat(stats: PokemonStats | FusedStats): {
  stat: string;
  value: number;
} {
  const statEntries = [
    ['HP', stats.HP],
    ['Attack', stats.Attack],
    ['Defense', stats.Defense],
    ['Sp. Attack', stats['Sp. Attack']],
    ['Sp. Defense', stats['Sp. Defense']],
    ['Speed', stats.Speed],
  ] as const;

  const [stat, value] = statEntries.reduce((highest, current) =>
    current[1] > highest[1] ? current : highest
  );

  return { stat, value };
}
