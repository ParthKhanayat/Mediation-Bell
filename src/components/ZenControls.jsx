import React from 'react';
import { Play, Pause, RotateCcw, Sliders } from 'lucide-react';

export default function ZenControls({
  isPlaying,
  onTogglePlay,
  onReset,
  onOpenSettings,
}) {
  return (
    <div className="zen-controls-bar" role="toolbar" aria-label="Timer controls">
      {onOpenSettings && (
        <button
          type="button"
          className="zen-control-btn zen-btn-secondary"
          onClick={onOpenSettings}
          aria-label="Adjust session settings"
          title="Session Settings"
        >
          <Sliders strokeWidth={1.8} />
        </button>
      )}

      <button
        type="button"
        className="zen-control-btn zen-btn-primary"
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause meditation timer' : 'Play meditation timer'}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause strokeWidth={2.2} />
        ) : (
          <Play strokeWidth={2.2} fill="currentColor" style={{ marginLeft: '3px' }} />
        )}
      </button>

      <button
        type="button"
        className="zen-control-btn zen-btn-secondary"
        onClick={onReset}
        aria-label="Reset interval timer"
        title="Reset Timer"
      >
        <RotateCcw strokeWidth={1.8} />
      </button>
    </div>
  );
}

