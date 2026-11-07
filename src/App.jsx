import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IntervalConfig from './components/IntervalConfig';
import ActiveTimer from './components/ActiveTimer';
import { Sliders, Timer, Columns } from 'lucide-react';
import { AUDIO_CONFIG } from './services/zenAudio';
import { useIntervalTimer } from './hooks/useIntervalTimer';

// LocalStorage Keys for persistent preferences
const STORAGE_KEY_INTERVALS = 'zen_bell_intervals';
const STORAGE_KEY_MINUTES = 'zen_bell_minutes';
const STORAGE_KEY_SOUND_ENABLED = 'zen_bell_sound_enabled';
const STORAGE_KEY_DOUBLE_STRIKE = 'zen_bell_double_strike';
const STORAGE_KEY_HIDE_DIGITS = 'zen_bell_hide_digits';
const STORAGE_KEY_IS_CUSTOM = 'zen_bell_is_custom';
const STORAGE_KEY_CUSTOM_DURATIONS = 'zen_bell_custom_durations';
const STORAGE_KEY_LIFETIME_SESSIONS = 'zen_bell_lifetime_sessions';

export default function App() {
  // 1. Session Configuration Parameters (Loaded from localStorage)
  const [intervals, setIntervals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INTERVALS);
      const val = parseInt(saved, 10);
      return !isNaN(val) && val >= 1 && val <= 30 ? val : 4;
    } catch {
      return 4;
    }
  });

  const [minutes, setMinutes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MINUTES);
      const val = parseInt(saved, 10);
      return !isNaN(val) && val >= 1 && val <= 120 ? val : 5;
    } catch {
      return 5;
    }
  });

  // Custom individual interval durations
  const [isCustomIntervals, setIsCustomIntervals] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_IS_CUSTOM) === 'true';
    } catch {
      return false;
    }
  });

  const [customDurations, setCustomDurations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_DURATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return Array(4).fill(5);
  });

  // Sound Synthesizer Options
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND_ENABLED);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [doubleStrike, setDoubleStrike] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOUBLE_STRIKE);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Pure Zen Mode (Option to hide digits for distraction-free sit)
  const [hideDigits, setHideDigits] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_HIDE_DIGITS) === 'true';
    } catch {
      return false;
    }
  });

  // Lifetime Completed Meditation Sessions Counter (stored in localStorage)
  const [completedSessionsCount, setCompletedSessionsCount] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIFETIME_SESSIONS);
      const parsed = parseInt(saved, 10);
      return !isNaN(parsed) && parsed >= 0 ? parsed : 0;
    } catch {
      return 0;
    }
  });

  // View state: 'config' | 'timer' | 'both'
  const [viewMode, setViewMode] = useState('both');

  // Keep customDurations length synced with intervals
  useEffect(() => {
    setCustomDurations((prev) => {
      if (prev.length === intervals) return prev;
      if (prev.length < intervals) {
        return [...prev, ...Array(intervals - prev.length).fill(minutes)];
      }
      return prev.slice(0, intervals);
    });
  }, [intervals, minutes]);

  // Automatically save preferences to localStorage on return
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INTERVALS, String(intervals));
    } catch {}
  }, [intervals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MINUTES, String(minutes));
    } catch {}
  }, [minutes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOUND_ENABLED, String(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOUBLE_STRIKE, String(doubleStrike));
    } catch {}
  }, [doubleStrike]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HIDE_DIGITS, String(hideDigits));
    } catch {}
  }, [hideDigits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_IS_CUSTOM, String(isCustomIntervals));
    } catch {}
  }, [isCustomIntervals]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CUSTOM_DURATIONS,
        JSON.stringify(customDurations)
      );
    } catch {}
  }, [customDurations]);

  // Persist lifetime completed sessions count in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_LIFETIME_SESSIONS,
        String(completedSessionsCount)
      );
    } catch {}
  }, [completedSessionsCount]);

  const handleSessionComplete = () => {
    setCompletedSessionsCount((prev) => prev + 1);
  };

  // Synchronize master sound settings with audio singleton
  useEffect(() => {
    AUDIO_CONFIG.soundEnabled = soundEnabled;
    AUDIO_CONFIG.finalBell.doubleStrike = doubleStrike;
  }, [soundEnabled, doubleStrike]);

  // High-Precision Drift-Free Interval Timer Engine
  const timer = useIntervalTimer({
    intervals,
    minutes,
    isCustomIntervals,
    customDurations,
    soundEnabled,
    doubleStrike,
    onSessionComplete: handleSessionComplete,
  });

  const handleStartSession = async () => {
    await timer.startTimer();
    setViewMode('timer');
  };

  const handleToggleCustomIntervals = () => {
    setIsCustomIntervals((prev) => !prev);
    if (timer.status !== 'running') timer.resetTimer();
  };

  const handleCustomDurationChange = (index, newMin) => {
    setCustomDurations((prev) => {
      const copy = [...prev];
      copy[index] = newMin;
      return copy;
    });
    if (timer.status !== 'running') timer.resetTimer();
  };

  const handleResetCustomToUniform = () => {
    setCustomDurations(Array(intervals).fill(minutes));
    if (timer.status !== 'running') timer.resetTimer();
  };

  const handlePresetSelect = (newIntervals, newMinutes) => {
    setIntervals(newIntervals);
    setMinutes(newMinutes);
    setCustomDurations(Array(newIntervals).fill(newMinutes));
    if (timer.status !== 'running') timer.resetTimer();
  };

  return (
    <div className={`zen-app-wrapper ${timer.isPlaying ? 'zen-timer-running' : ''}`}>
      {/* Dreamy Multi-Layered Ambient Mesh & Aura Blobs (Image 1 Inspiration) */}
      <div className="zen-ambient-mesh-canvas" aria-hidden="true">
        <div className="zen-aura-blob zen-blob-peach" />
        <div className="zen-aura-blob zen-blob-rose" />
        <div className="zen-aura-blob zen-blob-lavender" />
        <div className="zen-aura-blob zen-blob-periwinkle" />
      </div>

      {/* Header - Dims gently during active sitting */}
      <div className="zen-header-container zen-secondary-dim">
        <Header completedSessionsCount={completedSessionsCount} />
      </div>

      {/* View Mode Switcher - Dims gently during active sitting */}
      <nav className="zen-view-switcher zen-secondary-dim" aria-label="Zen timer mode selector">
        <button
          type="button"
          className={`zen-view-tab ${viewMode === 'config' ? 'active' : ''}`}
          onClick={() => setViewMode('config')}
        >
          <Sliders size={15} />
          <span>Setup &amp; Sounds</span>
        </button>

        <button
          type="button"
          className={`zen-view-tab ${viewMode === 'timer' ? 'active' : ''}`}
          onClick={() => setViewMode('timer')}
        >
          <Timer size={15} />
          <span>
            {timer.status === 'running'
              ? `Timer (${timer.formattedTime})`
              : 'Active Timer'}
          </span>
        </button>

        <button
          type="button"
          className={`zen-view-tab ${viewMode === 'both' ? 'active' : ''}`}
          onClick={() => setViewMode('both')}
        >
          <Columns size={15} />
          <span>Dual View</span>
        </button>
      </nav>

      {/* Main Responsive Layout */}
      <main className={`zen-main-container ${viewMode === 'both' ? 'dual-mode' : ''}`}>
        {viewMode === 'both' ? (
          <div className="zen-dual-layout">
            <div className="zen-secondary-dim zen-config-wrapper">
              <IntervalConfig
                intervals={intervals}
                minutes={minutes}
                onIntervalsChange={(val) => {
                  setIntervals(val);
                  if (timer.status !== 'running') timer.resetTimer();
                }}
                onMinutesChange={(val) => {
                  setMinutes(val);
                  if (timer.status !== 'running') timer.resetTimer();
                }}
                onStartSession={handleStartSession}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled((prev) => !prev)}
                doubleStrike={doubleStrike}
                onToggleDoubleStrike={() => setDoubleStrike((prev) => !prev)}
                isCustomIntervals={isCustomIntervals}
                onToggleCustomIntervals={handleToggleCustomIntervals}
                customDurations={customDurations}
                onCustomDurationChange={handleCustomDurationChange}
                onResetCustomToUniform={handleResetCustomToUniform}
              />
            </div>

            <ActiveTimer
              status={timer.status}
              isPlaying={timer.isPlaying}
              isCompleted={timer.isCompleted}
              currentInterval={timer.currentInterval}
              totalIntervals={timer.totalIntervals}
              minutesPerInterval={timer.minutesPerInterval}
              formattedTime={timer.formattedTime}
              intervalProgress={timer.intervalProgress}
              isWakeLockActive={timer.isWakeLockActive}
              isBellRinging={timer.isBellRinging}
              hideDigits={hideDigits}
              completedSessionsCount={completedSessionsCount}
              onToggleHideDigits={() => setHideDigits((prev) => !prev)}
              onTogglePlay={timer.togglePlay}
              onReset={timer.resetTimer}
              onOpenSettings={() => setViewMode('config')}
              onSeekInterval={timer.seekToInterval}
              onSeekProgress={timer.seekIntervalProgress}
              onTriggerBellPulse={timer.triggerBellPulse}
            />
          </div>
        ) : viewMode === 'config' ? (
          <div className="zen-config-wrapper">
            <IntervalConfig
              intervals={intervals}
              minutes={minutes}
              onIntervalsChange={(val) => {
                setIntervals(val);
                if (timer.status !== 'running') timer.resetTimer();
              }}
              onMinutesChange={(val) => {
                setMinutes(val);
                if (timer.status !== 'running') timer.resetTimer();
              }}
              onStartSession={handleStartSession}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled((prev) => !prev)}
              doubleStrike={doubleStrike}
              onToggleDoubleStrike={() => setDoubleStrike((prev) => !prev)}
              isCustomIntervals={isCustomIntervals}
              onToggleCustomIntervals={handleToggleCustomIntervals}
              customDurations={customDurations}
              onCustomDurationChange={handleCustomDurationChange}
              onResetCustomToUniform={handleResetCustomToUniform}
            />
          </div>
        ) : (
          <ActiveTimer
            status={timer.status}
            isPlaying={timer.isPlaying}
            isCompleted={timer.isCompleted}
            currentInterval={timer.currentInterval}
            totalIntervals={timer.totalIntervals}
            minutesPerInterval={timer.minutesPerInterval}
            formattedTime={timer.formattedTime}
            intervalProgress={timer.intervalProgress}
            isWakeLockActive={timer.isWakeLockActive}
            isBellRinging={timer.isBellRinging}
            hideDigits={hideDigits}
            completedSessionsCount={completedSessionsCount}
            onToggleHideDigits={() => setHideDigits((prev) => !prev)}
            onTogglePlay={timer.togglePlay}
            onReset={timer.resetTimer}
            onOpenSettings={() => setViewMode('config')}
            onSeekInterval={timer.seekToInterval}
            onSeekProgress={timer.seekIntervalProgress}
            onTriggerBellPulse={timer.triggerBellPulse}
          />
        )}
      </main>

      <footer className="zen-footer zen-secondary-dim">
        <p>Distraction-free interval bell with drift-free Web Audio timing and Screen Wake Lock.</p>
      </footer>
    </div>
  );
}
