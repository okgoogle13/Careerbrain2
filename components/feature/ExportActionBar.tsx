import React from 'react';
import { M3Button } from '../../src/components/ui/M3Button';
import { M3Type } from '../../src/theme/typography';

interface Props {
  activeTab: 'resume' | 'coverLetter' | 'ksc' | 'analysis' | string;
  setActiveTab: (tab: 'resume' | 'coverLetter' | 'ksc' | 'analysis' | any) => void;
  hasSelectionCriteria: boolean;
  handleAnalyze: () => void;
  showAudit: boolean;
  setShowAudit: (show: boolean) => void;
  userId?: string;
  handleSaveToProfile: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  exportToPDF: () => void;
  exportToDOCX: () => void;
  handleCopyToClipboard: () => void;
  completedSteps: string[];
  job?: any;
  onSyncToCalendar?: () => void;
  isSyncing?: boolean;
  exportToGoogleDoc?: () => void;
  isExportingToDoc?: boolean;
}

export const ExportActionBar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  hasSelectionCriteria,
  handleAnalyze,
  showAudit,
  setShowAudit,
  userId,
  handleSaveToProfile,
  isSaving,
  saveSuccess,
  exportToPDF,
  exportToDOCX,
  handleCopyToClipboard,
  completedSteps,
  job,
  onSyncToCalendar,
  isSyncing,
  exportToGoogleDoc,
  isExportingToDoc
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--sys-color-outline-variant)] pb-0 sticky top-0 bg-[var(--sys-color-charcoalBackground-base)] z-40 pt-4">
      <div className="flex w-full md:w-auto overflow-x-auto scrollbar-hide">
        {completedSteps.includes('analysis') && (
          <button
            onClick={() => setActiveTab('analysis')}
            style={M3Type.labelLarge}
            className={`relative flex-1 md:flex-none px-6 py-3 transition-colors whitespace-nowrap ${
              activeTab === 'analysis' ? 'text-[var(--sys-color-paperWhite-base)]' : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
            }`}
          >
            Analysis
            {activeTab === 'analysis' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--sys-color-solidarityRed-base)]" />
            )}
          </button>
        )}
        {completedSteps.includes('resume') && (
          <button
            onClick={() => setActiveTab('resume')}
            style={M3Type.labelLarge}
            className={`relative flex-1 md:flex-none px-6 py-3 transition-colors whitespace-nowrap ${
              activeTab === 'resume' ? 'text-[var(--sys-color-paperWhite-base)]' : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
            }`}
          >
            Resume
            {activeTab === 'resume' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--sys-color-solidarityRed-base)]" />
            )}
          </button>
        )}
        {completedSteps.includes('coverLetter') && (
          <button
            onClick={() => setActiveTab('coverLetter')}
            style={M3Type.labelLarge}
            className={`relative flex-1 md:flex-none px-6 py-3 transition-colors whitespace-nowrap ${
              activeTab === 'coverLetter' ? 'text-[var(--sys-color-paperWhite-base)]' : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
            }`}
          >
            Cover Letter
            {activeTab === 'coverLetter' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--sys-color-solidarityRed-base)]" />
            )}
          </button>
        )}
        {hasSelectionCriteria && completedSteps.includes('ksc') && (
          <button
            onClick={() => setActiveTab('ksc')}
            style={M3Type.labelLarge}
            className={`relative flex-1 md:flex-none px-6 py-3 transition-colors whitespace-nowrap ${
              activeTab === 'ksc' ? 'text-[var(--sys-color-paperWhite-base)]' : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
            }`}
          >
            KSC Responses
            {activeTab === 'ksc' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--sys-color-solidarityRed-base)]" />
            )}
          </button>
        )}
        {completedSteps.includes('export') && (
          <button
            onClick={() => setActiveTab('export')}
            style={M3Type.labelLarge}
            className={`relative flex-1 md:flex-none px-6 py-3 transition-colors whitespace-nowrap ${
              activeTab === 'export' ? 'text-[var(--sys-color-paperWhite-base)]' : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
            }`}
          >
            Preview & Export
            {activeTab === 'export' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--sys-color-solidarityRed-base)]" />
            )}
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end pb-3 md:pb-2 pr-2">
        <M3Button
          variant="outlined"
          onClick={handleAnalyze}
          className="fixed bottom-20 right-4 md:static md:bottom-auto md:right-auto z-50 flex items-center gap-2 py-4 px-6 md:py-2 md:px-4 rounded-2xl md:rounded-full shadow-lg md:shadow-none"
        >
          <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Save & Rescore
        </M3Button>
        
        {(activeTab === 'resume' || activeTab === 'coverLetter' || activeTab === 'ksc') && (
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
            {(activeTab === 'resume' || activeTab === 'coverLetter') && (
              <M3Button 
                variant={showAudit ? 'filled' : 'outlined'}
                onClick={() => setShowAudit(!showAudit)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">{showAudit ? 'Hide Audit' : 'Show Audit'}</span>
                <span className="sm:hidden">Audit</span>
              </M3Button>
            )}
            {activeTab === 'coverLetter' && userId && (
              <M3Button
                variant={saveSuccess ? 'filled' : 'outlined'}
                onClick={handleSaveToProfile}
                disabled={isSaving || saveSuccess}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full"
              >
                {isSaving ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">Saving...</span>
                  </span>
                ) : saveSuccess ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden sm:inline">Saved!</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="hidden sm:inline">Save</span>
                  </span>
                )}
              </M3Button>
            )}
            {onSyncToCalendar && (
              <M3Button
                variant="outlined"
                onClick={onSyncToCalendar}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border-cyan-500/30 text-cyan-400"
              >
                {isSyncing ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync to Calendar'}</span>
                <span className="sm:hidden">Sync</span>
              </M3Button>
            )}
            <M3Button 
              variant="outlined"
              onClick={handleCopyToClipboard}
              className="px-4 py-2 rounded-full"
              title="Copy Text"
            >
              Copy to Clipboard for ATS
            </M3Button>
            <M3Button variant="outlined" onClick={() => exportToPDF()} className="px-3 py-2 rounded-full">
              PDF
            </M3Button>
            <M3Button variant="outlined" onClick={() => exportToDOCX()} className="px-3 py-2 rounded-full">
              DOCX
            </M3Button>
            {exportToGoogleDoc && (
              <M3Button variant="outlined" onClick={exportToGoogleDoc} disabled={isExportingToDoc} className="px-3 py-2 rounded-full">
                {isExportingToDoc ? "Exporting..." : "G-Docs"}
              </M3Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
