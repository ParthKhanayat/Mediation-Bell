import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IntervalConfig from './components/IntervalConfig';
import ActiveTimer from './components/ActiveTimer';
import { Sliders, Timer, Columns } from 'lucide-react';
import { playBell, unlockAudio, AUDIO_CONFIG } from './services/zenAudio';

export default function App() {
  // Session Configuration State
  const [intervals, setIntervals] = useState(4);
  const [minutes, setMinutes] = useState(5);

  // Sound Synthesizer Options
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [doubleStrike, setDoubleStrike] = useState(true);

  // Active Timer Mocked State
  const [currentInterval, setCurrentInterval] = useState(2);
  const [mockSecondsRemaining, setMockSecondsRemaining] = useState(225); // 03:45 remaining
  const [isPlaying, setIsPlaying] = useState(false);

  // View state: 'config', 'timer', or 'both' (desktop dual-view)
  const [viewMode, setViewMode] = useState('both');

  // Sync sound settings to AUDIO_CONFIG singleton
  useEffect(() => {
    AUDIO_CONFIG.soundEnabled = soundEnabled;
    AUDIO_CONFIG.finalBell.doubleStrike = doubleStrike;
  }, [soundEnabled, doubleStrike]);

  // Keep mock seconds in sync if user changes minutes per interval
  useEffect(() => {
    const totalSec = minutes * 60;
    // Default to ~75% elapsed mock state (e.g. 3m 45s for 5m)
    setMockSecondsRemaining(Math.round(totalSec * 0.75));
  }, [minutes]);

  // Ensure currentInterval doesn't exceed total intervals
  useEffect(() => {
    if (currentInterval > intervals) {
      setCurrentInterval(intervals);
    }
  }, [intervals, currentInterval]);

  // Simulated tick when mock playing is active, playing bells on interval boundaries
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setMockSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Check if this was the final interval or an intermediate interval
            if (currentInterval >= intervals) {
              // Final Session Bell: Deep Singing Bowl
              playBell('final');
              setCurrentInterval(1);
              setIsPlaying(false);
              return minutes * 60;
            } else {
              // Interval Bell: Gentle 528Hz Chime
              playBell('interval');
              setCurrentInterval((curr) => curr + 1);
              return minutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, intervals, minutes, currentInterval]);

  const handleTogglePlay = async () => {
    await unlockAudio();
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setMockSecondsRemaining(minutes * 60);
    setCurrentInterval(1);
  };

  const handleStartSession = async () => {
    await unlockAudio();
    setIsPlaying(true);
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
          <span>Active Timer</span>
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
              onIntervalsChange={setIntervals}
              onMinutesChange={setMinutes}
              onStartSession={handleStartSession}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled((prev) => !prev)}
              doubleStrike={doubleStrike}
              onToggleDoubleStrike={() => setDoubleStrike((prev) => !prev)}
            />

            <ActiveTimer
              currentInterval={currentInterval}
              totalIntervals={intervals}
              minutesPerInterval={minutes}
              mockSecondsRemaining={mockSecondsRemaining}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={handleReset}
              onOpenSettings={() => setViewMode('config')}
              onMockIntervalChange={setCurrentInterval}
              onMockSecondsChange={setMockSecondsRemaining}
            />
          </div>
        ) : viewMode === 'config' ? (
          <IntervalConfig
            intervals={intervals}
            minutes={minutes}
            onIntervalsChange={setIntervals}
            onMinutesChange={setMinutes}
            onStartSession={handleStartSession}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            doubleStrike={doubleStrike}
            onToggleDoubleStrike={() => setDoubleStrike((prev) => !prev)}
          />
        ) : (
          <ActiveTimer
            currentInterval={currentInterval}
            totalIntervals={intervals}
            minutesPerInterval={minutes}
            mockSecondsRemaining={mockSecondsRemaining}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
            onOpenSettings={() => setViewMode('config')}
            onMockIntervalChange={setCurrentInterval}
            onMockSecondsChange={setMockSecondsRemaining}
          />
        )}
      </main>

      <footer className="zen-footer">
        <p>Distraction-free interval bell with pure Web Audio harmonic synthesis.</p>
      </footer>
    </div>
  );
}
