/**
 * CLASSIFICATION: Support-Reference Page
 * Prototype-only reference page.
 */
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { WorkspaceLayout } from "../components/layout/WorkspaceLayout";
import { SolidarityPageLayout } from "../components/layout/SolidarityPageLayout";
import { JobInputPanel } from "../components/feature/JobInputPanel";
import { StudioMatchPanel } from "../../components/StudioMatchPanel";
import { SaveApplicationBar } from "../components/feature/SaveApplicationBar";
import { generateMatchAnalysis } from "../../services/geminiService";
import { useApplyWorkspace } from "../hooks/useApplyWorkspace";
import { Link, Target, Sparkles, LayoutDashboard, CheckCircle2, Circle, X } from "lucide-react";
import { DashboardOverview } from "../components/feature/DashboardOverview";
import { useUserStore } from "../hooks/useUserStore";

import { M3Button } from "../components/ui/M3Button";
import { M3Type } from "../theme/typography";

interface Props {
  initialJobData?: { title: string; company: string; text: string } | null;
  user?: any | null;
  onTabChange?: (tab: 'DASHBOARD' | 'JOBS' | 'ATS_CHECK' | 'APPLICATIONS' | 'SUBMITTED_DOCS' | 'PROFILE' | 'SETTINGS') => void;
}

const ChecklistItem = ({ label, completed }: { label: string; completed: boolean }) => (
  <div className="flex items-center gap-3 py-2">
    {completed ? (
      <CheckCircle2 size={18} className="text-[var(--sys-color-signalGreen-base)]" />
    ) : (
      <Circle size={18} className="text-[var(--sys-color-worker-ash-base)]" />
    )}
    <span 
      style={{ 
        ...M3Type.titleSmall, 
        color: completed ? '#888' : 'var(--sys-color-paperWhite-base)',
        textDecoration: completed ? 'line-through' : 'none'
      }}
    >
      {label}
    </span>
  </div>
);

const StepCard = ({ number, icon: Icon, label, desc }: any) => (
  <div className="p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderRadius: '16px' }}>
    <div className="w-10 h-10 rounded-full bg-[var(--sys-color-solidarityRed-base)] flex items-center justify-center text-[var(--sys-color-paperWhite-base)] font-bold shrink-0">
      {number}
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={18} className="text-[var(--sys-color-inkGold-base)]" />
        <h4 style={{ ...M3Type.titleMedium, color: 'var(--sys-color-paperWhite-base)' }}>{label}</h4>
      </div>
      <p style={{ ...M3Type.bodyMedium, color: 'var(--sys-color-worker-ash-base)' }}>{desc}</p>
    </div>
  </div>
);

import { CustomDrivePicker } from "../components/feature/CustomDrivePicker";

export function ApplyQuickWorkspaceReference({ initialJobData, user, onTabChange }: Props) {
  const [showDrivePicker, setShowDrivePicker] = React.useState(false);

  const {
    careerData,
    job,
    isAnalyzingJob,
    isLoadingProfile,
    handleAnalyzeJob,
    handleUpdateCareerData,
    handleSave
  } = useApplyWorkspace({ initialJobData, user });

  // Stub boolean for missing profile data
  const isProfileMissing = true;

  const handleFileSelect = async (file: any) => {
    setShowDrivePicker(false);
    try {
      // Simulate extraction logic by showing a loader or just fetching the text
      const res = await fetch("/api/drive/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: file.id, mimeType: file.mimeType })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Successfully fetched ${file.name}. \n\nExtracted content preview: ` + (data.content.substring(0, 100) || "No content") + "...");
      } else {
        alert(`Failed to fetch file: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching file from Drive.");
    }
  };

  if (isLoadingProfile) {
    return (
      <SolidarityPageLayout>
        <WorkspaceLayout>
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--sys-color-solidarityRed-base) transparent var(--sys-color-solidarityRed-base) var(--sys-color-solidarityRed-base)', borderRadius: 'var(--sys-shape-cutoutRiot01)' }} />
          </div>
        </WorkspaceLayout>
      </SolidarityPageLayout>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <AnimatePresence mode="wait">
        {!job ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full h-full p-6 overflow-y-auto"
          >
            <h1 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '24px' }}>
              Getting started
            </h1>

            {/* Quick Actions (Onboarding) */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', height: '80px' }}>
              <div 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--md-sys-color-surface-container-high)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                className="transition-transform hover:scale-[1.01]"
                onClick={() => setShowDrivePicker(true)}
              >
                 <div style={{ fontSize: '0.875rem' }}>Upload master resume</div>
                 <CheckCircle2 size={20} />
              </div>
              <div 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--md-sys-color-surface-container-high)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                className="transition-transform hover:scale-[1.01]"
                onClick={() => onTabChange?.('JOBS')}
              >
                 <div style={{ fontSize: '0.875rem' }}>Paste a job URL</div>
                 <Link size={20} />
              </div>
            </div>

            <div style={{ ...M3Type.titleLarge, marginBottom: '16px' }}>
              Activity
            </div>
            <DashboardOverview onTabChange={onTabChange} />

          </motion.div>
        ) : (
          <motion.div 
            key="analysis-result"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full h-full p-6 overflow-y-auto"
          >
            {careerData && (
              <StudioMatchPanel 
                careerData={careerData} 
                job={job} 
                onUpdate={handleUpdateCareerData}
                userId={user?.uid || "prototype-user"}
                onAnalyze={generateMatchAnalysis}
                onSave={handleSave}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {showDrivePicker && (
        <CustomDrivePicker 
          onClose={() => setShowDrivePicker(false)}
          onFileSelect={handleFileSelect}
        />
      )}
    </div>
  );
}
