'use client';

// ============================================================
// PuzzleCard — Matches Image 2 Middle Quiz Screen
// ============================================================

import { useState, useRef, useEffect, type FormEvent } from 'react';
import type { PuzzleClues } from '@/lib/types';
import { LightbulbIcon, TargetIcon, KeyIcon } from './Icons';

interface PuzzleCardProps {
  clues: PuzzleClues;
  onSubmit: (guess: number) => void;
  isSubmitting: boolean;
}

export function PuzzleCard({ clues, onSubmit, isSubmitting }: PuzzleCardProps) {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const parsedGuess = parseInt(inputValue, 10);
  const isValidGuess = !isNaN(parsedGuess) && parsedGuess >= 1 && parsedGuess <= 50;
  const canSubmit = isValidGuess && !isSubmitting;

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setValidationError('');

    if (value !== '') {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        setValidationError('Enter a valid number');
      } else if (num < 1 || num > 50) {
        setValidationError('Must be between 1 and 50');
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (!isValidGuess) {
      setValidationError('Enter a number between 1 and 50');
      return;
    }

    onSubmit(parsedGuess);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="quiz-screen animate-fade-in-up">
      {/* Question Headline (Centered) */}
      <h2 className="quiz-question-title" style={{ textAlign: 'center' }}>
        What is always in front of you but can&apos;t be seen?
      </h2>

      {/* Clues Box with Sleek Proportional Badges */}
      <div className="clues-box">
        <div className="clue-chip">
          <div className="clue-chip-icon-badge" style={{ background: '#fff0ee', width: '30px', height: '30px', borderRadius: '10px' }}>
            <LightbulbIcon className="w-4 h-4" color="#ff523b" />
          </div>
          <span style={{ fontSize: '0.88rem' }}>{clues.clue_1}</span>
        </div>

        <div className="clue-chip">
          <div className="clue-chip-icon-badge" style={{ background: '#e6fffa', width: '30px', height: '30px', borderRadius: '10px' }}>
            <TargetIcon className="w-4 h-4" color="#2fa48e" />
          </div>
          <span style={{ fontSize: '0.88rem' }}>{clues.clue_2}</span>
        </div>

        <div className="clue-chip">
          <div className="clue-chip-icon-badge" style={{ background: '#fef3c7', width: '30px', height: '30px', borderRadius: '10px' }}>
            <KeyIcon className="w-4 h-4" color="#f59e0b" />
          </div>
          <span style={{ fontSize: '0.88rem' }}>{clues.clue_3}</span>
        </div>
      </div>

      {/* White Answer Input Card */}
      <div className="answer-card">
        <label htmlFor="guess-input" className="sr-only">
          Write your answer here
        </label>

        <input
          ref={inputRef}
          id="guess-input"
          type="number"
          className="answer-textarea"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Write your answer here..."
          min={1}
          max={50}
          disabled={isSubmitting}
          autoComplete="off"
        />

        {validationError && (
          <p style={{ color: 'var(--color-coral)', fontSize: '0.85rem', fontWeight: 600 }}>
            {validationError}
          </p>
        )}

        <button
          type="submit"
          className="btn-teal-pill"
          disabled={!canSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
