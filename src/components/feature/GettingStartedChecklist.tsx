import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, X, FileText, User, Link, Chrome } from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Type } from '../../theme/typography';

interface ChecklistItem {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  completed: boolean;
}

export function GettingStartedChecklist() {
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 'resume', label: 'Upload master resume', desc: 'Unlock ATS scoring and AI tailoring.', icon: <FileText size={16} />, completed: false },
    { id: 'profile', label: 'Complete identity', desc: 'Ensure your contact info is accurate.', icon: <User size={16} />, completed: true },
    { id: 'integrations', label: 'Connect integrations', desc: 'Sync Gmail and LinkedIn data.', icon: <Link size={16} />, completed: false },
    { id: 'extension', label: 'Install extension', desc: 'Clip jobs directly from job boards.', icon: <Chrome size={16} />, completed: false },
  ]);

  if (!isVisible) return null;

  const progress = (items.filter(i => i.completed).length / items.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mb-8"
      >
        <M3Card variant="outlined" className="p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] border-2 border-[var(--sys-color-solidarityRed-base)]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button 
              onClick={() => setIsVisible(false)}
              className="text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h3 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }} className="mb-2">
                Getting <span className="text-[var(--sys-color-solidarityRed-base)]">started</span>
              </h3>
              <p style={{ ...M3Type.bodyMedium, color: 'var(--sys-color-worker-ash-base)' }} className="mb-6">
                Complete these steps to unlock the full asymmetric power of CareerCopilot.
              </p>

              <div className="w-full bg-[var(--sys-color-charcoalBackground-steps-3)] h-2 rounded-full mb-8 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-[var(--sys-color-solidarityRed-base)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      item.completed 
                        ? 'bg-[var(--sys-color-solidarityRed-base)]/5 border-[var(--sys-color-solidarityRed-base)]/20' 
                        : 'bg-[var(--sys-color-charcoalBackground-steps-3)] border-transparent'
                    }`}
                  >
                    <div className={item.completed ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-worker-ash-base)]'}>
                      {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                    <div>
                      <h4 
                        style={{ 
                          ...M3Type.titleSmall, 
                          color: item.completed ? '#888' : 'var(--sys-color-paperWhite-base)',
                          textDecoration: item.completed ? 'line-through' : 'none'
                        }}
                      >
                        {item.label}
                      </h4>
                      <p 
                        style={{ 
                          ...M3Type.labelMedium, 
                          color: item.completed ? '#888' : 'var(--sys-color-worker-ash-base)',
                          textDecoration: item.completed ? 'line-through' : 'none'
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block w-48 h-48 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-2xl border border-[var(--sys-color-outline-variant)] p-4 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[var(--sys-color-solidarityRed-base)]/10 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} className="text-[var(--sys-color-solidarityRed-base)]" />
              </div>
              <p className="text-[10px] font-bold text-[var(--sys-color-paperWhite-base)] mb-2">Asymmetric advantage</p>
              <p className="text-[8px] text-[var(--sys-color-worker-ash-base)]">Upload your resume to unlock 4-quadrant analysis.</p>
            </div>
          </div>
        </M3Card>
      </motion.div>
    </AnimatePresence>
  );
}
