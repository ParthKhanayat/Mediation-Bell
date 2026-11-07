import React from 'react';
import StarSparkle from './StarSparkle';

/**
 * CircularProgress - Luminous Iridescent Orb + Sacred Geometry Centerpiece
 * Seamlessly integrates:
 * - Sacred geometry elliptical SVG rings & star sparkle (Image 1 Inspiration)
 * - 3D pearlescent iridescent glowing orb (Image 2 Inspiration)
 * - Sleek outer orbit progress arc with harmonic audio pulse (Image 2 Inspiration)
 */
export default function CircularProgress({
  progress = 0.75, // 0 to 1 (1 = full, 0 = depleted)
  isBellRinging = false,
  isPlaying = false,
  children,
}) {
  const size = 320;
  const strokeWidth = 2; // Delicate 2px stroke per specification
  const center = size / 2; // 160
  const radius = 142; // Orbit path radius
  const circumference = 2 * Math.PI * radius;

  // Clamped progress (0 to 1)
  const clampedProgress = Math.max(0, Math.min(1, progress));
  // Depletes smoothly: at 1, offset = 0; at 0, offset = circumference
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <div
      className={`zen-dial-wrapper ${isBellRinging ? 'zen-dial-bell-ringing' : ''} ${
        isPlaying ? 'zen-dial-running' : ''
      }`}
    >
      {/* Outer Ethereal Radial Ambient Glow (Soft, diffused white/rose outer glow) */}
      <div
        className={`zen-centerpiece-aura ${isBellRinging ? 'flare' : ''} ${
          isPlaying ? 'breathing' : ''
        }`}
        aria-hidden="true"
      />

      {/* Sacred Geometry Elliptical SVG Rings (Extended gently beyond the 116px radius sphere) */}
      <div
        className={`zen-sacred-rings-wrap ${isPlaying ? 'rotating' : ''} ${
          isBellRinging ? 'ringing' : ''
        }`}
        aria-hidden="true"
      >
        <svg
          className="zen-sacred-rings-svg"
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
        >
          <g transform={`translate(${center}, ${center})`}>
            {/* Overlapping sacred ellipses with delicate semi-transparent white strokes */}
            <ellipse rx="148" ry="102" className="zen-sacred-ellipse ellipse-1" />
            <ellipse rx="148" ry="102" className="zen-sacred-ellipse ellipse-2" transform="rotate(45)" />
            <ellipse rx="148" ry="102" className="zen-sacred-ellipse ellipse-3" transform="rotate(90)" />
            <ellipse rx="148" ry="102" className="zen-sacred-ellipse ellipse-4" transform="rotate(135)" />
          </g>
        </svg>

        {/* Delicate celestial 4-point star sparkle accent */}
        <div className="zen-sacred-star-accent" aria-hidden="true">
          <StarSparkle size={15} />
        </div>
      </div>

      {/* 3D Iridescent Pearlescent Glowing Orb */}
      <div
        className={`zen-iridescent-orb ${isBellRinging ? 'orb-flare' : ''} ${
          isPlaying ? 'orb-breathing' : ''
        }`}
        aria-hidden="true"
      >
        <div className="zen-orb-inner-light" />
        <div className="zen-orb-specular-sheen" />
        <div className="zen-orb-cyan-glow" />
        <div className="zen-orb-magenta-core" />
      </div>

      {/* SVG Orbit Progress Arc & Chime Waves */}
      <svg
        className={`zen-svg-ring ${isBellRinging ? 'ring-pulsing' : ''}`}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <defs>
          {/* Muted Plum to Dusty Rose and Antique Bronze organic gradient */}
          <linearGradient id="zenAuraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#70536B" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#9D6B84" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A58B68" stopOpacity="0.8" />
          </linearGradient>

          {/* Antique Bronze to Dusty Rose harmonic flare gradient when bell chimes */}
          <linearGradient id="zenBellPulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A58B68" />
            <stop offset="50%" stopColor="#9D6B84" />
            <stop offset="100%" stopColor="#70536B" />
          </linearGradient>
        </defs>

        {/* Outer Acoustic Chime Sound Wave (triggers when bell rings) */}
        {isBellRinging && (
          <>
            <circle
              className="zen-chime-soundwave wave-1"
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#zenBellPulseGradient)"
            />
            <circle
              className="zen-chime-soundwave wave-2"
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#zenBellPulseGradient)"
            />
          </>
        )}

        {/* Ambient subtle track ring */}
        <circle
          className="zen-ring-track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={1.5}
        />

        {/* Sleek, delicate countdown progress arc */}
        <circle
          className={`zen-ring-progress ${isBellRinging ? 'ringing' : ''}`}
          cx={center}
          cy={center}
          r={radius}
          stroke={isBellRinging ? 'url(#zenBellPulseGradient)' : 'url(#zenAuraGradient)'}
          strokeWidth={isBellRinging ? 3 : strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Central Content (Countdown digits & status labels inside the luminous orb) */}
      <div className="zen-dial-content">{children}</div>
    </div>
  );
}
