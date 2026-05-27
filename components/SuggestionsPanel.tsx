/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React from 'react';
import { ATSScoreResult, DocumentType } from '../types';
import { M3Card } from '../src/components/ui/M3Card';
import { M3Type } from '../src/theme/typography';

interface SuggestionsPanelProps {
  score: ATSScoreResult | null;
  documentType: DocumentType;
}

export function SuggestionsPanel({ score, documentType }: SuggestionsPanelProps) {
  if (!score || score.suggestions.length === 0) return null;

  return (
    <M3Card variant="elevated" className="p-6 space-y-4">
      <h4 style={{ ...M3Type.titleSmall, color: 'var(--sys-color-inkGold-base)' }} className="uppercase tracking-widest">Optimization Suggestions</h4>
      <ul className="space-y-3">
        {score.suggestions.map((suggestion, i) => (
          <li key={i} style={M3Type.bodyMedium} className="flex gap-3 text-[var(--sys-color-paperWhite-base)] bg-[var(--sys-color-charcoalBackground-base)] p-3 rounded border border-[var(--sys-color-concreteGrey-steps-0)]">
            <span className="text-amber-500 font-bold shrink-0">!</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
      
      {documentType === 'resume' && score.missingKeywords.length > 0 && (
        <div className="pt-4 border-t border-[var(--sys-color-concreteGrey-steps-0)]">
          <h5 style={{ ...M3Type.labelMedium, color: 'var(--sys-color-worker-ash-base)' }} className="uppercase mb-2">Missing Keywords</h5>
          <div className="flex flex-wrap gap-2">
            {score.missingKeywords.slice(0, 10).map((kw, i) => (
              <span key={i} style={M3Type.labelMedium} className="px-2 py-1 bg-rose-900/20 text-rose-300 border border-rose-500/30 rounded uppercase tracking-wider">
                {kw}
              </span>
            ))}
            {score.missingKeywords.length > 10 && (
              <span style={M3Type.labelMedium} className="text-[var(--sys-color-worker-ash-base)] self-center">+{score.missingKeywords.length - 10} more</span>
            )}
          </div>
        </div>
      )}
    </M3Card>
  );
}
