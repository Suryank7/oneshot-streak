'use client';

// ============================================================
// Game — Main State Machine & Exact UI Reference Orchestrator
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { api, ApiRequestError } from '@/lib/api';
import { getOrCreatePlayerId, createFreshPlayerId } from '@/lib/player';

import { PuzzleCard } from './PuzzleCard';
import { ResultCard } from './ResultCard';
import { StreakDisplay } from './StreakDisplay';
import { Countdown } from './Countdown';
import { ErrorState } from './ErrorState';
import { HomeDashboardView } from './HomeDashboardView';
import { LeaderboardView } from './LeaderboardView';
import { ProfileView } from './ProfileView';
import { 
  TrophyIcon, 
  DiamondIcon, 
  ClockIcon, 
  ShieldIcon, 
  HomeIcon, 
  CardsIcon, 
  LeaderboardIcon, 
  UserIcon,
  ChevronLeftIcon,
  CloseIcon 
} from './Icons';
import type { UIState, PuzzleResponse, GuessResponse, StreakInfo, PuzzleClues } from '@/lib/types';

export function Game() {
  const [activeTab, setActiveTab] = useState<'home' | 'quiz' | 'rank' | 'profile'>('home');
  const [uiState, setUIState] = useState<UIState>('loading');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [puzzle, setPuzzle] = useState<PuzzleClues | null>(null);
  const [streak, setStreak] = useState<StreakInfo>({ current: 0, longest: 0 });
  const [result, setResult] = useState<{
    guess: number;
    is_correct: boolean;
    answer: number;
    is_new_best?: boolean;
  } | null>(null);
  const [nextPuzzleAt, setNextPuzzleAt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [unavailableMessage, setUnavailableMessage] = useState<string>('');

  // Live Quiz Timer State (3 mins 3 seconds = 183s)
  const [quizTimerSeconds, setQuizTimerSeconds] = useState<number>(183);

  useEffect(() => {
    if (activeTab !== 'quiz' || (uiState !== 'ready' && uiState !== 'submitting')) {
      return;
    }
    const timer = setInterval(() => {
      setQuizTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab, uiState]);

  const formatQuizTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // --- Initialize: Get player ID + load game state ---
  const loadGameState = useCallback(async () => {
    try {
      setUIState('loading');
      const id = await getOrCreatePlayerId();
      setPlayerId(id);

      const gameState: PuzzleResponse = await api.getPuzzle(id);
      setPuzzle(gameState.puzzle);
      setStreak(gameState.streak);
      setNextPuzzleAt(gameState.next_puzzle_at);

      if (gameState.state === 'completed' && gameState.result) {
        setResult({
          guess: gameState.result.guess,
          is_correct: gameState.result.is_correct,
          answer: gameState.result.answer,
        });
        setUIState(gameState.result.is_correct ? 'correct' : 'wrong');
      } else if (gameState.state === 'unavailable') {
        setUnavailableMessage(gameState.message || 'No puzzle available today.');
        setUIState('unavailable');
      } else {
        setUIState('ready');
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
      if (
        error instanceof ApiRequestError &&
        (error.code === 'player_not_found' ||
         error.code === 'invalid_player_id' ||
         error.statusCode === 400 ||
         error.statusCode === 404)
      ) {
        try {
          const freshId = await createFreshPlayerId();
          setPlayerId(freshId);
          const gameState: PuzzleResponse = await api.getPuzzle(freshId);
          setPuzzle(gameState.puzzle);
          setStreak(gameState.streak);
          setNextPuzzleAt(gameState.next_puzzle_at);
          setUIState(gameState.state === 'unavailable' ? 'unavailable' : 'ready');
          return;
        } catch (retryErr) {
          console.error('Failed auto-recovering player:', retryErr);
        }
      }

      setErrorMessage('Could not connect to the server. Please check your connection.');
      setUIState('error');
    }

  }, []);

  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  // --- Submit guess ---
  const handleGuess = useCallback(async (guess: number) => {
    if (!playerId || uiState !== 'ready') return;

    setUIState('submitting');
    setErrorMessage('');

    try {
      const response: GuessResponse = await api.submitGuess(playerId, guess);

      setResult({
        guess,
        is_correct: response.result === 'correct',
        answer: response.answer,
        is_new_best: response.streak.is_new_best,
      });
      setStreak(response.streak);
      setNextPuzzleAt(response.next_puzzle_at);
      setUIState(response.result === 'correct' ? 'correct' : 'wrong');
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === 'already_played') {
          await loadGameState();
          return;
        }
        setErrorMessage(error.message);
      } else {
        setErrorMessage("We couldn't confirm your shot. Check your connection and try again.");
      }
      setUIState('error');
    }
  }, [playerId, uiState, loadGameState]);

  // Determine container theme class based on tab/state
  let wrapperClass = 'mobile-wrapper';
  if (activeTab === 'quiz') {
    if (uiState === 'correct' || uiState === 'wrong') {
      wrapperClass = 'mobile-wrapper mobile-wrapper--mint';
    } else {
      wrapperClass = 'mobile-wrapper mobile-wrapper--pink';
    }
  }

  return (
    <div className={wrapperClass}>
      {/* Top Header Bar */}
      {activeTab === 'quiz' && (uiState === 'ready' || uiState === 'submitting') ? (
        <div className="top-header">
          <button 
            onClick={() => setActiveTab('home')} 
            className="top-header__icon-btn"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <div className="timer-badge">
            <ClockIcon className="w-4 h-4" />
            <span>{formatQuizTimer(quizTimerSeconds)}</span>
          </div>

          <div className="hp-badge">
            <ShieldIcon className="w-4 h-4" color="#ff523b" />
            <span>20 HP</span>
          </div>
        </div>
      ) : activeTab === 'quiz' && (uiState === 'correct' || uiState === 'wrong') ? (
        <div className="top-header">
          <div />
          <button 
            onClick={() => setActiveTab('home')} 
            className="top-header__icon-btn" 
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}
          >
            <CloseIcon className="w-5 h-5" color="#ffffff" />
          </button>
        </div>
      ) : (
        <div className="top-header">
          <div className="top-header__logo">
            {activeTab === 'rank' ? (
              <>Leaderboard <TrophyIcon className="w-7 h-7" color="#ffb800" /></>
            ) : activeTab === 'profile' ? (
              <>My Streak <TrophyIcon className="w-7 h-7" color="#ff523b" /></>
            ) : (
              <>Quiz <TrophyIcon className="w-7 h-7" color="#ffb800" /></>
            )}
          </div>

          <div className="diamond-badge">
            <DiamondIcon className="w-4 h-4" color="#00b4d8" />
            <span>20</span>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="app-screen-content">
        {activeTab === 'home' && (
          <HomeDashboardView 
            onStartQuiz={() => setActiveTab('quiz')} 
          />
        )}

        {activeTab === 'rank' && (
          <LeaderboardView />
        )}

        {activeTab === 'profile' && (
          <ProfileView 
            streak={streak} 
            nextPuzzleAt={nextPuzzleAt} 
          />
        )}

        {activeTab === 'quiz' && (
          <>
            {uiState === 'loading' && (
              <div className="loading" role="status" aria-label="Loading game">
                <div className="loading__spinner" />
                <p className="loading__text">Loading quiz...</p>
              </div>
            )}

            {uiState === 'error' && (
              <ErrorState
                message={errorMessage}
                onRetry={loadGameState}
              />
            )}

            {uiState === 'unavailable' && (
              <div className="welcome-screen animate-fade-in-up">
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌙</div>
                <h2 className="welcome-title">No puzzle today</h2>
                <p className="welcome-subtitle">{unavailableMessage}</p>
                <StreakDisplay streak={streak} />
                {nextPuzzleAt && <Countdown targetTime={nextPuzzleAt} />}
              </div>
            )}

            {(uiState === 'ready' || uiState === 'submitting') && puzzle && (
              <PuzzleCard
                clues={puzzle}
                onSubmit={handleGuess}
                isSubmitting={uiState === 'submitting'}
              />
            )}

            {(uiState === 'correct' || uiState === 'wrong') && result && (
              <ResultCard
                isCorrect={result.is_correct}
                guess={result.guess}
                answer={result.answer}
                isNewBest={result.is_new_best}
                onHomeClick={() => setActiveTab('home')}
              />
            )}
          </>
        )}
      </div>

      {/* Floating Bottom Navigation Bar (ALL OPTIONS VISIBLE) */}
      <div className="bottom-nav-wrap">
        <nav className="bottom-nav">
          <button
            onClick={() => setActiveTab('home')}
            className={`bottom-nav__item ${activeTab === 'home' ? 'bottom-nav__item--active' : ''}`}
            type="button"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`bottom-nav__item ${activeTab === 'quiz' ? 'bottom-nav__item--active' : ''}`}
            type="button"
          >
            <CardsIcon className="w-5 h-5" />
            <span>Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('rank')}
            className={`bottom-nav__item ${activeTab === 'rank' ? 'bottom-nav__item--active' : ''}`}
            type="button"
          >
            <LeaderboardIcon className="w-5 h-5" />
            <span>Rank</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`bottom-nav__item ${activeTab === 'profile' ? 'bottom-nav__item--active' : ''}`}
            type="button"
          >
            <UserIcon className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
