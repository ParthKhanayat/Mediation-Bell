import React from 'react';
import CircularProgress from './CircularProgress';
import ZenControls from './ZenControls';
import { Bell, Disc } from 'lucide-react';
import { playBell, unlockAudio } from '../services/zenAudio';

export default function ActiveTimer({
  currentInterval = 2,
  totalIntervals = 4,
  minutesPerInterval = 5,
  mockSecondsRemaining = 225, // e.g. 3m 45s out of 5m
  isPlaying = false,
  onTogglePlay,
  onReset,
  onOpenSettings,
  // Mock inspection controls
  onMockIntervalChange,
  onMockSecondsChange,
}) {
  // Format MM:SS with leading zeroes
  const totalSecondsInInterval = Math.max(1, minutesPerInterval * 60);
  const minutes = Math.floor(mockSecondsRemaining / 60);
  const seconds = mockSecondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress depleting smoothly: 1 (full) down to 0 (empty)
  const progress = Math.max(0, Math.min(1, mockSecondsRemaining / totalSecondsInInterval));

  const handleControlPlayToggle = async () => {
    await unlockAudio();
    onTogglePlay();
  };

  return (
    <section className="zen-card zen-timer-card" aria-label="Active Meditation Timer">
      {/* Subtle current interval indicator */}
      <div className="zen-interval-badge" aria-live="polite">
        <span className="zen-interval-dot" aria-hidden="true" />
        <span>
          Interval {currentInterval} of {totalIntervals}
        </span>
      </div>

      {/* Central Circular Dial with Large Calm Countdown */}
      <CircularProgress progress={progress}>
        <time className="zen-countdown-digits" dateTime={`PT${minutes}M${seconds}S`}>
          {formattedTime}
        </time>
        <span className="zen-dial-subtext">
          {isPlaying ? 'Breathing in Stillness' : 'Session Paused'}
        </span>
      </CircularProgress>

      {/* Large Tap-Target Controls */}
      <ZenControls
        isPlaying={isPlaying}
        onTogglePlay={handleControlPlayToggle}
        onReset={onReset}
        onOpenSettings={onOpenSettings}
      />

      {/* Mock State Interactive Testing Bar */}
      <div className="zen-mock-toolbar" role="region" aria-label="Mock state inspection tools">
        <div className="mock-toolbar-header">
          <span>Mock State Playground</span>
          <span className="mock-toolbar-badge">Interactive Sound &amp; Timer</span>
        </div>

        <div className="mock-toolbar-actions">
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="mock-toolbar-btn"
              onClick={() => onMockIntervalChange(Math.max(1, currentInterval - 1))}
              disabled={currentInterval <= 1}
            >
              Prev Interval
            </button>
            <button
              type="button"
              className="mock-toolbar-btn"
              onClick={() => onMockIntervalChange(Math.min(totalIntervals, currentInterval + 1))}
              disabled={currentInterval >= totalIntervals}
            >
              Next Interval
            </button>
            <button
              type="button"
              className="mock-toolbar-btn"
              onClick={() => onMockSecondsChange(Math.round(totalSecondsInInterval * 0.75))}
            >
              75% Ring
            </button>
            <button
              type="button"
              className="mock-toolbar-btn"
              onClick={() => onMockSecondsChange(Math.round(totalSecondsInInterval * 0.25))}
            >
              25% Ring
            </button>
          </div>

          {/* Sound trigger test buttons inside active timer view */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', width: '100%' }}>
            <button
              type="button"
              className="mock-toolbar-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flex: 1 }}
              onClick={() => playBell('interval')}
              title="Ring 528Hz Interval Bell"
            >
              <Bell size={12} />
              <span>Ring Chime</span>
            </button>
            <button
              type="button"
              className="mock-toolbar-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flex: 1 }}
              onClick={() => playBell('final')}
              title="Ring Deep Singing Bowl"
            >
              <Disc size={12} />
              <span>Ring Final Bowl</span>
            </button>
          </div>
        </div>

        <div className="mock-slider-wrap">
          <span style={{ fontSize: '0.72rem', color: 'var(--color-sand-muted)' }}>Progress:</span>
          <input
            type="range"
            min="0"
            max={totalSecondsInInterval}
            value={mockSecondsRemaining}
            onChange={(e) => onMockSecondsChange(Number(e.target.value))}
            className="mock-slider"
            aria-label="Simulate remaining time in current interval"
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--color-sage-light)', minWidth: '32px' }}>
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>
    </section>
  );
}
