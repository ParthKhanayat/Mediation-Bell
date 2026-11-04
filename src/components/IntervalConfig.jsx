import React from 'react';
import { Clock, Play } from 'lucide-react';
import Stepper from './Stepper';
import PresetPills from './PresetPills';
import SoundSettings from './SoundSettings';
import { unlockAudio } from '../services/zenAudio';

export default function IntervalConfig({
  intervals,
  minutes,
  onIntervalsChange,
  onMinutesChange,
  onStartSession,
  soundEnabled,
  onToggleSound,
  doubleStrike,
  onToggleDoubleStrike,
}) {
  const totalMinutes = intervals * minutes;

  const handleBeginClick = async () => {
    // Crucial for iOS Safari & Android Chrome: unlock AudioContext during tap gesture
    await unlockAudio();
    if (onStartSession) {
      onStartSession();
    }
  };

  return (
    <section className="zen-card" aria-labelledby="config-heading">
      <div className="zen-card-header">
        <h2 id="config-heading" className="zen-card-title">
          Session Configuration
        </h2>
        <p className="zen-card-description">
          Set intervals and sound acoustics for your mindful practice
        </p>
      </div>

      <div className="config-group">
        <Stepper
          id="num-intervals"
          label="Number of Intervals"
          hint="Total chime intervals in this sit"
          value={intervals}
          min={1}
          max={30}
          step={1}
          unit="intervals"
          onChange={onIntervalsChange}
        />

        <Stepper
          id="min-per-interval"
          label="Minutes per Interval"
          hint="Duration of each meditation interval"
          value={minutes}
          min={1}
          max={120}
          step={1}
          unit="min"
          onChange={onMinutesChange}
        />
      </div>

      {/* Live Calculated Display */}
      <div
        className="zen-duration-banner"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="zen-duration-meta">
          <div className="zen-duration-icon" aria-hidden="true">
            <Clock size={18} strokeWidth={2} />
          </div>
          <div>
            <div className="zen-duration-title">Total Session Duration</div>
            <div className="zen-duration-formula">
              {intervals} × {minutes} min
            </div>
          </div>
        </div>

        <div className="zen-duration-highlight">
          {totalMinutes} {totalMinutes === 1 ? 'minute' : 'minutes'} total
        </div>
      </div>

      {/* Quick Select Presets */}
      <PresetPills
        currentIntervals={intervals}
        currentMinutes={minutes}
        onSelectPreset={(i, m) => {
          onIntervalsChange(i);
          onMinutesChange(m);
        }}
      />

      {/* Dedicated Meditation Sound Synthesizer & Testing Module */}
      <SoundSettings
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        doubleStrike={doubleStrike}
        onToggleDoubleStrike={onToggleDoubleStrike}
      />

      <button
        type="button"
        className="zen-start-session-btn"
        onClick={handleBeginClick}
        aria-label="Begin meditation and view active timer"
      >
        <Play size={18} fill="currentColor" />
        <span>Begin Meditation</span>
      </button>
    </section>
  );
}
