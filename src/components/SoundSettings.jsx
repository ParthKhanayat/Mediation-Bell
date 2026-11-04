import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Bell,
  Disc,
  Play,
  Square,
  Sparkles,
  Music,
  Check,
} from 'lucide-react';
import {
  testBellSound,
  stopAllSounds,
  unlockAudio,
  AUDIO_CONFIG,
} from '../services/zenAudio';

export default function SoundSettings({
  soundEnabled,
  onToggleSound,
  doubleStrike,
  onToggleDoubleStrike,
}) {
  const [playingType, setPlayingType] = useState(null); // 'interval' | 'final' | null
  const [activeSource, setActiveSource] = useState('synth'); // 'synth' | 'custom'

  const handleTestSound = async (type) => {
    // 1. Mobile unlock
    await unlockAudio();

    // 2. Play test sound
    setPlayingType(type);

    const isDouble = type === 'final' ? doubleStrike : false;
    await testBellSound(type, {
      doubleStrike: isDouble,
      volume: 0.75,
    });

    const durationMs = type === 'final' ? (isDouble ? 6800 : 6000) : 2600;

    // Reset indicator after audio decay finishes
    setTimeout(() => {
      setPlayingType((curr) => (curr === type ? null : curr));
    }, durationMs);
  };

  const handleStop = () => {
    stopAllSounds();
    setPlayingType(null);
  };

  const handleSourceToggle = (source) => {
    setActiveSource(source);
    AUDIO_CONFIG.intervalBell.source = source;
    AUDIO_CONFIG.finalBell.source = source;
  };

  return (
    <div className="zen-sound-section">
      <div className="zen-sound-header">
        <div className="zen-sound-title-wrap">
          <div className="zen-sound-icon-badge" aria-hidden="true">
            <Volume2 size={16} />
          </div>
          <div>
            <h3 className="zen-sound-heading">Meditation Bells & Acoustics</h3>
            <p className="zen-sound-subheading">
              Pure Web Audio synthesis • No audio files required
            </p>
          </div>
        </div>

        {/* Master Sound Toggle */}
        <button
          type="button"
          className={`zen-sound-mute-toggle ${soundEnabled ? 'active' : 'muted'}`}
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Mute meditation bells' : 'Enable meditation bells'}
          title={soundEnabled ? 'Mute Bells' : 'Unmute Bells'}
        >
          {soundEnabled ? (
            <>
              <Volume2 size={16} />
              <span>Chimes On</span>
            </>
          ) : (
            <>
              <VolumeX size={16} />
              <span>Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Sound Cards Grid */}
      <div className="zen-sound-cards-grid">
        {/* Card 1: Interval Bell */}
        <div className={`zen-sound-card ${playingType === 'interval' ? 'is-playing' : ''}`}>
          <div className="zen-sound-card-top">
            <div className="zen-sound-card-info">
              <div className="zen-sound-card-icon" aria-hidden="true">
                <Bell size={18} />
              </div>
              <div>
                <span className="zen-sound-card-name">Interval Chime</span>
                <span className="zen-sound-card-specs">528 Hz Pure Sine • 2.5s decay</span>
              </div>
            </div>

            <button
              type="button"
              className={`zen-test-sound-btn ${playingType === 'interval' ? 'active' : ''}`}
              onClick={() =>
                playingType === 'interval' ? handleStop() : handleTestSound('interval')
              }
              disabled={!soundEnabled}
              aria-label="Test 528Hz Interval Chime"
            >
              {playingType === 'interval' ? (
                <>
                  <Square size={13} fill="currentColor" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play size={13} fill="currentColor" />
                  <span>Test Chime</span>
                </>
              )}
            </button>
          </div>

          <div className="zen-sound-card-desc">
            Soft mid-high strike with harmonic overtone, signaling interval transitions.
          </div>
        </div>

        {/* Card 2: Final Singing Bowl */}
        <div className={`zen-sound-card ${playingType === 'final' ? 'is-playing' : ''}`}>
          <div className="zen-sound-card-top">
            <div className="zen-sound-card-info">
              <div className="zen-sound-card-icon" aria-hidden="true">
                <Disc size={18} />
              </div>
              <div>
                <span className="zen-sound-card-name">Final Singing Bowl</span>
                <span className="zen-sound-card-specs">
                  256 Hz & 384 Hz Resonance • 6s decay
                </span>
              </div>
            </div>

            <button
              type="button"
              className={`zen-test-sound-btn ${playingType === 'final' ? 'active' : ''}`}
              onClick={() =>
                playingType === 'final' ? handleStop() : handleTestSound('final')
              }
              disabled={!soundEnabled}
              aria-label="Test Deep Singing Bowl"
            >
              {playingType === 'final' ? (
                <>
                  <Square size={13} fill="currentColor" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play size={13} fill="currentColor" />
                  <span>Test Bowl</span>
                </>
              )}
            </button>
          </div>

          <div className="zen-sound-card-desc">
            Deep Tibetan singing bowl resonance with layered fifths and detuned shimmer.
          </div>

          {/* Double-Strike Toggle */}
          <div className="zen-sound-card-option">
            <label className="zen-checkbox-label">
              <input
                type="checkbox"
                checked={doubleStrike}
                onChange={onToggleDoubleStrike}
                className="zen-checkbox"
              />
              <span className="zen-checkbox-custom">
                {doubleStrike && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="zen-checkbox-text">Gentle Double-Strike Resonance</span>
            </label>
          </div>
        </div>
      </div>

      {/* Audio Source Extensibility Note */}
      <div className="zen-audio-extensibility-note">
        <div className="zen-audio-source-switch">
          <span className="zen-source-label">Audio Engine:</span>
          <button
            type="button"
            className={`zen-source-pill ${activeSource === 'synth' ? 'active' : ''}`}
            onClick={() => handleSourceToggle('synth')}
          >
            <Sparkles size={12} />
            <span>Web Audio Synth</span>
          </button>
          <button
            type="button"
            className={`zen-source-pill ${activeSource === 'custom' ? 'active' : ''}`}
            onClick={() => handleSourceToggle('custom')}
            title="Swap in local .mp3 file paths"
          >
            <Music size={12} />
            <span>Custom MP3 Files</span>
          </button>
        </div>

        {activeSource === 'custom' && (
          <div className="zen-custom-audio-hint">
            Configured to load local audio from <code>/audio/interval-chime.mp3</code> &amp;{' '}
            <code>/audio/singing-bowl.mp3</code> (automatically falls back to Web Audio if files are absent).
          </div>
        )}
      </div>
    </div>
  );
}
