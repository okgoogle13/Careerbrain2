/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React from 'react';
import { motion } from 'framer-motion';
import type { ATSScoreResult, DocumentType } from '../types';
import { M3Card } from '../src/components/ui/M3Card';
import { M3Type } from '../src/theme/typography';

interface ATSScoreCardProps {
  score: ATSScoreResult | null;
  isCalculating: boolean;
  documentType: DocumentType;
}

export function ATSScoreCard({ score, isCalculating, documentType }: ATSScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (documentType === 'coverLetter') {
      if (value >= 90) return 'text-[var(--sys-color-kr-activistSmokeGreen-base)]';
      if (value >= 80) return 'text-[var(--sys-color-kr-activistSmokeGreen-base)]';
      if (value >= 70) return 'text-[var(--sys-color-stencilYellow-base)]';
      return 'text-[var(--sys-color-solidarityRed-base)]';
    }
    if (value >= 80) return 'text-[var(--sys-color-kr-activistSmokeGreen-base)]';
    if (value >= 60) return 'text-[var(--sys-color-stencilYellow-base)]';
    return 'text-[var(--sys-color-solidarityRed-base)]';
  };

  const getScoreBg = (value: number) => {
    if (documentType === 'coverLetter') {
      if (value >= 90) return 'var(--sys-color-kr-activistSmokeGreen-base)';
      if (value >= 80) return 'var(--sys-color-kr-activistSmokeGreen-base)';
      if (value >= 70) return 'var(--sys-color-stencilYellow-base)';
      return 'var(--sys-color-solidarityRed-base)';
    }
    if (value >= 80) return 'var(--sys-color-kr-activistSmokeGreen-base)';
    if (value >= 60) return 'var(--sys-color-stencilYellow-base)';
    return 'var(--sys-color-solidarityRed-base)';
  };

  return (
    <M3Card variant="elevated" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ ...M3Type.titleLarge, color: 'var(--sys-color-paperWhite-base)' }}>ATS Score ({documentType === 'resume' ? 'Resume' : 'Cover Letter'})</h3>
        {isCalculating && (
          <span style={{ ...M3Type.labelMedium, color: 'var(--sys-color-inkGold-base)' }} className="animate-pulse">Calculating...</span>
        )}
      </div>

      {score && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(score.breakdown)
              .filter(([_, value]) => value !== undefined)
              .map(([key, value]) => (
              <div 
                key={key} 
                className="p-4 rounded-2xl border transition-all hover:bg-white/5" 
                style={{ 
                  background: 'var(--sys-color-charcoalBackground-steps-2)', 
                  borderColor: 'var(--sys-color-outline-variant)',
                  borderWidth: 1 
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span style={{ ...M3Type.labelSmall, color: 'var(--sys-color-worker-ash-base)' }} className="uppercase font-bold tracking-widest text-[10px]">
                    {key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())}
                  </span>
                  <span style={{ ...M3Type.labelLarge, color: 'var(--sys-color-paperWhite-base)' }} className="font-black">
                    {value}%
                  </span>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden bg-black/20">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${value}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="h-full rounded-full" 
                     style={{ background: getScoreBg(Number(value)) }} 
                   />
                </div>
              </div>
            ))}
          </div>
          
          <div className="py-8 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: getScoreBg(score.overallScore) }} />
            </div>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--sys-color-charcoalBackground-steps-2)" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" 
                  className={`transition-all duration-1000 ease-out`}
                  style={{ stroke: getScoreBg(score.overallScore) }}
                  strokeWidth="8" 
                  strokeDasharray={`${score.overallScore * 2.827} 282.7`} 
                />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center`}>
                <span style={M3Type.headlineSmall} className={`text-3xl font-bold ${getScoreColor(score.overallScore)}`}>
                  {score.overallScore}
                </span>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <span style={M3Type.headlineSmall} className={`text-5xl font-black ${getScoreColor(score.overallScore)}`}>
                {score.overallScore}%
              </span>
              <p style={{ ...M3Type.bodyMedium, color: 'var(--sys-color-worker-ash-base)' }} className="mt-2 max-w-[280px] mx-auto text-xs leading-relaxed uppercase tracking-tighter opacity-60">
                Industry-standard ATS compliance scanner equivalent output
              </p>
            </div>
          </div>

          <p style={{ ...M3Type.bodyMedium, color: 'var(--sys-color-worker-ash-base)' }} className="text-center mt-4">
            {documentType === 'coverLetter' ? (
              <>
                {score.overallScore >= 90 && 'Excellent match! Highly competitive for recruiter review.'}
                {score.overallScore >= 80 && score.overallScore < 90 && 'Optimal match. Good chance of passing ATS.'}
                {score.overallScore >= 70 && score.overallScore < 80 && 'Acceptable match. Some optimization recommended.'}
                {score.overallScore < 70 && 'Failing match. High risk of automatic rejection.'}
              </>
            ) : (
              <>
                {score.overallScore >= 80 && 'Excellent match! Your document is highly optimized.'}
                {score.overallScore >= 60 && score.overallScore < 80 && 'Good match, but some optimization could help.'}
                {score.overallScore < 60 && 'Needs significant optimization to pass ATS filters.'}
              </>
            )}
          </p>
        </motion.div>
      )}
    </M3Card>
  );
}
