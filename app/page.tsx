'use client';

/**
 * PokeFusions Dashboard
 * Main page for generating Pokemon fusions
 */

import { useState } from 'react';
import { FusionCard, type FusionData } from '@/components/FusionCard';
import { TweetPreview } from '@/components/TweetPreview';
import { FusionCardSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/lib/toast';

export default function Home() {
  const [count, setCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fusions, setFusions] = useState<FusionData[]>([]);
  const [showTweetPreviews, setShowTweetPreviews] = useState(false);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate fusions');
      }

      const newFusions = data.fusions || [];
      setFusions(newFusions);

      if (newFusions.length > 0) {
        addToast(`Generated ${newFusions.length} fusion${newFusions.length > 1 ? 's' : ''}!`, 'success');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerate();
  };

  const toggleTweetPreviews = () => {
    setShowTweetPreviews(!showTweetPreviews);
    addToast(
      showTweetPreviews ? 'Tweet previews hidden' : 'Tweet previews shown',
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent animate-fade-in">
            PokeFusions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-in-delayed">
            AI-powered Pokemon fusion generator
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 animate-fade-in-delayed">
            Generate unique Pokemon fusions with creative names and descriptions
          </p>
        </header>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="count" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of fusions:
              </label>
              <select
                id="count"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-8 py-2 bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                'Generate Fusions'
              )}
            </button>

            {fusions.length > 0 && (
              <button
                onClick={toggleTweetPreviews}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95"
              >
                {showTweetPreviews ? 'Hide' : 'Show'} Tweet Previews
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 animate-fade-in-up">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Please try again or check your internet connection.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State - Skeletons */}
        {isLoading && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Generating Fusions...
            </h2>
            {[...Array(count)].map((_, i) => (
              <FusionCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {!isLoading && fusions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Generated Fusions ({fusions.length})
              </h2>
            </div>

            {fusions.map((fusion, index) => (
              <div
                key={fusion.id}
                className="space-y-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FusionCard fusion={fusion} onRegenerate={handleRegenerate} />
                {showTweetPreviews && (
                  <TweetPreview
                    fusion={{
                      name: fusion.name,
                      pokemon1Name: fusion.pokemon1.name,
                      pokemon2Name: fusion.pokemon2.name,
                      descriptions: fusion.descriptions,
                      stats: fusion.stats,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && fusions.length === 0 && !error && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">🎮</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Ready to Generate!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Click the <span className="font-semibold">Generate Fusions</span> button to create
              unique Pokemon fusions powered by AI.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
          <p>Powered by Hugging Face AI • Pokemon data from PokeAPI</p>
        </footer>
      </div>
    </div>
  );
}
