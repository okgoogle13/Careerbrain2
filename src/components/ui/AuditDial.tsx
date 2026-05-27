import React from 'react';
import { motion } from 'motion/react';

interface AuditDialProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export function AuditDial({ 
  score, 
  size = 80, 
  strokeWidth = 8, 
  color = 'var(--sys-color-inkGold-base)',
  label
}: AuditDialProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--sys-color-charcoalBackground-steps-3)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-[var(--sys-color-paperWhite-base)] leading-none">
          {Math.round(score)}
        </span>
        {label && (
          <span className="text-[8px] text-[var(--sys-color-worker-ash-base)] font-bold">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
