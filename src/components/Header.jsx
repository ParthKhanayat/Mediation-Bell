import React from 'react';
import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="zen-header">
      <div className="zen-logo-mark" aria-hidden="true">
        <Bell size={22} strokeWidth={1.75} />
      </div>
      <h1 className="zen-title">Meditation Bell</h1>
      <p className="zen-subtitle">Interval Mindfulness Timer</p>
    </header>
  );
}

