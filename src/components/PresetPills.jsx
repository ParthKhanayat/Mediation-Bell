import React from 'react';

const PRESETS = [
  { intervals: 4, minutes: 5, label: '4 × 5m', note: '20 min session' },
  { intervals: 3, minutes: 10, label: '3 × 10m', note: '30 min session' },
  { intervals: 6, minutes: 5, label: '6 × 5m', note: '30 min session' },
  { intervals: 2, minutes: 15, label: '2 × 15m', note: '30 min session' },
  { intervals: 1, minutes: 20, label: '1 × 20m', note: '20 min session' },
  { intervals: 4, minutes: 15, label: '4 × 15m', note: '60 min session' },
];

export default function PresetPills({
  currentIntervals,
  currentMinutes,
  onSelectPreset,
}) {
  return (
    <div className="presets-section">
      <span className="presets-label">Quick Select Presets</span>
      <div className="preset-pills-grid" role="group" aria-label="Meditation session presets">
        {PRESETS.map((preset) => {
          const isActive =
            currentIntervals === preset.intervals &&
            currentMinutes === preset.minutes;

          return (
            <button
              key={`${preset.intervals}-${preset.minutes}`}
              type="button"
              className={`zen-preset-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectPreset(preset.intervals, preset.minutes)}
              aria-pressed={isActive}
            >
              <span className="preset-pill-title">{preset.label}</span>
              <span className="preset-pill-desc">{preset.note}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
