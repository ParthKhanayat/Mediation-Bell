import React from 'react';
import { Clock, Play, SlidersHorizontal, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
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
  // Custom individual interval durations
  isCustomIntervals = false,
  onToggleCustomIntervals,
  customDurations = [],
  onCustomDurationChange,
  onResetCustomToUniform,
}) {
  const totalMinutes = isCustomIntervals
    ? customDurations.reduce((acc, d) => acc + (parseInt(d, 10) || 0), 0)
    : intervals * minutes;

  const durationFormula = isCustomIntervals
    ? intervals <= 5
      ? `${customDurations.join(' + ')} min`
      : `${intervals} custom intervals (${customDurations.slice(0, 3).join(', ')}... min)`
    : `${intervals} × ${minutes} min`;

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
          hint="Default duration for intervals"
          value={minutes}
          min={1}
          max={120}
          step={1}
          unit="min"
          onChange={onMinutesChange}
        />
      </div>

      {/* Button to show controls for changing the duration of each interval individually */}
      <div className="zen-custom-toggle-container">
        <button
          type="button"
          className={`zen-custom-toggle-btn ${isCustomIntervals ? 'active' : ''}`}
          onClick={onToggleCustomIntervals}
          aria-expanded={isCustomIntervals}
        >
          <div className="zen-custom-toggle-label">
            <SlidersHorizontal size={14} />
            <span>
              {isCustomIntervals
                ? 'Custom Interval Durations (Active)'
                : 'Customize Each Interval Individually'}
            </span>
          </div>
          {isCustomIntervals ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Individual Interval Duration Controls */}
      {isCustomIntervals && (
        <div className="zen-custom-intervals-drawer">
          <div className="zen-custom-intervals-header">
            <span className="zen-custom-intervals-heading">Individual Durations</span>
            {onResetCustomToUniform && (
              <button
                type="button"
                className="zen-custom-reset-link"
                onClick={onResetCustomToUniform}
                title={`Set all intervals to ${minutes} min`}
              >
                Reset to {minutes}m each
              </button>
            )}
          </div>

          <div className="zen-custom-intervals-grid">
            {customDurations.map((dur, idx) => (
              <div key={idx} className="zen-custom-interval-item">
                <div className="zen-custom-item-label">
                  <span className="zen-custom-item-dot" />
                  <span>Interval {idx + 1}</span>
                </div>

                <div className="zen-stepper zen-stepper-compact">
                  <button
                    type="button"
                    className="zen-stepper-btn zen-stepper-btn-compact"
                    onClick={() => onCustomDurationChange(idx, Math.max(1, dur - 1))}
                    disabled={dur <= 1}
                    aria-label={`Decrease Interval ${idx + 1} duration`}
                  >
                    <Minus size={14} strokeWidth={2} />
                  </button>

                  <div className="zen-stepper-value-container">
                    <span className="zen-stepper-input zen-stepper-val-static">{dur}</span>
                    <span className="zen-stepper-unit">min</span>
                  </div>

                  <button
                    type="button"
                    className="zen-stepper-btn zen-stepper-btn-compact"
                    onClick={() => onCustomDurationChange(idx, Math.min(120, dur + 1))}
                    disabled={dur >= 120}
                    aria-label={`Increase Interval ${idx + 1} duration`}
                  >
                    <Plus size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              {durationFormula}
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
