/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React from "react";
import { motion } from "motion/react";
import { M3Button } from "../ui/M3Button";
import { M3Card } from "../ui/M3Card";
import { M3Type } from "../../theme/typography";

export function SaveApplicationBar() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
      className="mt-12"
    >
      <M3Card variant="elevated" className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h4 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>Ready to submit?</h4>
          <p style={{ ...M3Type.bodyMedium, color: 'var(--sys-color-worker-ash-base)' }} className="mt-2">Save this application to your history to track its progress.</p>
        </div>
        <div className="flex gap-4">
          <M3Button onClick={() => {}} variant="outlined">Export PDF</M3Button>
          <M3Button onClick={() => {}} variant="filled">Save to tracker</M3Button>
        </div>
      </M3Card>
    </motion.div>
  );
}
