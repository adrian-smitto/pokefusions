/**
 * LoadingSkeleton Component
 * Shows skeleton loading state for fusion cards
 */

export function FusionCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>

      {/* Parent Pokemon */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="flex gap-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
        ))}
      </div>
    </div>
  );
}
