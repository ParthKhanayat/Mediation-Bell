import React from 'react';

/**
 * CircularProgress - Luminous Iridescent Orb + Sacred Geometry Centerpiece
 * Seamlessly integrates:
 * - Sacred geometry elliptical SVG rings
 * - 3D pearlescent iridescent glowing orb
 * - Sleek outer orbit progress arc with harmonic audio pulse
 */
export default function CircularProgress({
  progress = 0.75, // 0 to 1 (1 = full, 0 = depleted)
  isBellRinging = false,
  isPlaying = false,
  children,
}) {
  const size = 320;
  const strokeWidth = 1.8; // Thin 1.5px–2px per specification
  const center = size / 2; // 160
  // Orb radius is 116px (232px diameter). Radius 119px aligns concentrically with a 3px gap.
  const radius = 119;
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
      {/* Outer Ethereal Radial Ambient Glow (Soft, diffused warm-white outer glow) */}
      <div
        className={`zen-centerpiece-aura ${isBellRinging ? 'flare' : ''} ${
          isPlaying ? 'breathing' : ''
        }`}
        aria-hidden="true"
      />

      {/* Sacred Geometry Lotus Petal Rings (Positioned around the orb/ring without intersecting progress arc) */}
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
          <defs>
            {/* Luminous organic bronze to rose petal gradient for the lotus blossom */}
            <linearGradient id="zenLotusPetalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A58B68" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#9D6B84" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#70536B" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <g transform={`translate(${center}, ${center})`}>
            {/* Overlapping sacred ellipses sized (rx=150, ry=124) so they stay entirely outside the 119px progress ring */}
            <ellipse rx="150" ry="124" className="zen-sacred-ellipse ellipse-1" />
            <ellipse rx="150" ry="124" className="zen-sacred-ellipse ellipse-2" transform="rotate(45)" />
            <ellipse rx="150" ry="124" className="zen-sacred-ellipse ellipse-3" transform="rotate(90)" />
            <ellipse rx="150" ry="124" className="zen-sacred-ellipse ellipse-4" transform="rotate(135)" />
          </g>
        </svg>
      </div>

      {/* 3D Iridescent Pearlescent Glowing Orb (Central visual element) */}
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

      {/* SVG Countdown Progress Arc (Stationary orientation; sits precisely along the perimeter of the inner orb) */}
      <svg
        className={`zen-svg-ring ${isBellRinging ? 'ring-pulsing' : ''}`}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <defs>
          {/* Antique Bronze to Dusty Rose harmonic flare gradient when bell chimes */}
          <linearGradient id="zenBellPulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A58B68" />
            <stop offset="50%" stopColor="#9D6B84" />
            <stop offset="100%" stopColor="#70536B" />
          </linearGradient>
        </defs>

        {/* Outer Acoustic Chime Sound Wave Pulse - ONLY triggers when bell rings on interval completion */}
        {isBellRinging && (
          <g className="zen-chime-soundwaves-layer">
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
          </g>
        )}

        {/* Inactive Track: Extremely subtle rgba(112, 83, 107, 0.12) */}
        <circle
          className="zen-ring-track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={1.5}
        />

        {/* Active Countdown Progress Arc: Saffron-gold #C28A3A with subtle glow */}
        <circle
          className={`zen-ring-progress ${isBellRinging ? 'ringing' : ''}`}
          cx={center}
          cy={center}
          r={radius}
          stroke="#C28A3A"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Central Content (Countdown digits & status labels inside the luminous orb) */}
      <div className="zen-dial-content">{children}</div>
    </div>
  );
}
