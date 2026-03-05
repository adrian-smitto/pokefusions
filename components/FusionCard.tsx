/**
 * FusionCard Component
 * Displays a single Pokemon fusion with all details
 */

import { useState } from 'react';

export interface FusionData {
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
  createdAt: string;
}

interface FusionCardProps {
  fusion: FusionData;
  onRegenerate?: (fusionId: string) => void;
}

export function FusionCard({ fusion, onRegenerate }: FusionCardProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!onRegenerate || isRegenerating) return;

    setIsRegenerating(true);
    try {
      await onRegenerate(fusion.id);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
      {/* Header: Name and timestamp */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {fusion.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(fusion.createdAt).toLocaleTimeString()}
          </span>
          {onRegenerate && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              title="Regenerate this fusion"
            >
              {isRegenerating ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-4 h-4 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Parent Pokemon */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {fusion.pokemon1.name}
          </span>
          <span className="text-gray-400">+</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {fusion.pokemon2.name}
          </span>
        </div>
        <span className="text-gray-400">•</span>
        <div className="flex flex-wrap gap-1">
          {fusion.pokemon1.types.map((type) => (
            <span
              key={`${fusion.pokemon1.id}-${type}`}
              className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            >
              {type}
            </span>
          ))}
          {fusion.pokemon2.types.map((type) => (
            <span
              key={`${fusion.pokemon2.id}-${type}`}
              className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Stats
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
          <StatStat label="HP" value={fusion.stats.HP} />
          <StatStat label="Attack" value={fusion.stats.Attack} />
          <StatStat label="Defense" value={fusion.stats.Defense} />
          <StatStat label="Sp. Atk" value={fusion.stats.spAttack} />
          <StatStat label="Sp. Def" value={fusion.stats.spDefense} />
          <StatStat label="Speed" value={fusion.stats.Speed} />
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Fusion Descriptions
        </h4>
        <ul className="space-y-2">
          {fusion.descriptions.map((desc, idx) => (
            <li
              key={idx}
              className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2"
            >
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatStat({ label, value }: { label: string; value: number }) {
  // Calculate stat color based on value (0-255 scale)
  const getColor = (val: number) => {
    if (val >= 100) return 'text-green-600 dark:text-green-400';
    if (val >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div>
      <span className="text-gray-500 dark:text-gray-400">{label}:</span>{' '}
      <span className={`font-medium text-gray-900 dark:text-gray-100 ${getColor(value)}`}>
        {value}
      </span>
    </div>
  );
}
