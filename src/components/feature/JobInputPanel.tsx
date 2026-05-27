/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "../ui/SectionHeader";
import { TextInput } from "../ui/TextInput";
import { M3Button } from "../ui/M3Button";
import { M3Card } from "../ui/M3Card";
import { M3Type } from "../../theme/typography";
import { DocumentInput } from "../../../components/DocumentInput";
import { StatusSpecificLoadingState } from "../ui/StatusSpecificLoadingState";
import { useJobInput } from "../../hooks/useJobInput";
import { JobOpportunity } from "../../../types";

interface Props {
  onAnalyze: (jobTitle: string, companyName: string, rawText: string) => Promise<JobOpportunity | null | void>;
  isAnalyzing: boolean;
}

export function JobInputPanel({ onAnalyze, isAnalyzing }: Props) {
  const {
    jobUrl,
    setJobUrl,
    rawText,
    setRawText,
    isManualExpanded,
    setIsManualExpanded,
    extractedRole,
    setExtractedRole,
    extractedCompany,
    setExtractedCompany,
    isEditingChips,
    setIsEditingChips,
    isExtracting,
    isInstalled,
    handleUrlBlur,
    handleTextProcess,
    handleFileProcess,
    handleAnalyze,
  } = useJobInput({ onAnalyze });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, rotate: 1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <M3Card variant="elevated" className="p-8 relative overflow-hidden shadow-2xl">
        {/* Wheat-paste noise background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]" />
        
        <div className="relative z-10">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-16 gap-8">
            <StatusSpecificLoadingState />
            <div className="text-center">
              <p style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }} className="tracking-tight mb-2">
                Assembling Your Workspace
              </p>
              <p style={{ ...M3Type.bodyMedium, color: 'var(--sys-color-worker-ash-base)' }} className="opacity-60 max-w-xs mx-auto">
                Running asymmetric pre-processing on the requirements...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div>
              <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)', marginBottom: '8px' }}>Launch Application</h2>
              <p style={{ ...M3Type.bodyMedium, color: 'var(--sys-color-worker-ash-base)' }}>Paste a job URL to automatically prep your resume and cover letter.</p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="group relative">
                <TextInput 
                  label="Job Listing URL" 
                  placeholder="https://linkedin.com/jobs/..." 
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--sys-color-solidarityRed-base)] to-[var(--sys-color-inkGold-base)] rounded-xl blur opacity-0 group-hover:opacity-10 transition duration-1000 group-focus-within:opacity-20 pointer-events-none" />
              </div>
              
              {isExtracting && (
                <div style={{ ...M3Type.labelMedium, color: 'var(--sys-color-worker-ash-base)' }} className="animate-pulse mt-2">
                  Extracting job details...
                </div>
              )}

              {(extractedRole || extractedCompany) && !isExtracting && (
                <div className="mt-2">
                  {isEditingChips ? (
                    <div className="flex gap-2 items-center">
                      <input 
                        className="bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] px-3 py-1 rounded text-sm focus:outline-none focus:border-[var(--sys-color-solidarityRed-base)]"
                        value={extractedRole}
                        onChange={(e) => setExtractedRole(e.target.value)}
                        placeholder="Role title"
                      />
                      <span className="text-[var(--sys-color-worker-ash-base)]">·</span>
                      <input 
                        className="bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] px-3 py-1 rounded text-sm focus:outline-none focus:border-[var(--sys-color-solidarityRed-base)]"
                        value={extractedCompany}
                        onChange={(e) => setExtractedCompany(e.target.value)}
                        placeholder="Company name"
                      />
                      <M3Button 
                        variant="text"
                        onClick={() => setIsEditingChips(false)}
                        style={{ padding: '0 8px', minHeight: '32px' }}
                      >
                        Save
                      </M3Button>
                    </div>
                  ) : (
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] rounded-full cursor-pointer hover:border-[var(--sys-color-solidarityRed-base)] transition-colors"
                      onClick={() => setIsEditingChips(true)}
                    >
                      <span className="text-[var(--sys-color-solidarityRed-base)]">✓</span>
                      <span style={{ ...M3Type.labelMedium, color: 'var(--sys-color-paperWhite-base)' }}>{extractedRole || 'Unknown role'}</span>
                      <span className="text-[var(--sys-color-worker-ash-base)]">·</span>
                      <span style={{ ...M3Type.labelMedium, color: 'var(--sys-color-worker-ash-base)' }}>{extractedCompany || 'Unknown company'}</span>
                    </div>
                  )}
                </div>
              )}

              {!isManualExpanded && (
                <M3Button 
                  variant="text"
                  onClick={() => setIsManualExpanded(true)}
                  style={{ justifyContent: 'flex-start', padding: 0 }}
                >
                  No URL? Describe the role instead
                </M3Button>
              )}

              <AnimatePresence>
                {isManualExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-[var(--sys-color-outline-variant)] mt-2">
                      <M3Button 
                        variant="text"
                        onClick={() => setIsManualExpanded(false)}
                        style={{ justifyContent: 'flex-start', padding: 0, marginBottom: '16px' }}
                      >
                        Back
                      </M3Button>
                      <DocumentInput 
                        onProcess={handleFileProcess} 
                        isLoading={isExtracting} 
                        onRawTextChange={setRawText}
                        initialRawText={rawText}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end mt-4">
                <motion.div whileHover={(!jobUrl && !rawText) ? {} : { y: -2 }}>
                  <M3Button 
                    variant="filled" 
                    onClick={handleAnalyze} 
                    disabled={!jobUrl && !rawText}
                    style={{ 
                      minWidth: '240px', 
                      height: '56px',
                      opacity: (!jobUrl && !rawText) ? 0.4 : 1 
                    }}
                  >
                    {!jobUrl && !rawText ? 'Enter Job Details' : 'Start My Application'}
                  </M3Button>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </M3Card>
    </motion.div>
  );
}
