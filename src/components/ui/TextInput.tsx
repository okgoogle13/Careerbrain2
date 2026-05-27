import React, { useState } from "react";
import { motion } from "motion/react";
import { M3Type } from "../../theme/typography";

type Props = {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
};

export function TextInput({ label, placeholder, value, onChange, onFocus, onBlur, onKeyDown, type = "text" }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className="relative pt-6">
      <motion.label 
        initial={false}
        animate={{
          y: isFloating ? -28 : 16,
          scale: isFloating ? 0.85 : 1,
          color: isFocused ? 'var(--sys-color-solidarityRed-base)' : 'var(--sys-color-worker-ash-base)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute left-4 origin-top-left font-bold pointer-events-none z-10"
      >
        {label}
      </motion.label>
      <motion.input
        type={type}
        whileFocus={{ scale: 1.01, x: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        placeholder={isFocused ? placeholder : ""}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onKeyDown={onKeyDown}
        className={`w-full p-4 border-2 focus:outline-none focus:shadow-[var(--sys-shadow-elevation2Placard)] text-[var(--sys-color-paperWhite-base)] transition-colors ${isFocused ? 'border-[var(--sys-color-solidarityRed-base)]' : 'border-[var(--sys-color-outline-variant)]'}`}
        style={{ 
          ...M3Type.bodyLarge,
          borderRadius: 'var(--sys-shape-blockRiot01)',
          background: 'var(--sys-color-charcoalBackground-steps-0)',
        }}
      />
    </div>
  );
}
