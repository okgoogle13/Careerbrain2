import { useState } from "react";
import { useChromeExtension } from "./useChromeExtension";
import { JobOpportunity } from "../../types";
import { extractBasicJobDetails } from "../../services/geminiService";

interface UseJobInputProps {
  onAnalyze: (jobTitle: string, companyName: string, rawText: string) => Promise<JobOpportunity | null | void>;
}

export function useJobInput({ onAnalyze }: UseJobInputProps) {
  const [jobUrl, setJobUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [isManualExpanded, setIsManualExpanded] = useState(false);
  const [extractedRole, setExtractedRole] = useState("");
  const [extractedCompany, setExtractedCompany] = useState("");
  const [isEditingChips, setIsEditingChips] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [lastExtractedUrl, setLastExtractedUrl] = useState("");
  const [lastExtractedText, setLastExtractedText] = useState("");
  
  const { isInstalled } = useChromeExtension();

  const handleUrlBlur = async () => {
    if (jobUrl && jobUrl !== lastExtractedUrl && !isExtracting) {
      setIsExtracting(true);
      try {
        const result = await extractBasicJobDetails(jobUrl);
        setExtractedRole(result.Job_Title || "");
        setExtractedCompany(result.Company_Name || "");
        setLastExtractedUrl(jobUrl);
      } catch (err) {
        console.error("Failed to extract basic details:", err);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleTextProcess = async (text: string) => {
    setRawText(text);
    if (text && text !== lastExtractedText && !isExtracting) {
      setIsExtracting(true);
      try {
        const result = await extractBasicJobDetails(text);
        setExtractedRole(result.Job_Title || "");
        setExtractedCompany(result.Company_Name || "");
        setLastExtractedText(text);
      } catch (err) {
        console.error("Failed to extract basic details from text:", err);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleFileProcess = async (files: File[], text?: string, fileData?: { data: string; mimeType: string }[]) => {
    if (text) {
      handleTextProcess(text);
    } else if (fileData && fileData.length > 0) {
      setIsExtracting(true);
      try {
        // For job descriptions, we usually just want the first file's content
        // We can use extractBasicJobDetails but it needs to handle file parts
        // Let's assume extractBasicJobDetails can handle a "text" that is actually a base64 string if we tell it
        // Or better, update geminiService to handle file parts for extraction
        
        // For now, let's just use the first file and try to extract
        const result = await extractBasicJobDetails(fileData[0].data, true); // Added a flag for base64
        setExtractedRole(result.Job_Title || "");
        setExtractedCompany(result.Company_Name || "");
      } catch (err) {
        console.error("Failed to extract details from file:", err);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleAnalyze = async () => {
    // Pass the edited title and company, plus the raw text or URL
    await onAnalyze(extractedRole, extractedCompany, rawText || jobUrl);
  };

  return {
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
  };
}
