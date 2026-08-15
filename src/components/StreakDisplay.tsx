'use client';

// ============================================================
// StreakDisplay — Current + Longest Streak
// ============================================================

import type { StreakInfo } from '@/lib/types';

interface StreakDisplayProps {
  streak: StreakInfo;
  animated?: boolean;
  isNewBest?: boolean;
}

export function StreakDisplay({ streak, animated, isNewBest }: StreakDisplayProps) {
  const currentClass = streak.current > 0
    ? 'streak__value streak__value--active'
    : 'streak__value streak__value--zero';

  const bestClass = isNewBest
    ? 'streak__value streak__value--active'
    : 'streak__value streak__value--best';

  return (
    <div className="streak animate-fade-in" aria-label="Streak information">
      <div className="streak__item">
        <span
          className={`${currentClass} ${animated ? 'animate-pulse' : ''}`}
          aria-label={`Current streak: ${streak.current} days`}
        >
          {streak.current}
        </span>
        <span className="streak__label">Current</span>
      </div>
      <div className="streak__item">
        <span
          className={bestClass}
          aria-label={`Longest streak: ${streak.longest} days`}
        >
          {streak.longest}
        </span>
        <span className="streak__label">Best</span>
        {isNewBest && (
          <span className="streak__new-best">New!</span>
        )}
      </div>
    </div>
  );
}
