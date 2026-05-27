import { useState, useEffect } from 'react';
import { CareerDatabase, MatchAnalysis, StructuredAchievement } from '../types';
import { refineAchievementField, refineSummary } from '../services/geminiService';
import { JobOpportunity } from '../types';

interface UseTailoredResumeProps {
  careerData: CareerDatabase;
  analysis: MatchAnalysis;
  job?: JobOpportunity;
  onUpdate?: (data: CareerDatabase) => void;
}

export function useTailoredResume({ careerData, analysis, job, onUpdate }: UseTailoredResumeProps) {
  const [achievements, setAchievements] = useState<StructuredAchievement[]>(careerData.Structured_Achievements);
  const [tailoredSummary, setTailoredSummary] = useState(analysis.Tailored_Summary);
  const [isPolishing, setIsPolishing] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});

  // Sync achievements if careerData changes from outside
  useEffect(() => {
    setAchievements(careerData.Structured_Achievements);
  }, [careerData.Structured_Achievements]);

  const isGovernmentJob = job ? 
    /department|government|council|agency|ministry|authority|community services/i.test(job.Company_Name) || 
    /government|public service|compliance|policy|community services/i.test(job.Key_Responsibilities.join(' ')) : false;

  const handlePolish = async (achId: string, field: keyof StructuredAchievement) => {
    setIsPolishing(`${achId}-${String(field)}`);
    try {
      const ach = achievements.find(a => a.Achievement_ID === achId);
      if (!ach) return;
      const polishedText = await refineAchievementField(ach, field, isGovernmentJob);
      setSuggestions(prev => ({ ...prev, [`${achId}-${String(field)}`]: polishedText }));
    } catch (error) {
      console.error("Failed to polish text:", error);
      alert("Failed to polish text. Please try again.");
    } finally {
      setIsPolishing(null);
    }
  };

  const handlePolishSummary = async () => {
    if (!job) return;
    setIsPolishing('summary');
    try {
      const polishedText = await refineSummary(tailoredSummary, job, careerData);
      setSuggestions(prev => ({ ...prev, 'summary': polishedText }));
    } catch (error) {
      console.error("Failed to polish summary:", error);
      alert("Failed to polish summary. Please try again.");
    } finally {
      setIsPolishing(null);
    }
  };

  const applySuggestion = (achId: string, field: keyof StructuredAchievement | 'summary') => {
    const suggestion = suggestions[achId === 'summary' ? 'summary' : `${achId}-${String(field)}`];
    if (!suggestion) return;
    
    if (achId === 'summary') {
      setTailoredSummary(suggestion);
    } else {
      const updatedAchievements = achievements.map(a => 
        a.Achievement_ID === achId ? { ...a, [field as keyof StructuredAchievement]: suggestion } : a
      );
      setAchievements(updatedAchievements);
      
      if (onUpdate) {
        onUpdate({
          ...careerData,
          Structured_Achievements: updatedAchievements
        });
      }
    }

    setSuggestions(prev => {
      const next = { ...prev };
      delete next[achId === 'summary' ? 'summary' : `${achId}-${String(field)}`];
      return next;
    });
  };

  const discardSuggestion = (achId: string, field: keyof StructuredAchievement | 'summary') => {
    setSuggestions(prev => {
      const next = { ...prev };
      delete next[achId === 'summary' ? 'summary' : `${achId}-${String(field)}`];
      return next;
    });
  };

  const getAchievementsForEntry = (entryId: string) => {
    const entryAchievements = achievements.filter(a => a.Entry_ID === entryId);
    
    return entryAchievements.sort((a, b) => {
      const aIsRecommended = analysis.Recommended_Achievement_IDs.includes(a.Achievement_ID);
      const bIsRecommended = analysis.Recommended_Achievement_IDs.includes(b.Achievement_ID);
      if (aIsRecommended && !bIsRecommended) return -1;
      if (!aIsRecommended && bIsRecommended) return 1;
      return 0;
    });
  };

  const workEntries = careerData.Career_Entries.filter(e => e.Entry_Type === "Work Experience")
    .sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime());

  const educationEntries = careerData.Career_Entries.filter(e => e.Entry_Type === "Education");
  
  const projectEntries = careerData.Career_Entries.filter(e => e.Entry_Type === "Project");
  
  const volunteerEntries = careerData.Career_Entries.filter(e => e.Entry_Type === "Volunteer");
  
  const certificationEntries = careerData.Career_Entries.filter(e => e.Entry_Type === "Certification");

  return {
    achievements,
    tailoredSummary,
    setTailoredSummary,
    isPolishing,
    suggestions,
    handlePolish,
    handlePolishSummary,
    applySuggestion,
    discardSuggestion,
    getAchievementsForEntry,
    workEntries,
    educationEntries,
    projectEntries,
    volunteerEntries,
    certificationEntries
  };
}
