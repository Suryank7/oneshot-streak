'use client';

// ============================================================
// ResultCard — Matches Image 2 Right Congrats Screen
// ============================================================

import React from 'react';
import { CongratsIllustration } from './Illustrations';
import { HomeIcon, StarIcon, SendIcon, TrophyIcon } from './Icons';

interface ResultCardProps {
  isCorrect: boolean;
  guess: number;
  answer: number;
  isNewBest?: boolean;
  onHomeClick?: () => void;
}

export function ResultCard({ isCorrect, guess, answer, isNewBest, onHomeClick }: ResultCardProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Streak Quiz Result',
        text: `I just played today's Streak puzzle! Answer was ${answer}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`I just played today's Streak puzzle! Answer was ${answer}.`);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="congrats-screen animate-fade-in-up">
      {/* Graphic Illustration */}
      <div className="congrats-illustration">
        <CongratsIllustration />
      </div>

      {/* Main Title */}
      <h2 className="congrats-title">
        {isCorrect ? 'Congrats! The quiz is done' : 'Not this time!'}
      </h2>

      {/* Answer Reveal Pill */}
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(8px)',
        padding: '8px 24px',
        borderRadius: '999px',
        fontSize: '1.2rem',
        fontWeight: 800,
        fontFamily: 'var(--font-heading)',
        margin: '10px 0 14px',
        display: 'inline-block'
      }}>
        Answer: {answer}
      </div>

      {/* Subtext */}
      <p className="congrats-sub">
        {isCorrect 
          ? 'Hopefully, the results are satisfying and provide new insights.' 
          : `You guessed ${guess}. Tomorrow is a fresh shot!`}
      </p>

      {isNewBest && (
        <div style={{
          background: 'var(--color-yellow-soft)',
          color: '#854d0e',
          padding: '6px 18px',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '0.85rem',
          marginBottom: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <TrophyIcon className="w-4 h-4" color="#854d0e" />
          <span>New Personal Best!</span>
        </div>
      )}

      {/* Ultra-Arranged & Beautiful Action Cards Grid */}
      <div className="congrats-actions-grid">
        <button 
          onClick={onHomeClick} 
          className="action-card-btn action-card-btn--home"
          type="button"
        >
          <div className="action-card-icon-wrap">
            <HomeIcon className="w-5 h-5" color="#0d0d0d" />
          </div>
          <span className="action-card-label">Home</span>
        </button>

        <button 
          onClick={() => alert('Thanks for rating Streak!')} 
          className="action-card-btn action-card-btn--rating"
          type="button"
        >
          <div className="action-card-icon-wrap" style={{ background: '#fbcfe8' }}>
            <StarIcon className="w-5 h-5" color="#be185d" />
          </div>
          <span className="action-card-label" style={{ color: '#be185d' }}>Rating</span>
        </button>

        <button 
          onClick={handleShare} 
          className="action-card-btn action-card-btn--share"
          type="button"
        >
          <div className="action-card-icon-wrap" style={{ background: '#fef08a' }}>
            <SendIcon className="w-5 h-5" color="#854d0e" />
          </div>
          <span className="action-card-label" style={{ color: '#854d0e' }}>Share</span>
        </button>
      </div>
    </div>
  );
}
