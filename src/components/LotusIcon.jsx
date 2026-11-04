import React from 'react';

/**
 * LotusIcon - Serene meditation lotus blossom icon
 * Designed with standard 24x24 viewBox and Lucide stroke conventions.
 */
export default function LotusIcon({
  size = 20,
  strokeWidth = 1.75,
  className = '',
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`zen-lotus-icon ${className}`.trim()}
      aria-hidden="true"
      {...props}
    >
      {/* Central upright bud/petal */}
      <path d="M12 3c-2.4 4.5-2.4 9 0 13c2.4-4 2.4-8.5 0-13z" />
      {/* Left upper petal */}
      <path d="M12 16c-3.5 0-7-2-8-6.5c3-1 6.5 0.5 8 6.5z" />
      {/* Right upper petal */}
      <path d="M12 16c3.5 0 7-2 8-6.5c-3-1-6.5 0.5-8 6.5z" />
      {/* Left lower opening petal */}
      <path d="M4 11.5c-1.5 2 0 4.5 3 4.5c2 0 3.5-0.8 5-2" />
      {/* Right lower opening petal */}
      <path d="M20 11.5c1.5 2 0 4.5-3 4.5c-2 0-3.5-0.8-5-2" />
      {/* Serene base water/rippling pad */}
      <path d="M8.5 19.5c2 1.2 5 1.2 7 0" />
    </svg>
  );
}
