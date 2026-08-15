'use client';

import React, { useState } from 'react';
import { 
  WelcomeCollageIllustration, 
  TechCardIllustration, 
  FriendshipCardIllustration 
} from './Illustrations';
import { FlameIcon, BrainIcon, ChevronLeftIcon } from './Icons';

interface HomeDashboardViewProps {
  onStartQuiz: () => void;
}

export function HomeDashboardView({ onStartQuiz }: HomeDashboardViewProps) {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'dashboard' | 'pick_card'>('welcome');

  // Step 1: Welcome / Onboarding (Image 1 Center)
  if (currentStep === 'welcome') {
    return (
      <div className="welcome-screen animate-fade-in-up">
        {/* Collage Illustration */}
        <div className="welcome-illustration">
          <WelcomeCollageIllustration />
        </div>

        {/* Title */}
        <h2 className="welcome-title">
          Play To Gain Your Knowledge
        </h2>

        {/* Subtext */}
        <p className="welcome-subtitle">
          They have downloaded gmail and seems to be working for now i also believe it&apos;s important for every member
        </p>

        {/* Get Started Button */}
        <button 
          onClick={() => setCurrentStep('dashboard')}
          className="btn-black-pill animate-pulse-slow"
        >
          Get started
        </button>
      </div>
    );
  }

  // Step 3: Pick a Card to play quiz (Image 2 Left)
  if (currentStep === 'pick_card') {
    return (
      <div className="pick-card-container animate-fade-in-up">
        <div className="top-header" style={{ padding: '0 0 16px 0' }}>
          <button 
            onClick={() => setCurrentStep('dashboard')}
            className="top-header__icon-btn"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <button className="diamond-badge" style={{ fontSize: '0.85rem' }}>
            Customize quiz
          </button>
        </div>

        <h2 className="pick-card__headline">
          Pick a card to play quiz
        </h2>
        <p className="pick-card__sub">
          Select the quiz category you want to play
        </p>

        {/* Center Friendship Card */}
        <div className="pick-card__center-card">
          <div className="pick-card__badge">
            Friendship quiz
          </div>
          <p className="pick-card__card-desc">
            A quiz suitable for gathering friends.
          </p>

          <div className="pick-card__hp">
            <span>🛡️</span>
            <span>100 HP</span>
          </div>

          <div className="pick-card__illu">
            <FriendshipCardIllustration />
          </div>
        </div>

        <button 
          onClick={onStartQuiz}
          className="btn-black-pill"
        >
          Play Quiz
        </button>
      </div>
    );
  }

  // Step 2: Home Dashboard (Image 1 Left)
  return (
    <div className="animate-fade-in-up">
      {/* Upgrade Pro Banner */}
      <div className="upgrade-banner">
        <div>
          <div className="upgrade-banner__title">Upgrade pro</div>
          <div className="upgrade-banner__text">
            Upgrade to remove ads, unlimited play and access all game
          </div>
        </div>
        <button 
          onClick={() => alert('Upgraded to Pro!')}
          className="btn-small-pill"
        >
          Upgrade
        </button>
      </div>

      {/* Popular Game Section */}
      <div className="section-header">
        <div className="section-title">
          Popular Game <FlameIcon className="w-5 h-5" color="#ff523b" />
        </div>
      </div>

      {/* Card Carousel */}
      <div className="card-carousel">
        {/* Card 1: Technology */}
        <div 
          onClick={() => setCurrentStep('pick_card')}
          className="quiz-card quiz-card--coral"
        >
          <span className="quiz-card__tag">Tech</span>
          <div>
            <div className="quiz-card__title">Technology</div>
            <p className="quiz-card__desc">
              Explore the world of technology with the interesting Technology Quiz Quiz and see if you have what it takes to go from a novice to a tech master!
            </p>
          </div>
          <div className="quiz-card__illustration">
            <TechCardIllustration />
          </div>
        </div>

        {/* Card 2: Social Sciences */}
        <div 
          onClick={() => setCurrentStep('pick_card')}
          className="quiz-card quiz-card--teal"
        >
          <span className="quiz-card__tag">Social</span>
          <div>
            <div className="quiz-card__title">Social sciences</div>
            <p className="quiz-card__desc">
              Explore human society, culture, and social relationships in this interactive knowledge challenge.
            </p>
          </div>
          <div className="quiz-card__illustration">
            <TechCardIllustration />
          </div>
        </div>
      </div>

      {/* Recent Played Section */}
      <div className="section-header">
        <div className="section-title" style={{ fontSize: '1.2rem' }}>
          Recent Played
        </div>
      </div>

      <div className="recent-list">
        <div className="recent-item">
          <div className="recent-item__info">
            <div className="recent-item__icon">
              <BrainIcon className="w-6 h-6" color="#ff523b" />
            </div>
            <div>
              <div className="recent-item__title">Social sciences</div>
              <div className="recent-item__sub">Version 2.0</div>
            </div>
          </div>
          <button 
            onClick={() => setCurrentStep('pick_card')}
            className="btn-coral-pill"
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}
