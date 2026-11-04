import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IntervalConfig from './components/IntervalConfig';
import ActiveTimer from './components/ActiveTimer';
import { Sliders, Timer, Columns } from 'lucide-react';
import { AUDIO_CONFIG } from './services/zenAudio';
import { useIntervalTimer } from './hooks/useIntervalTimer';

export default function App() {
  // Session Configuration Parameters
  const [intervals, setIntervals] = useState(4);
  const [minutes, setMinutes] = useState(5);

  // Sound Synthesizer Options
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [doubleStrike, setDoubleStrike] = useState(true);

  // View state: 'config' | 'timer' | 'both'
  const [viewMode, setViewMode] = useState('both');

  // Synchronize master sound settings with audio singleton
  useEffect(() => {
    AUDIO_CONFIG.soundEnabled = soundEnabled;
    AUDIO_CONFIG.finalBell.doubleStrike = doubleStrike;
  }, [soundEnabled, doubleStrike]);

  // High-Precision Drift-Free Interval Timer Engine
  const timer = useIntervalTimer({
    intervals,
    minutes,
    soundEnabled,
    doubleStrike,
  });

  const handleStartSession = async () => {
    await timer.startTimer();
    setViewMode('timer');
  };

  return (
    <div className="zen-app-wrapper">
      <div className="zen-ambient-aura" aria-hidden="true" />

      <Header />

      {/* View Mode Switcher */}
      <nav className="zen-view-switcher" aria-label="Zen timer mode selector">
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
      <main className="zen-main-container">
        {viewMode === 'both' ? (
          <div className="zen-dual-layout">
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
            />

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
              onTogglePlay={timer.togglePlay}
              onReset={timer.resetTimer}
              onOpenSettings={() => setViewMode('config')}
              onSeekInterval={timer.seekToInterval}
              onSeekProgress={timer.seekIntervalProgress}
            />
          </div>
        ) : viewMode === 'config' ? (
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
          />
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
            onTogglePlay={timer.togglePlay}
            onReset={timer.resetTimer}
            onOpenSettings={() => setViewMode('config')}
            onSeekInterval={timer.seekToInterval}
            onSeekProgress={timer.seekIntervalProgress}
          />
        )}
      </main>

      <footer className="zen-footer">
        <p>Distraction-free interval bell with drift-free Web Audio timing and Screen Wake Lock.</p>
      </footer>
    </div>
  );
}
