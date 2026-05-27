import { useState, useEffect } from 'react';
import { JobOpportunity, CareerDatabase } from '../../types';
import { extractJobOpportunity } from '../../services/geminiService';
import { getUserCareerData, saveUserCareerData } from '../../services/firebase';
import { mockCareerData } from '../utils/mockData';
import { User } from 'firebase/auth';

interface UseApplyWorkspaceProps {
  initialJobData?: { title: string; company: string; text: string } | null;
  user?: User | null;
}

export function useApplyWorkspace({ initialJobData, user }: UseApplyWorkspaceProps) {
  const [careerData, setCareerData] = useState<CareerDatabase | null>(null);
  const [job, setJob] = useState<JobOpportunity | null>(null);
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    if (user) {
      setIsLoadingProfile(true);
      getUserCareerData(user.uid)
        .then(data => {
          if (data) {
            setCareerData(data);
          } else {
            // If no data exists, we could initialize an empty one or use mock for prototype
            setCareerData(mockCareerData);
          }
        })
        .catch(err => {
          console.error("Failed to load profile:", err);
          setCareerData(mockCareerData);
        })
        .finally(() => setIsLoadingProfile(false));
    }
  }, [user]);

  // Automatically process initial job data
  useEffect(() => {
    if (initialJobData && !job && !isAnalyzingJob && !isLoadingProfile) {
      // Load sample profile automatically if none exists
      const dataToUse = careerData || mockCareerData;
      if (!careerData) {
        setCareerData(mockCareerData);
      }
      
      setIsAnalyzingJob(true);
      const isUrl = initialJobData.text.trim().startsWith('http://') || initialJobData.text.trim().startsWith('https://');
      const inputType = isUrl ? 'url' : 'text';
      const content = initialJobData.text;
      
      extractJobOpportunity(inputType, content, dataToUse, initialJobData.title, initialJobData.company)
        .then(extractedJob => setJob(extractedJob))
        .catch(err => {
          console.error("Failed to analyze initial job:", err);
          alert("Failed to analyze job. See console for details.");
        })
        .finally(() => setIsAnalyzingJob(false));
    }
  }, [initialJobData, job, isAnalyzingJob, careerData, isLoadingProfile]);

  const handleLoadSampleProfile = () => {
    setCareerData(mockCareerData);
    alert("Profile loaded (Prototype only)");
  };

  const handleAnalyzeJob = async (jobTitle: string, companyName: string, rawText: string) => {
    if (!careerData) {
      alert("Please load a profile first.");
      return null;
    }
    setIsAnalyzingJob(true);
    try {
      const isUrl = rawText.trim().startsWith('http://') || rawText.trim().startsWith('https://');
      const inputType = isUrl ? 'url' : 'text';
      const content = rawText;
      
      const extractedJob = await extractJobOpportunity(inputType, content, careerData, jobTitle, companyName);
      setJob(extractedJob);
      return extractedJob;
    } catch (err) {
      console.error("Failed to analyze job:", err);
      alert("Failed to analyze job. See console for details.");
      return null;
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  const handleUpdateCareerData = (data: CareerDatabase) => {
    setCareerData(data);
    if (user) {
      saveUserCareerData(user.uid, data).catch(err => {
        console.error("Failed to auto-save career data:", err);
      });
    }
  };

  const handleSave = async (userId: string, data: CareerDatabase) => {
    console.log("Saving data for user", userId, data);
    if (user) {
      await saveUserCareerData(user.uid, data);
    }
  };

  return {
    careerData,
    setCareerData,
    job,
    setJob,
    isAnalyzingJob,
    isLoadingProfile,
    handleLoadSampleProfile,
    handleAnalyzeJob,
    handleUpdateCareerData,
    handleSave
  };
}
