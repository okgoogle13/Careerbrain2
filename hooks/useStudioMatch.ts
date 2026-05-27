import { useState, useRef } from 'react';
import { CareerDatabase, JobOpportunity, MatchAnalysis, SavedDocument } from '../types';
import { generateCoverLetter, generateKSCResponses } from '../services/geminiService';
import { RESUME_TEMPLATES, TemplateStyle } from '../constants';
import { useDocumentExport } from './useDocumentExport';
import { useATSScoring } from './useATSScoring';
import { useAutoSave } from './useAutoSave';
import { calendarService } from '../src/services/calendarService';

interface UseStudioMatchProps {
  careerData: CareerDatabase;
  job: JobOpportunity;
  onUpdate?: (data: CareerDatabase) => void;
  userId?: string;
  onAnalyze: (careerData: CareerDatabase, job: JobOpportunity) => Promise<MatchAnalysis>;
  onSave: (userId: string, data: CareerDatabase) => Promise<void>;
}

export function useStudioMatch({
  careerData,
  job,
  onUpdate,
  userId,
  onAnalyze,
  onSave
}: UseStudioMatchProps) {
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter' | 'ksc' | 'analysis' | 'export'>('analysis');
  const [completedSteps, setCompletedSteps] = useState<string[]>(['analysis']);

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>(RESUME_TEMPLATES[0]);
  const [showAudit, setShowAudit] = useState(false);
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [locale, setLocale] = useState<'US' | 'UK/AU'>('US');
  const [hasSelectionCriteria, setHasSelectionCriteria] = useState(false);
  
  const resumeRef = useRef<HTMLDivElement>(null);
  const kscRef = useRef<HTMLDivElement>(null);

  const { exportToPDF, exportToDOCX, getFullResumeText, exportToGoogleDoc } = useDocumentExport({
    activeTab,
    analysis,
    careerData,
    job,
    selectedTemplate,
    coverLetterContent,
    resumeRef,
    kscRef
  });

  const jobDescriptionText = `${job.Job_Title} at ${job.Company_Name}\n${job.Key_Responsibilities.join('\n')}\n${job.Required_Hard_Skills.join('\n')}\n${job.Required_Soft_Skills.join('\n')}`;

  const resumeScoring = useATSScoring(getFullResumeText(), jobDescriptionText, 'resume');
  const coverLetterScoring = useATSScoring(coverLetterContent, jobDescriptionText, 'coverLetter');

  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isGeneratingKSC, setIsGeneratingKSC] = useState(false);
  const [coverLetterInstructions, setCoverLetterInstructions] = useState('');
  const [coverLetterTone, setCoverLetterTone] = useState('Professional');
  const [coverLetterKeyPoints, setCoverLetterKeyPoints] = useState('');
  const [useAuthenticVoice, setUseAuthenticVoice] = useState(true);
  const [kscInstructions, setKscInstructions] = useState('');

  const unlockStep = (step: string) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
    setActiveTab(step as any);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result = await onAnalyze(careerData, job);
      if (result.Overall_Fit_Score < 70) {
          const retryResult = await onAnalyze(careerData, job);
          if (retryResult.Overall_Fit_Score > result.Overall_Fit_Score) {
              result = retryResult;
          }
      }
      setAnalysis(result);
      setCoverLetterContent(result.Cover_Letter_Draft || '');
      setHasSelectionCriteria(!!result.KSC_Responses_Drafts && result.KSC_Responses_Drafts.length > 0);
      setActiveTab('analysis');
      setCompletedSteps(['analysis']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCoverLetter(true);
    try {
      const activeVoiceProfile = useAuthenticVoice && careerData.Voice_Profiles && careerData.Voice_Profiles.length > 0 
        ? careerData.Voice_Profiles[0] 
        : undefined;

      const result = await generateCoverLetter(careerData, job, {
        instructions: coverLetterInstructions,
        tone: coverLetterTone,
        keyPoints: coverLetterKeyPoints,
        voiceProfile: activeVoiceProfile
      });
      setAnalysis(prev => prev ? { ...prev, Cover_Letter_Draft: result.Cover_Letter_Draft, Cover_Letter_Audit: result.Cover_Letter_Audit } : null);
      setCoverLetterContent(result.Cover_Letter_Draft);
      unlockStep('coverLetter');
      setCoverLetterInstructions('');
      setCoverLetterKeyPoints('');
    } catch (err) {
      console.error("Failed to generate cover letter:", err);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleGenerateKSC = async () => {
    setIsGeneratingKSC(true);
    try {
      const result = await generateKSCResponses(careerData, job, kscInstructions);
      setAnalysis(prev => prev ? { ...prev, KSC_Responses_Drafts: result.KSC_Responses_Drafts } : null);
      setHasSelectionCriteria(true);
      unlockStep('ksc');
      setKscInstructions('');
    } catch (err) {
      console.error("Failed to generate KSC:", err);
    } finally {
      setIsGeneratingKSC(false);
    }
  };

  const saveDocument = async (content: string) => {
    if (!userId || !analysis || !onUpdate) return;
    const newDoc: SavedDocument = {
      id: crypto.randomUUID(),
      jobTitle: job.Job_Title,
      companyName: job.Company_Name,
      dateSaved: new Date().toISOString(),
      coverLetter: content,
      tailoredSummary: analysis.Tailored_Summary
    };

    const updatedData = {
      ...careerData,
      Saved_Documents: [...(careerData.Saved_Documents || []), newDoc]
    };

    await onSave(userId!, updatedData);
    onUpdate(updatedData);
  };

  const { isSaving: isAutoSaving, lastSaved, save } = useAutoSave(userId, coverLetterContent, saveDocument);

  const handleSaveToProfile = async () => {
    setIsSaving(true);
    try {
      await save(coverLetterContent);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save document:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = () => {
    const text = activeTab === 'resume' ? getFullResumeText() : activeTab === 'coverLetter' ? coverLetterContent : analysis?.KSC_Responses_Drafts?.map(k => `${k.KSC_Prompt}\n${k.Response}`).join('\n\n') || '';
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard for ATS parsing!');
  };

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSyncToCalendar = async () => {
    setIsSyncing(true);
    try {
      const tokens = JSON.parse(localStorage.getItem('google_tokens') || 'null');
      
      const result = await calendarService.syncToCalendar({
        title: job.Job_Title,
        company: job.Company_Name,
        deadline: job.Application_Deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: `Application for ${job.Job_Title} at ${job.Company_Name}. Match Score: ${analysis?.Overall_Fit_Score}%`
      }, tokens);

      if (result.success) {
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
        alert('Synced to Google Calendar with proactive reminders!');
      } else {
        throw new Error('Sync failed');
      }
    } catch (err) {
      console.error("Failed to sync to calendar:", err);
      alert('Failed to sync to calendar. Please ensure you have connected your Google account in Profile.');
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    analysis,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    completedSteps,
    selectedTemplate,
    setSelectedTemplate,
    showAudit,
    setShowAudit,
    coverLetterContent,
    setCoverLetterContent,
    isSaving,
    saveSuccess,
    locale,
    setLocale,
    hasSelectionCriteria,
    resumeRef,
    kscRef,
    exportToPDF,
    exportToDOCX,
    resumeScoring,
    coverLetterScoring,
    isGeneratingCoverLetter,
    isGeneratingKSC,
    coverLetterInstructions,
    setCoverLetterInstructions,
    coverLetterTone,
    setCoverLetterTone,
    coverLetterKeyPoints,
    setCoverLetterKeyPoints,
    useAuthenticVoice,
    setUseAuthenticVoice,
    kscInstructions,
    setKscInstructions,
    handleAnalyze,
    handleGenerateCoverLetter,
    handleGenerateKSC,
    handleSaveToProfile,
    handleCopyToClipboard,
    unlockStep,
    isAutoSaving,
    lastSaved,
    isSyncing,
    syncSuccess,
    handleSyncToCalendar,
    exportToGoogleDoc
  };
}
