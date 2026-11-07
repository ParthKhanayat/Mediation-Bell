import React from 'react';

/**
 * StarSparkle - 4-pointed celestial star sparkle inspired by Image 1
 */
export default function StarSparkle({ size = 16, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`zen-star-sparkle ${className}`.trim()}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 0C12 7.2 16.8 12 24 12C16.8 12 12 16.8 12 24C12 16.8 7.2 12 0 12C7.2 12 12 7.2 12 0Z" />
    </svg>
  );
}
