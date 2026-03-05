/**
 * TweetPreview Component
 * Shows what a tweet would look like and allows copying to clipboard
 */

'use client';

import { useState } from 'react';

export interface TweetData {
  name: string;
  pokemon1Name: string;
  pokemon2Name: string;
  descriptions: string[];
  stats: {
    HP: number;
    Attack: number;
    Defense: number;
    spAttack: number;
    spDefense: number;
    Speed: number;
  };
}

interface TweetPreviewProps {
  fusion: TweetData;
}

export function TweetPreview({ fusion }: TweetPreviewProps) {
  const [copied, setCopied] = useState(false);

  // Generate tweet text
  const generateTweetText = () => {
    const statsText = `HP: ${fusion.stats.HP} | Atk: ${fusion.stats.Attack} | Def: ${fusion.stats.Defense} | SpA: ${fusion.stats.spAttack} | SpD: ${fusion.stats.spDefense} | Spe: ${fusion.stats.Speed}`;

    const tweet = `✨ ${fusion.name}

Fusion of ${fusion.pokemon1Name} + ${fusion.pokemon2Name}

${fusion.descriptions[0]}

Stats:
${statsText}

#PokeFusions #Pokemon`;

    return tweet;
  };

  const tweetText = generateTweetText();
  const charCount = tweetText.length;
  const isOverLimit = charCount > 280;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tweetText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tweet Preview
        </h4>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium ${
              isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {charCount}/280
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-medium rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isOverLimit}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Tweet content */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
        {tweetText}
      </div>

      {/* Warning if over limit */}
      {isOverLimit && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
          ⚠️ Tweet is too long! Shorten descriptions to fit 280 character limit.
        </p>
      )}

      {/* Hashtag suggestions */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Suggested hashtags:</p>
        <div className="flex flex-wrap gap-1">
          {['#PokeFusions', '#Pokemon', '#PokemonFusion', '#AI'].map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
