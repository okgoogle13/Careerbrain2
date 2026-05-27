import React from "react";
import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  style?: React.CSSProperties;
};

export function Card({ children, className = "", hoverEffect = false, style = {} }: Props) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, shadow: 'var(--sys-shadow-elevation2Placard)' } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`p-6 border border-[var(--sys-color-outline-variant)] shadow-sm relative overflow-hidden ${className}`}
      style={{ 
        borderRadius: '16px',
        background: 'var(--sys-color-charcoalBackground-steps-2)', // surface+1
        ...style
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
