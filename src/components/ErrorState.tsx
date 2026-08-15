'use client';

// ============================================================
// ErrorState — Network/API error display with retry
// ============================================================

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="card animate-fade-in">
      <div className="error-state" role="alert">
        <div className="error-state__icon" aria-hidden="true">⚡</div>
        <h2 className="error-state__title">Connection issue</h2>
        <p className="error-state__message">{message}</p>
        <button
          className="btn btn--secondary"
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
