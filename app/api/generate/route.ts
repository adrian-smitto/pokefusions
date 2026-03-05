/**
 * API Route: /api/generate
 * Generates Pokemon fusion options
 *
 * POST /api/generate
 * Body: { count: number }
 * Returns: Array of fusion objects
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadPokemonData, getRandomPokemon } from '@/lib/pokemon';
import { getRandomCompatiblePairs } from '@/lib/types';
import { fuseStats } from '@/lib/fusion';
import { fetchMultipleDescriptions } from '@/lib/pokeapi';
import { hfClient } from '@/lib/huggingface';

/**
 * Fusion result object
 */
export interface FusionResult {
  id: string;
  name: string;
  pokemon1: {
    id: number;
    name: string;
    types: string[];
  };
  pokemon2: {
    id: number;
    name: string;
    types: string[];
  };
  stats: {
    HP: number;
    Attack: number;
    Defense: number;
    spAttack: number;
    spDefense: number;
    Speed: number;
    total: number;
  };
  descriptions: string[];
  description1: string;
  description2: string;
  description3: string;
  createdAt: string;
}

/**
 * POST handler for /api/generate
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { count = 3 } = body;

    // Validate count
    if (typeof count !== 'number' || count < 1 || count > 10) {
      return NextResponse.json(
        { error: 'Invalid count. Must be between 1 and 10.' },
        { status: 400 }
      );
    }

    // Load all Pokemon data
    const allPokemon = await loadPokemonData();

    // Generate compatible Pokemon pairs
    const pairs = await getRandomCompatiblePairs(count, allPokemon);

    if (pairs.length === 0) {
      return NextResponse.json(
        { error: 'Could not generate any compatible Pokemon pairs.' },
        { status: 500 }
      );
    }

    // Fetch descriptions for all Pokemon in parallel
    const allPokemonInPairs = pairs.flat();
    const descriptionsMap = await fetchMultipleDescriptions(allPokemonInPairs);

    // Generate fusions
    const fusions: FusionResult[] = [];

    for (const [pokemon1, pokemon2] of pairs) {
      try {
        // Generate fusion name
        const name = await hfClient.generateFusionName(
          pokemon1.name.english,
          pokemon2.name.english
        );

        // Generate fusion descriptions
        const descriptions = await hfClient.generateFusionDescriptions(
          name,
          pokemon1.name.english,
          pokemon2.name.english
        );

        // Calculate fused stats
        const fusedStats = fuseStats(pokemon1, pokemon2);

        // Get Pokemon descriptions
        const desc1 = descriptionsMap.get(pokemon1.id) || `${pokemon1.name.english} is a Pokemon.`;
        const desc2 = descriptionsMap.get(pokemon2.id) || `${pokemon2.name.english} is a Pokemon.`;

        fusions.push({
          id: `${pokemon1.id}-${pokemon2.id}-${Date.now()}`,
          name,
          pokemon1: {
            id: pokemon1.id,
            name: pokemon1.name.english,
            types: pokemon1.type,
          },
          pokemon2: {
            id: pokemon2.id,
            name: pokemon2.name.english,
            types: pokemon2.type,
          },
          stats: {
            HP: fusedStats.HP,
            Attack: fusedStats.Attack,
            Defense: fusedStats.Defense,
            spAttack: fusedStats['Sp. Attack'],
            spDefense: fusedStats['Sp. Defense'],
            Speed: fusedStats.Speed,
            total: fusedStats.total,
          },
          descriptions,
          description1: descriptions[0] || '',
          description2: descriptions[1] || '',
          description3: descriptions[2] || '',
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Failed to generate fusion for ${pokemon1.name.english} + ${pokemon2.name.english}:`, error);
        // Continue with next pair
      }
    }

    // Return results
    return NextResponse.json({
      success: true,
      count: fusions.length,
      fusions,
    });
  } catch (error) {
    console.error('Error in /api/generate:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate fusions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for /api/generate
 * Returns API documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/generate',
    method: 'POST',
    description: 'Generate Pokemon fusion options',
    body: {
      count: 'number (1-10, default: 3)',
    },
    response: {
      success: 'boolean',
      count: 'number',
      fusions: 'array of FusionResult objects',
    },
    example: {
      count: 3,
    },
  });
}
