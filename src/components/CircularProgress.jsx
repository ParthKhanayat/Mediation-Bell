import React from 'react';

export default function CircularProgress({
  progress = 0.75, // 0 to 1 (1 = full, 0 = depleted)
  children,
}) {
  const size = 280;
  const strokeWidth = 5;
  const center = size / 2;
  const radius = center - strokeWidth - 10; // ~125
  const circumference = 2 * Math.PI * radius;

  // Clamped progress (0 to 1)
  const clampedProgress = Math.max(0, Math.min(1, progress));
  // Depletes smoothly: at 1, offset = 0; at 0, offset = circumference
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <div className="zen-dial-wrapper">
      <svg
        className="zen-svg-ring"
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="zenSageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9cb197" />
            <stop offset="100%" stopColor="#b8cbb4" />
          </linearGradient>
        </defs>

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
          className="zen-ring-progress"
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#zenSageGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Central Content */}
      <div className="zen-dial-content">{children}</div>
    </div>
  );
}
