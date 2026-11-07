import React from 'react';
import LotusIcon from './LotusIcon';

export default function Header({ completedSessionsCount = 0 }) {
  return (
    <header className="zen-header">
      <div className="zen-header-brand-wrap">
        <div className="zen-logo-mark zen-pearl-orb" aria-hidden="true">
          <div className="zen-pearl-orb-sheen" />
          <LotusIcon size={22} strokeWidth={1.8} />
        </div>
      </div>
      <h1 className="zen-title">Meditation Bell</h1>
      <p className="zen-subtitle">Interval Mindfulness Timer</p>

      {/* Lifetime Meditation Sessions Done Counter */}
      <div
        className="zen-header-lifetime-pill"
        title="Lifetime meditation sessions completed"
        aria-label={`${completedSessionsCount} lifetime sessions completed`}
      >
        <LotusIcon size={14} strokeWidth={1.8} />
        <span>
          {completedSessionsCount} {completedSessionsCount === 1 ? 'session' : 'sessions'} done
        </span>
      </div>
    </header>
  );
}
