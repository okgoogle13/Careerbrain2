import React from "react";
import { motion } from "motion/react";
import { M3Type } from "../../theme/typography";

type Props = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="mb-8 border-b border-[var(--sys-color-outline-variant)] pb-4"
    >
      <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>
        {title}
      </h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ ...M3Type.bodyLarge, color: 'var(--sys-color-worker-ash-base)' }}
          className="mt-4"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
