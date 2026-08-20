import React from 'react';

export function ProgressRing({ radius = 24, stroke = 3, progress = 0 }) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring-wrapper">
      <svg height={radius * 2} width={radius * 2} className="progress-ring-svg">
        <circle
          stroke="var(--bg-subtle)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="var(--accent-primary)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="progress-ring-circle"
        />
      </svg>
      <span className="progress-ring-text">{Math.round(progress)}%</span>
    </div>
  );
}
