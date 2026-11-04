import React from 'react';

export default function CircularProgress({
  progress = 0.75, // 0 to 1 (1 = full, 0 = depleted)
  isBellRinging = false,
  children,
}) {
  const size = 280;
  const strokeWidth = 6;
  const center = size / 2;
  const radius = center - strokeWidth - 14; // ~120
  const circumference = 2 * Math.PI * radius;

  // Clamped progress (0 to 1)
  const clampedProgress = Math.max(0, Math.min(1, progress));
  // Depletes smoothly: at 1, offset = 0; at 0, offset = circumference
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <div className={`zen-dial-wrapper ${isBellRinging ? 'zen-dial-bell-ringing' : ''}`}>
      {/* Ethereal glowing radial centerpiece aura (echoes the 3D glowing orb in reference) */}
      <div
        className={`zen-centerpiece-aura ${isBellRinging ? 'flare' : ''}`}
        aria-hidden="true"
      />

      <svg
        className={`zen-svg-ring ${isBellRinging ? 'ring-pulsing' : ''}`}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <defs>
          {/* Luminous coral-peach to soft lavender gradient */}
          <linearGradient id="zenSageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA07A" />
            <stop offset="45%" stopColor="#FF6E40" />
            <stop offset="100%" stopColor="#E040FB" />
          </linearGradient>

          {/* Golden-coral flare gradient when bell chimes */}
          <linearGradient id="zenBellPulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB74D" />
            <stop offset="50%" stopColor="#FF7043" />
            <stop offset="100%" stopColor="#F06292" />
          </linearGradient>

          {/* Glow filter for resonant chime pulse */}
          <filter id="chimeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
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
          strokeWidth={strokeWidth}
        />

        {/* Depleting progress ring */}
        <circle
          className={`zen-ring-progress ${isBellRinging ? 'ringing' : ''}`}
          cx={center}
          cy={center}
          r={radius}
          stroke={isBellRinging ? 'url(#zenBellPulseGradient)' : 'url(#zenSageGradient)'}
          strokeWidth={isBellRinging ? strokeWidth + 2 : strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter={isBellRinging ? 'url(#chimeGlow)' : undefined}
        />
      </svg>

      {/* Central Content */}
      <div className="zen-dial-content">{children}</div>
    </div>
  );
}
