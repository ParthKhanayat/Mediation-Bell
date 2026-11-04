import React from 'react';
import CircularProgress from './CircularProgress';
import ZenControls from './ZenControls';
import { Bell, Disc, Sun, Sparkles, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { playBell } from '../services/zenAudio';

export default function ActiveTimer({
  status = 'idle',
  isPlaying = false,
  isCompleted = false,
  currentInterval = 1,
  totalIntervals = 4,
  minutesPerInterval = 5,
  formattedTime = '05:00',
  intervalProgress = 1.0,
  isWakeLockActive = false,
  isBellRinging = false,
  hideDigits = false,
  onToggleHideDigits,
  onTogglePlay,
  onReset,
  onOpenSettings,
  // Inspection / scrub controls
  onSeekInterval,
  onSeekProgress,
  onTriggerBellPulse,
}) {
  const handleTestBell = (type) => {
    if (onTriggerBellPulse) {
      onTriggerBellPulse(type === 'final' ? 5500 : 2800);
    }
    playBell(type);
  };

  return (
    <section className="zen-card zen-timer-card" aria-label="Active Meditation Timer">
      {/* Top Meta: Interval Badge & Screen Wake Lock & Zen Mode Toggle */}
      <div className="zen-timer-top-meta">
        <div className="zen-interval-badge" aria-live="polite">
          <span className={`zen-interval-dot ${isPlaying ? 'pulsing' : ''}`} aria-hidden="true" />
          <span>
            {isCompleted
              ? 'Session Complete'
              : `Interval ${currentInterval} of ${totalIntervals}`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Pure Zen Mode Toggle (Hide Digits) */}
          <button
            type="button"
            className={`zen-zen-mode-toggle ${hideDigits ? 'active' : ''}`}
            onClick={onToggleHideDigits}
            aria-label={hideDigits ? 'Show numeric countdown' : 'Pure Zen Mode: Hide countdown digits'}
            title={hideDigits ? 'Show Digits' : 'Pure Zen Mode (Hide Digits)'}
          >
            {hideDigits ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{hideDigits ? 'Digits Hidden' : 'Zen Mode'}</span>
          </button>

          {/* Screen Wake Lock Status */}
          {isWakeLockActive && (
            <div className="zen-wakelock-pill" title="Screen Wake Lock active - display will stay awake">
              <Sun size={12} />
              <span>Awake</span>
            </div>
          )}
        </div>
      </div>

      {/* Central Dial Area */}
      {isCompleted ? (
        <div className="zen-completed-view">
          <div className="zen-completed-icon-wrap" aria-hidden="true">
            <Sparkles size={36} strokeWidth={1.5} />
          </div>
          <h3 className="zen-completed-title">Session Complete</h3>
          <p className="zen-completed-subtitle">
            {totalIntervals} intervals of mindful stillness completed.
          </p>
          <p className="zen-completed-blessing">
            May the calm and clarity of this practice accompany you.
          </p>

          <button
            type="button"
            className="zen-completed-reset-btn"
            onClick={onReset}
            aria-label="Start a new meditation session"
          >
            <RotateCcw size={16} />
            <span>Sit Again</span>
          </button>
        </div>
      ) : (
        <>
          <CircularProgress progress={intervalProgress} isBellRinging={isBellRinging}>
            {hideDigits ? (
              <div className="zen-pure-dial-content" onClick={onToggleHideDigits} role="button" tabIndex={0}>
                <div className="zen-meditation-enso" aria-hidden="true">
                  <div className={`zen-breathing-core ${isPlaying ? 'breathing' : ''}`} />
                </div>
                <span className="zen-dial-subtext">
                  {isPlaying ? 'Pure Presence' : 'Paused'}
                </span>
              </div>
            ) : (
              <>
                <time className="zen-countdown-digits" dateTime={formattedTime}>
                  {formattedTime}
                </time>
                <span className="zen-dial-subtext">
                  {isPlaying
                    ? `Interval ${currentInterval} in Progress`
                    : status === 'paused'
                    ? 'Session Paused'
                    : 'Ready to Begin'}
                </span>
              </>
            )}
          </CircularProgress>

          {/* Large Tap-Target Controls */}
          <ZenControls
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
            onReset={onReset}
            onOpenSettings={onOpenSettings}
          />
        </>
      )}

      {/* Mock & Fast-Forward Testing Bar (Dims when running) */}
      <div className="zen-mock-toolbar zen-secondary-control" role="region" aria-label="Timer testing tools">
        <div className="mock-toolbar-header">
          <span>Drift-Free Engine Testing</span>
          <span className="mock-toolbar-badge">
            {isWakeLockActive ? 'WakeLock: ON' : 'WakeLock: Ready'}
          </span>
        </div>

        <div className="mock-toolbar-actions">
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="mock-toolbar-btn"
              onClick={() => onSeekInterval && onSeekInterval(Math.max(1, currentInterval - 1))}
              disabled={currentInterval <= 1 || isCompleted}
            >
              Prev Interval
            </button>
            <button
              type="button"
              className="mock-toolbar-btn"
              onClick={() =>
                onSeekInterval && onSeekInterval(Math.min(totalIntervals, currentInterval + 1))
              }
              disabled={currentInterval >= totalIntervals || isCompleted}
            >
              Next Interval
            </button>
            <button
              type="button"
              className="mock-toolbar-btn"
              onClick={() => onSeekProgress && onSeekProgress(0.02)} // Jump to last 2% (near 00:00)
              disabled={isCompleted}
              title="Jump to last few seconds of interval to hear transition chime and test ring pulse"
            >
              Near 00:00 (Test Chime &amp; Pulse)
            </button>
          </div>

          {/* Direct Sound Test Buttons with Visual Pulse */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', width: '100%' }}>
            <button
              type="button"
              className="mock-toolbar-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flex: 1 }}
              onClick={() => handleTestBell('interval')}
              title="Ring 528Hz Interval Bell"
            >
              <Bell size={12} />
              <span>Interval Chime (528Hz)</span>
            </button>
            <button
              type="button"
              className="mock-toolbar-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flex: 1 }}
              onClick={() => handleTestBell('final')}
              title="Ring Deep Singing Bowl"
            >
              <Disc size={12} />
              <span>Final Bowl (256Hz)</span>
            </button>
          </div>
        </div>

        {!isCompleted && (
          <div className="mock-slider-wrap">
            <span style={{ fontSize: '0.72rem', color: 'var(--color-sand-muted)' }}>Progress:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={intervalProgress}
              onChange={(e) => onSeekProgress && onSeekProgress(parseFloat(e.target.value))}
              className="mock-slider"
              aria-label="Scrub progress within current interval"
            />
            <span
              style={{ fontSize: '0.72rem', color: 'var(--color-sage-light)', minWidth: '32px' }}
            >
              {Math.round(intervalProgress * 100)}%
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
