import React from 'react';
import { motion } from 'framer-motion';
import { User, Zap, Sparkles, FileText } from 'lucide-react';
import { useUserStore } from '../hooks/useUserStore';

export function OnboardingPathBifurcation() {
  const { setOnboardingPath, setHasCompletedOnboarding } = useUserStore();

  const handleSelectPath = (path: 'PROFILE' | 'QUICK_APPLY') => {
    setOnboardingPath(path);
    setHasCompletedOnboarding(true);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
      style={{ background: 'var(--sys-color-charcoalBackground-base)' }}
    >
      {/* Grit Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      <div className="max-w-4xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] mb-4">
            Choose your <span className="text-[var(--sys-color-solidarityRed-base)]">path</span>
          </h1>
          <p className="text-xl type-melancholyLonging text-[var(--sys-color-worker-ash-base)]">
            How do you want to start your asymmetric journey?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Path 1: Induction & Ingestion */}
          <motion.button
            whileHover={{ scale: 1.02, rotate: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectPath('PROFILE')}
            className="group p-8 bg-[var(--sys-color-charcoalBackground-steps-2)] border-2 border-[var(--sys-color-outline-variant)] hover:border-[var(--sys-color-solidarityRed-base)] transition-all text-left relative overflow-hidden"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <User size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[var(--sys-color-solidarityRed-base)] rounded-full flex items-center justify-center mb-6">
                <FileText size={24} className="text-[var(--sys-color-paperWhite-base)]" />
              </div>
              <h2 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight mb-4">
                Master resume <br/>profile
              </h2>
              <p className="text-[var(--sys-color-worker-ash-base)] mb-8">
                Build your foundation. Upload your resume, cover letters, and documents to create a vectorized Master Resume Profile for maximum AI precision.
              </p>
              <div className="flex items-center gap-2 text-[var(--sys-color-solidarityRed-base)] font-bold text-sm">
                <span>Start setup</span>
                <Zap size={16} />
              </div>
            </div>
          </motion.button>

          {/* Path 2: Quick Application */}
          <motion.button
            whileHover={{ scale: 1.02, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectPath('QUICK_APPLY')}
            className="group p-8 bg-[var(--sys-color-charcoalBackground-steps-2)] border-2 border-[var(--sys-color-outline-variant)] hover:border-[var(--sys-color-inkGold-base)] transition-all text-left relative overflow-hidden"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[var(--sys-color-inkGold-base)] rounded-full flex items-center justify-center mb-6">
                <Zap size={24} className="text-[var(--sys-color-charcoalBackground-base)]" />
              </div>
              <h2 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight mb-4">
                Quick <br/>application
              </h2>
              <p className="text-[var(--sys-color-worker-ash-base)] mb-8">
                No time to waste. Jump straight into a job analysis and generate tailored documents in seconds.
              </p>
              <div className="flex items-center gap-2 text-[var(--sys-color-inkGold-base)] font-bold text-sm">
                <span>Jump in</span>
                <Sparkles size={16} />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
