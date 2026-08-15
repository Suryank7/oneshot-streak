'use client';

// ============================================================
// LeaderboardView — Ultra-Beautiful Premium Gaming Podium
// ============================================================

import React from 'react';
import { UserAvatar } from './Illustrations';
import { DiamondIcon, TrophyIcon, StarIcon } from './Icons';

export function LeaderboardView() {
  const leaderboardData = [
    { rank: 1, name: 'Emma Ema', score: '888 Diamonds', points: 888, isTop3: true, avatarSeed: 0 },
    { rank: 2, name: 'Sophia Cba', score: '880 Diamonds', points: 880, isTop3: true, avatarSeed: 1 },
    { rank: 3, name: 'Andrew', score: '808 Diamonds', points: 808, isTop3: true, avatarSeed: 2 },
    { rank: 4, name: 'Bayu aji sadewa', score: '20 Point', points: 20, isTop3: false, avatarSeed: 3 },
    { rank: 5, name: 'Olivia Ava', score: '88 Point', points: 88, isTop3: false, avatarSeed: 4 },
    { rank: 6, name: 'David Joshua', score: '88 Point', points: 88, isTop3: false, avatarSeed: 5 },
    { rank: 7, name: 'Charlotte Harper', score: '22 Point', points: 22, isTop3: false, avatarSeed: 1 },
    { rank: 8, name: 'Mia Evelyn', score: '11 Point', points: 11, isTop3: false, avatarSeed: 2 },
  ];

  const rank1 = leaderboardData[0];
  const rank2 = leaderboardData[1];
  const rank3 = leaderboardData[2];
  const restPlayers = leaderboardData.slice(3);

  return (
    <div className="leaderboard-screen animate-fade-in-up">
      {/* Top 3 Podium Stage Card */}
      <div className="podium-card">
        <div className="podium-container">
          {/* Rank 2 - Left */}
          <div className="podium-slot">
            <div className="podium-avatar-wrap">
              <UserAvatar seed={rank2.avatarSeed} className="podium-avatar" />
              <div className="podium-badge podium-badge--2">2</div>
            </div>
            <div className="podium-name">{rank2.name}</div>
            <div className="podium-score-pill">
              <DiamondIcon className="w-3.5 h-3.5" color="#00b4d8" />
              <span>{rank2.points}</span>
            </div>
            <div className="podium-pedestal podium-pedestal--2">
              <span>🥈</span>
            </div>
          </div>

          {/* Rank 1 - Center (Gold Champion) */}
          <div className="podium-slot podium-slot--rank1">
            <div className="podium-crown">👑</div>
            <div className="podium-avatar-wrap">
              <UserAvatar seed={rank1.avatarSeed} className="podium-avatar podium-avatar--rank1" />
              <div className="podium-badge podium-badge--1">1</div>
            </div>
            <div className="podium-name podium-name--rank1">{rank1.name}</div>
            <div className="podium-score-pill podium-score-pill--gold">
              <DiamondIcon className="w-3.5 h-3.5" color="#ffb800" />
              <span>{rank1.points}</span>
            </div>
            <div className="podium-pedestal podium-pedestal--1">
              <TrophyIcon className="w-5 h-5" color="#ffffff" />
            </div>
          </div>

          {/* Rank 3 - Right */}
          <div className="podium-slot">
            <div className="podium-avatar-wrap">
              <UserAvatar seed={rank3.avatarSeed} className="podium-avatar" />
              <div className="podium-badge podium-badge--3">3</div>
            </div>
            <div className="podium-name">{rank3.name}</div>
            <div className="podium-score-pill">
              <DiamondIcon className="w-3.5 h-3.5" color="#00b4d8" />
              <span>{rank3.points}</span>
            </div>
            <div className="podium-pedestal podium-pedestal--3">
              <span>🥉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rest Players Ranked List */}
      <div className="leaderboard-list">
        {restPlayers.map((player) => (
          <div key={player.name} className="leaderboard-item">
            <div className="leaderboard-item__user">
              <div className="leaderboard-rank-num">#{player.rank}</div>
              <UserAvatar seed={player.avatarSeed} className="w-10 h-10" />
              <div>
                <div className="leaderboard-item__name">{player.name}</div>
                <div className="leaderboard-item__sub">Rank #{player.rank}</div>
              </div>
            </div>

            <div className="leaderboard-item__score-badge">
              <StarIcon className="w-3.5 h-3.5" color="#2fa48e" />
              <span>{player.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
