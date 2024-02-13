import React from "react";

type ProgressRingProps = {
  radius: number;
  stroke: number;
  progress: number;
};

export const ProgressRing = ({
  radius,
  stroke,
  progress,
}: ProgressRingProps) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="#22c55e"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          stroke-width={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute text-xs">{progress}%</div>
    </div>
  );
};
