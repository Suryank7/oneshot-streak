'use client';

// ============================================================
// Countdown — Minimal Sleek Timer
// ============================================================

import { useState, useEffect } from 'react';
import { ClockIcon } from './Icons';

interface CountdownProps {
  targetTime: string; // ISO timestamp
}

export function Countdown({ targetTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const target = new Date(targetTime).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Available now!');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="minimal-countdown" aria-label="Next puzzle countdown">
      <span className="minimal-countdown__label">Next puzzle in</span>
      <div className="minimal-countdown__pill">
        <ClockIcon className="w-4 h-4" color="#2fa48e" />
        <span>{timeLeft}</span>
      </div>
    </div>
  );
}
