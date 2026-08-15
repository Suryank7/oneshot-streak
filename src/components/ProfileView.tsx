'use client';

// ============================================================
// ProfileView — Redesigned "My Streak Stats" Dashboard
// ============================================================

import React from 'react';
import type { StreakInfo } from '@/lib/types';
import { FlameIcon, TrophyIcon, ZapIcon, CalendarIcon, DiamondIcon, SparklesIcon } from './Icons';
import { Countdown } from './Countdown';

interface ProfileViewProps {
  streak: StreakInfo;
  nextPuzzleAt: string;
}

export function ProfileView({ streak, nextPuzzleAt }: ProfileViewProps) {
  const current = streak.current;
  const longest = streak.longest;

  // Compute level title based on streak
  const getLevelTitle = (count: number) => {
    if (count >= 30) return { title: 'Legendary Master', level: 5, color: '#ffb800' };
    if (count >= 14) return { title: 'Streak Champion', level: 4, color: '#f43f5e' };
    if (count >= 7) return { title: 'Streak Warrior', level: 3, color: '#ff523b' };
    if (count >= 3) return { title: 'Streak Apprentice', level: 2, color: '#2fa48e' };
    return { title: 'Rookie Guesser', level: 1, color: '#64748b' };
  };

  const levelInfo = getLevelTitle(current);

  // Milestones data
  const milestones = [
    { days: 3, label: '3 Days', icon: ZapIcon, color: '#2fa48e', unlocked: longest >= 3 },
    { days: 7, label: '7 Days', icon: FlameIcon, color: '#ff523b', unlocked: longest >= 7 },
    { days: 14, label: '14 Days', icon: TrophyIcon, color: '#f59e0b', unlocked: longest >= 14 },
    { days: 30, label: '30 Days', icon: DiamondIcon, color: '#00b4d8', unlocked: longest >= 30 },
  ];

  // 30-day activity grid mock visualization
  const calendarDays = Array.from({ length: 28 }, (_, idx) => {
    const dayNum = idx + 1;
    const isToday = idx === 27;
    const isPastStreak = idx >= 28 - current;
    let status: 'correct' | 'wrong' | 'missed' | 'future' = 'missed';
    if (isPastStreak && current > 0) {
      status = 'correct';
    } else if (idx % 5 === 0) {
      status = 'correct';
    } else if (idx % 7 === 0) {
      status = 'wrong';
    }
    return { day: dayNum, status, isToday };
  });

  return (
    <div className="welcome-screen animate-fade-in-up" style={{ paddingBottom: '30px' }}>
      {/* Hero Flame Level Banner */}
      <div className="streak-hero-card">
        <div className="streak-hero-flame animate-pulse-slow">
          <FlameIcon className="w-14 h-14" color="#ff523b" />
        </div>

        <div className="streak-hero-level">
          Level {levelInfo.level} • {levelInfo.title}
        </div>

        <div className="streak-hero-count">
          {current} <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Days</span>
        </div>

        <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
          {current > 0 ? 'Your streak is currently active! 🔥' : 'Play today to start your streak!'}
        </p>

        {/* Level progress bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '999px',
          marginTop: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(100, (current / (levelInfo.level * 7)) * 100)}%`,
            height: '100%',
            background: '#ffffff',
            borderRadius: '999px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Side-by-side Streak Cards */}
      <div className="streak-stats-grid">
        {/* Current Streak */}
        <div className="streak-stat-card">
          <div className="streak-stat-icon" style={{ background: '#fff0ee' }}>
            <FlameIcon className="w-6 h-6" color="#ff523b" />
          </div>
          <div>
            <div className="streak-stat-value" style={{ color: '#ff523b' }}>{current}</div>
            <div className="streak-stat-label">Current Streak</div>
          </div>
        </div>

        {/* Best Streak */}
        <div className="streak-stat-card">
          <div className="streak-stat-icon" style={{ background: '#fef3c7' }}>
            <TrophyIcon className="w-6 h-6" color="#f59e0b" />
          </div>
          <div>
            <div className="streak-stat-value" style={{ color: '#f59e0b' }}>{longest}</div>
            <div className="streak-stat-label">Best Streak</div>
          </div>
        </div>
      </div>

      {/* Milestones Row (Icon on RIGHT of title) */}
      <div style={{ width: '100%', margin: '20px 0 10px', textAlign: 'left' }}>
        <div className="section-title" style={{ fontSize: '1.15rem', marginBottom: '12px', justifyContent: 'flex-start' }}>
          <span>Streak Milestones</span>
          <SparklesIcon className="w-5 h-5" color="#ffb800" />
        </div>

        <div className="milestones-row">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.label} 
                className={`milestone-badge ${m.unlocked ? 'milestone-badge--unlocked' : ''}`}
              >
                <div 
                  className="milestone-icon"
                  style={{ background: m.unlocked ? m.color : '#cbd5e1' }}
                >
                  <Icon className="w-5 h-5" color="#ffffff" />
                </div>
                <div className="milestone-label">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 30-Day Activity Calendar (Icon on RIGHT of title) */}
      <div style={{ width: '100%', margin: '16px 0 20px' }}>
        <div className="section-title" style={{ fontSize: '1.15rem', marginBottom: '12px', justifyContent: 'flex-start' }}>
          <span>Activity Calendar</span>
          <CalendarIcon className="w-5 h-5" color="#2fa48e" />
        </div>

        <div className="activity-calendar">
          <div className="activity-calendar-grid">
            {calendarDays.map((d) => (
              <div 
                key={d.day} 
                className={`calendar-tile calendar-tile--${d.status} ${d.isToday ? 'calendar-tile--today' : ''}`}
                title={`Day ${d.day}: ${d.status}`}
              >
                {d.day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Minimal Redesigned "Next puzzle in" Banner */}
      {nextPuzzleAt && (
        <div className="next-puzzle-banner">
          <Countdown targetTime={nextPuzzleAt} />
        </div>
      )}
    </div>
  );
}
