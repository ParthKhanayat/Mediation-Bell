import React from 'react';
import { Bell, Sparkles } from 'lucide-react';

export default function Header({ completedSessionsCount = 0 }) {
  return (
    <header className="zen-header">
      <div className="zen-logo-mark" aria-hidden="true">
        <Bell size={22} strokeWidth={1.75} />
      </div>
      <h1 className="zen-title">Meditation Bell</h1>
      <p className="zen-subtitle">Interval Mindfulness Timer</p>

      {/* Lifetime Meditation Sessions Done Counter */}
      <div
        className="zen-header-lifetime-pill"
        title="Lifetime meditation sessions completed"
        aria-label={`${completedSessionsCount} lifetime sessions completed`}
      >
        <Sparkles size={12} />
        <span>
          {completedSessionsCount} {completedSessionsCount === 1 ? 'session' : 'sessions'} done
        </span>
      </div>
    </header>
  );
}
