import React from "react";
import { motion } from "motion/react";

type Props = {
  label: string;
  onClick?: () => void;
  variant?: 'filled' | 'outlined' | 'tonal' | 'text' | 'strike' | 'march'; // Keep strike/march for backward compat
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
};

export function PrimaryButton({ label, onClick, variant = 'filled', disabled, className = "", icon }: Props) {
  const baseClasses = "relative inline-flex items-center justify-center px-6 h-10 font-medium text-sm transition-all overflow-hidden group disabled:opacity-38 disabled:cursor-not-allowed gap-2";
  
  let variantClasses = "";
  let style: React.CSSProperties = { borderRadius: '9999px' };

  // Map old variants to M3
  const effectiveVariant = variant === 'strike' ? 'filled' : variant === 'march' ? 'outlined' : variant;

  if (effectiveVariant === 'filled') {
    variantClasses = "bg-[var(--sys-color-solidarityRed-base)] text-white hover:shadow-md active:shadow-sm";
  } else if (effectiveVariant === 'outlined') {
    variantClasses = "border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] hover:bg-[var(--sys-color-paperWhite-base)]/5";
  } else if (effectiveVariant === 'tonal') {
    variantClasses = "bg-[var(--sys-color-charcoalBackground-steps-3)] text-[var(--sys-color-paperWhite-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-4)]";
  } else if (effectiveVariant === 'text') {
    variantClasses = "text-[var(--sys-color-paperWhite-base)] hover:bg-[var(--sys-color-paperWhite-base)]/5";
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={style}
    >
      {icon && <span className="relative z-10 shrink-0">{icon}</span>}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}
