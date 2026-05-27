/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component. Maps to /cover-letter-generator in canonical product.
 */
import React from 'react';
import { CoverLetterScoreResult } from '../types';
import { MetricCard } from '../src/components/ui/MetricCard';
import { M3Card } from '../src/components/ui/M3Card';
import { M3Type } from '../src/theme/typography';

interface CoverLetterSpecificMetricsProps {
  score: CoverLetterScoreResult;
  wordCount: number;
}

export function CoverLetterSpecificMetrics({ score, wordCount }: CoverLetterSpecificMetricsProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'var(--sys-color-kr-activistSmokeGreen-base)';
    if (value >= 60) return 'var(--sys-color-inkGold-base)';
    return 'var(--sys-color-solidarityRed-base)';
  };

  return (
    <M3Card variant="elevated" className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h4 style={{ ...M3Type.titleLarge, color: 'var(--sys-color-stencilYellow-base)' }} className="uppercase tracking-[0.2em] type-solidarityProtest">Cover Letter Analysis</h4>
        <div className="px-4 py-1.5 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] rounded-full">
          <span style={{ ...M3Type.labelMedium, color: 'var(--sys-color-worker-ash-base)' }} className="uppercase tracking-widest">
            {wordCount} Words
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          label="Keyword Placement"
          value={score.keywordPlacement}
          tooltip="Keywords found in the opening paragraph"
          color={getScoreColor(score.keywordPlacement)}
          desc="Opening paragraph impact"
        />
        
        <MetricCard
          label="Narrative Quality"
          value={score.narrativeQuality}
          tooltip="Story quality with specific examples and achievements"
          color={getScoreColor(score.narrativeQuality)}
          desc="STAR method alignment"
        />
        
        <MetricCard
          label="Personalization"
          value={score.personalizationScore}
          tooltip="Company-specific research and customization"
          color={getScoreColor(score.personalizationScore)}
          desc="Company research depth"
        />
        
        <MetricCard
          label="Professional Tone"
          value={score.toneProfessionalism}
          tooltip="Professionalism in greeting, closing, and overall tone"
          color={getScoreColor(score.toneProfessionalism)}
          desc="Greeting & closing tone"
        />
      </div>
      
      <div className="flex items-center justify-between p-4 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] rounded-xl">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${score.callToActionPresent ? 'bg-[var(--sys-color-kr-activistSmokeGreen-base)]' : 'bg-[var(--sys-color-solidarityRed-base)]'}`} />
          <span style={{ ...M3Type.labelLarge, color: 'var(--sys-color-paperWhite-base)' }} className="uppercase tracking-wider">Call to Action</span>
        </div>
        <span style={M3Type.labelLarge} className={`uppercase tracking-widest ${score.callToActionPresent ? 'text-[var(--sys-color-kr-activistSmokeGreen-base)]' : 'text-[var(--sys-color-solidarityRed-base)]'}`}>
          {score.callToActionPresent ? '✓ Present' : '✗ Missing'}
        </span>
      </div>
    </M3Card>
  );
}
