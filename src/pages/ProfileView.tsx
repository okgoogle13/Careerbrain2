/**
 * CLASSIFICATION: Support-Reference Page
 * Prototype-only reference page.
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WorkspaceLayout } from "../components/layout/WorkspaceLayout";
import { SolidarityPageLayout } from "../components/layout/SolidarityPageLayout";
import { TextInput } from "../components/ui/TextInput";
import { M3Button } from "../components/ui/M3Button";
import { M3Type } from "../theme/typography";
import { DocumentInput } from "../../components/DocumentInput";
import { Modal } from "../components/ui/Modal";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import { commonIndustrySkills } from "../utils/skills";
import { March, Megaphone, Placard, ScaffoldArea, ScaffoldInput, StatusBadge, Strike, KrIcon, Valve } from "../components/ui/Primitives";

import { 
  User as UserIcon, 
  Briefcase, 
  FileText, 
  Mic, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Search, 
  Filter, 
  MoreVertical, 
  Save, 
  X, 
  Zap, 
  Calendar, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  History, 
  Target, 
  Layout, 
  Layers, 
  Database, 
  Shield, 
  Key, 
  Bell, 
  Moon, 
  Sun, 
  Languages, 
  HelpCircle, 
  Info, 
  RefreshCw 
} from "lucide-react";
import { User } from 'firebase/auth';
import { toast } from "sonner";
import { processCareerDocuments, generateVoiceProfile, generateProfileGuidance } from "../../services/geminiService";
import { CareerDatabase, IngestedDocument, VoiceProfile } from "../../types";
import { saveUserCareerData, getUserCareerData } from "../../services/firebase";
import { calendarService } from "../services/calendarService";

interface Props {
  user?: User | null;
}

export function ProfileView({ user }: Props) {
  const [googleTokens, setGoogleTokens] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setGoogleTokens(event.data.tokens);
        // In a real app, we'd save this to Firestore
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectGoogle = async () => {
    try {
      const url = await calendarService.getAuthUrl();
      window.open(url, 'google_oauth', 'width=600,height=700');
    } catch (error) {
      console.error("Failed to get auth URL", error);
      alert("Failed to initiate Google connection. Please check your backend configuration.");
    }
  };

  const handleDisconnectGoogle = async () => {
    await calendarService.disconnect();
    setGoogleTokens(null);
  };
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([]);
  const [completeness, setCompleteness] = useState(25);
  const [skills, setSkills] = useState<string[]>([]);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [targetTitles, setTargetTitles] = useState<string[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [ingestedDocuments, setIngestedDocuments] = useState<IngestedDocument[]>([]);
  const [docCount, setDocCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [fullCareerData, setFullCareerData] = useState<CareerDatabase | null>(null);

  // Voice Profile State
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([]);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveVoice = async (sample: string) => {
    if (!user?.uid) return;
    setIsVoiceLoading(true);
    setVoiceError(null);
    
    try {
      // Convert sample text to base64 for the service
      const base64Sample = btoa(unescape(encodeURIComponent(sample)));
      const profileData = await generateVoiceProfile([{ 
        inlineData: { data: base64Sample, mimeType: 'text/plain' } 
      }]);
      
      const newProfile: VoiceProfile = {
        id: crypto.randomUUID(),
        name: "Authentic Voice",
        tone: profileData.tone || "Professional",
        formality: profileData.formality || "Professional",
        commonPhrases: profileData.commonPhrases || [],
        structuralPatterns: profileData.structuralPatterns || "",
        constraints: profileData.constraints || [],
        isDefault: true
      };

      // For now, we replace existing profiles with the new one
      const updatedProfiles = [newProfile];
      
      const updatedData: CareerDatabase = {
        ...fullCareerData!,
        Voice_Profiles: updatedProfiles
      };
      
      await saveUserCareerData(user.uid, updatedData);
      setFullCareerData(updatedData);
      setVoiceProfiles(updatedProfiles);
      toast.success("Voice profile calibrated successfully.");
    } catch (err) {
      console.error("Voice calibration failed:", err);
      const msg = "Calibration failed: Unable to analyze the writing sample. Please ensure it's long enough and contains clear patterns.";
      setVoiceError(msg);
      toast.error(msg);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const handleResetVoice = async () => {
    if (!user?.uid || !fullCareerData) return;
    setIsVoiceLoading(true);
    try {
      const updatedData: CareerDatabase = {
        ...fullCareerData,
        Voice_Profiles: []
      };
      await saveUserCareerData(user.uid, updatedData);
      setFullCareerData(updatedData);
      setVoiceProfiles([]);
      toast.success("Voice profile reset.");
    } catch (err) {
      console.error("Reset voice failed:", err);
      toast.error("Failed to reset voice profile.");
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const [activeSection, setActiveSection] = useState("identity");

  const sections = [
    { id: "identity", label: "Identity", icon: "User" },
    { id: "career", label: "Career Profile", icon: "Sparkles" },
    { id: "documents", label: "Master resume profile", icon: "FileText" },
    { id: "voice", label: "Authentic voice", icon: "Mic" },
    { id: "skills", label: "Skills", icon: "Zap" },
    { id: "integrations", label: "Integrations", icon: "Link" },
  ];

  // Load data from Firestore or Google Auth
  useEffect(() => {
    if (user?.uid) {
      getUserCareerData(user.uid).then(data => {
        if (data) {
          setFullCareerData(data);
          setFullName(data.Personal_Information.FullName || "");
          setEmail(data.Personal_Information.Email || "");
          setPhone(data.Personal_Information.Phone || "");
          setLocation(data.Personal_Information.Location || "");
          setPortfolioUrls(data.Personal_Information.Portfolio_Website_URLs || []);
          setSkills(data.Master_Skills_Inventory.map(s => s.Skill_Name) || []);
          setIngestedDocuments(data.Ingested_Documents || []);
          setDocCount(data.Ingested_Documents?.length || 0);
          setVoiceProfiles(data.Voice_Profiles || []);
          setTargetRoles(data.Career_Profile?.Job_Preferences?.Target_Roles || []);
          setTargetTitles(data.Career_Profile?.Target_Titles || []);
        } else {
          // Auto-populate from Google account if no Firestore data exists
          if (user.displayName) setFullName(user.displayName);
          if (user.email) setEmail(user.email);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    let score = 10;
    if (fullName) score += 10;
    if (email) score += 10;
    if (phone) score += 10;
    if (location) score += 10;
    if (skills.length > 0) score += 10;
    if (ingestedDocuments.length > 0) score += 10;
    
    // Target Roles
    if (fullCareerData?.Career_Profile?.Target_Titles?.length || fullCareerData?.Career_Profile?.Job_Preferences?.Target_Roles?.length) {
      score += 15;
    }
    
    // Saved Documents
    if (fullCareerData?.Saved_Documents && fullCareerData.Saved_Documents.length > 0) {
      score += 15;
    }

    setCompleteness(Math.min(100, score));
  }, [fullName, email, phone, location, skills, ingestedDocuments, fullCareerData]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      const data: CareerDatabase = {
        ...fullCareerData,
        Personal_Information: {
          FullName: fullName,
          Email: email,
          Phone: phone,
          Location: location,
          Portfolio_Website_URLs: portfolioUrls
        },
        Master_Skills_Inventory: skills.map(s => ({
          Skill_Name: s,
          Category: "General",
          Subtype: []
        })),
        Ingested_Documents: ingestedDocuments,
        Career_Profile: {
          ...fullCareerData?.Career_Profile,
          Target_Titles: targetTitles,
          Job_Preferences: {
            ...fullCareerData?.Career_Profile?.Job_Preferences,
            Target_Roles: targetRoles
          }
        },
        Career_Entries: fullCareerData?.Career_Entries || [],
        Structured_Achievements: fullCareerData?.Structured_Achievements || [],
        KSC_Responses: fullCareerData?.KSC_Responses || [],
        Saved_Documents: fullCareerData?.Saved_Documents || [],
        Voice_Profiles: fullCareerData?.Voice_Profiles || []
      };
      await saveUserCareerData(user.uid, data);
      setFullCareerData(data);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSampleProfile = () => {
    setFullName("Jane Doe");
    setEmail("jane.doe@example.com");
    setSkills(["React", "TypeScript", "Node.js", "Tailwind CSS"]);
    setDocCount(3);
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleProcessDocuments = async (files: File[], rawText?: string, fileData?: { data: string; mimeType: string }[]) => {
    setIsProcessing(true);
    setProcessError(null);
    try {
      let data: CareerDatabase | null = null;
      
      const newIngestedDocs: IngestedDocument[] = [];
      if (fileData && fileData.length > 0) {
        data = await processCareerDocuments(fileData.map((fd, i) => {
          newIngestedDocs.push({
            id: crypto.randomUUID(),
            name: files[i]?.name || `Document ${i+1}`,
            mimeType: fd.mimeType,
            content: fd.data,
            dateIngested: new Date().toISOString()
          });
          return { inlineData: fd };
        }));
      } else if (rawText) {
        newIngestedDocs.push({
          id: crypto.randomUUID(),
          name: "Raw Text Input",
          mimeType: 'text/plain',
          content: btoa(rawText),
          dateIngested: new Date().toISOString()
        });
        data = await processCareerDocuments([{ inlineData: { data: btoa(rawText), mimeType: 'text/plain' } }]);
      }

      if (data) {
        // Update profile with extracted data
        if (data.Personal_Information.FullName) setFullName(data.Personal_Information.FullName);
        if (data.Personal_Information.Email) setEmail(data.Personal_Information.Email);
        if (data.Personal_Information.Phone) setPhone(data.Personal_Information.Phone);
        if (data.Personal_Information.Location) setLocation(data.Personal_Information.Location);
        if (data.Personal_Information.Portfolio_Website_URLs) {
          setPortfolioUrls(prev => Array.from(new Set([...prev, ...data!.Personal_Information.Portfolio_Website_URLs])));
        }
        
        const extractedSkills = data.Master_Skills_Inventory.map(s => s.Skill_Name);
        const newSuggestions = extractedSkills.filter(s => !skills.includes(s));
        setSuggestedSkills(prev => Array.from(new Set([...prev, ...newSuggestions])));
        
        const updatedIngestedDocs = [...ingestedDocuments, ...newIngestedDocs];
        setIngestedDocuments(updatedIngestedDocs);
        setDocCount(updatedIngestedDocs.length);
        
        // Switch to skills section to show suggestions
        setActiveSection("skills");
      }
    } catch (err) {
      console.error("Processing documents failed:", err);
      setProcessError("Failed to process documents. Please check your files and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveDocument = (id: string) => {
    const updated = ingestedDocuments.filter(d => d.id !== id);
    setIngestedDocuments(updated);
    setDocCount(updated.length);
  };

  const handleReanalyze = async () => {
    if (ingestedDocuments.length === 0) return;
    setIsProcessing(true);
    setProcessError(null);
    try {
      const data = await processCareerDocuments(ingestedDocuments.map(doc => ({
        inlineData: { data: doc.content, mimeType: doc.mimeType }
      })));
      
      if (data) {
        // Update profile with extracted data
        const extractedSkills = data.Master_Skills_Inventory.map(s => s.Skill_Name);
        const newSuggestions = extractedSkills.filter(s => !skills.includes(s));
        setSuggestedSkills(prev => Array.from(new Set([...prev, ...newSuggestions])));
        setActiveSection("skills");
      }
    } catch (err) {
      console.error("Re-analysis failed:", err);
      setProcessError("Failed to re-analyze profile. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SolidarityPageLayout>
      <WorkspaceLayout>
        <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
          {/* LEFT PANE: User Profile & Nav */}
          <div className="w-full md:w-[280px] flex-shrink-0 p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] flex flex-col gap-8 overflow-y-auto rounded-t-[28px] md:rounded-l-[28px] md:rounded-tr-none md:rounded-br-none">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-24 h-24 rounded-3xl bg-[var(--sys-color-charcoalBackground-steps-3)] overflow-hidden flex items-center justify-center border-4 border-[var(--sys-color-outline-variant)] shadow-sm">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)]">{fullName.charAt(0) || "U"}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight">{fullName || "Anonymous user"}</h2>
                <p className="text-sm text-[var(--sys-color-worker-ash-base)] truncate w-full max-w-[240px]">{email}</p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[var(--sys-color-charcoalBackground-steps-3)]"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[var(--sys-color-inkGold-base)]"
                      strokeWidth="3"
                      strokeDasharray={`${completeness}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--sys-color-paperWhite-base)]">
                    {completeness}%
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] font-bold">Profile</p>
                  <p className="text-xs text-[var(--sys-color-paperWhite-base)] font-bold">Complete</p>
                </div>
              </div>

              {/* Completeness Breakdown */}
              <div className="mt-4 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--sys-color-worker-ash-base)]">Basic Info</span>
                  {fullName && email && phone && location ? (
                    <CheckCircle2 size={12} className="text-[var(--sys-color-signalGreen-base)]" />
                  ) : (
                    <span className="text-[var(--sys-color-inkGold-base)]">Missing</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--sys-color-worker-ash-base)]">Skills</span>
                  {skills.length > 0 ? (
                    <CheckCircle2 size={12} className="text-[var(--sys-color-signalGreen-base)]" />
                  ) : (
                    <span className="text-[var(--sys-color-inkGold-base)]">Missing</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--sys-color-worker-ash-base)]">Documents</span>
                  {ingestedDocuments.length > 0 ? (
                    <CheckCircle2 size={12} className="text-[var(--sys-color-signalGreen-base)]" />
                  ) : (
                    <span className="text-[var(--sys-color-inkGold-base)]">Missing</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--sys-color-worker-ash-base)]">Target Roles</span>
                  {fullCareerData?.Career_Profile?.Target_Titles?.length || fullCareerData?.Career_Profile?.Job_Preferences?.Target_Roles?.length ? (
                    <CheckCircle2 size={12} className="text-[var(--sys-color-signalGreen-base)]" />
                  ) : (
                    <span className="text-[var(--sys-color-inkGold-base)]">Missing</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--sys-color-worker-ash-base)]">Saved Docs</span>
                  {fullCareerData?.Saved_Documents && fullCareerData.Saved_Documents.length > 0 ? (
                    <CheckCircle2 size={12} className="text-[var(--sys-color-signalGreen-base)]" />
                  ) : (
                    <span className="text-[var(--sys-color-inkGold-base)]">Missing</span>
                  )}
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full text-left transition-all ${
                    activeSection === section.id
                      ? "bg-[var(--sys-color-charcoalBackground-steps-3)] text-[var(--sys-color-paperWhite-base)] font-bold"
                      : "text-[var(--sys-color-worker-ash-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-3)]/50"
                  }`}
                >
                  <span className="text-sm">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* RIGHT PANE: Section Content */}
          <div className="flex-1 min-width-0 bg-[var(--sys-color-charcoalBackground-steps-1)] flex flex-col overflow-hidden rounded-b-[28px] md:rounded-r-[28px] md:rounded-tl-none md:rounded-bl-none">
            {/* Sticky Save Header */}
            <div className="sticky top-0 z-10 bg-[var(--sys-color-charcoalBackground-steps-1)]/80 backdrop-blur-md border-b border-[var(--sys-color-outline-variant)] py-4 px-8 flex items-center justify-between">
              <h2 style={{ ...M3Type.titleLarge, color: 'var(--sys-color-paperWhite-base)' }}>
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
              <M3Button 
                variant="filled" 
                onClick={handleSave} 
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </M3Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-3xl"
                >
                  {activeSection === "identity" && (
                    <div className="bg-[var(--sys-color-charcoalBackground-steps-2)] p-8 rounded-[32px] border border-[var(--sys-color-outline-variant)] shadow-sm">
                      <h3 className="text-[22px] leading-[28px] font-bold text-[var(--sys-color-paperWhite-base)] mb-6">Identity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput label="Full name" placeholder="e.g. Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        <TextInput label="Email address" placeholder="e.g. jane@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextInput label="Phone number" placeholder="e.g. +1 234 567 890" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <TextInput label="Location" placeholder="e.g. New York, NY" value={location} onChange={(e) => setLocation(e.target.value)} />
                      </div>
                      
                      {portfolioUrls.length > 0 && (
                        <div className="mt-8">
                          <label className="block text-sm font-bold text-[var(--sys-color-worker-ash-base)] mb-4">Portfolio and social links</label>
                          <div className="flex flex-wrap gap-3">
                            {portfolioUrls.map((url, i) => (
                              <div key={i} className="px-4 py-2 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-worker-ash-base)] text-xs truncate max-w-[240px] rounded-full">
                                {url}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 text-right">
                        <M3Button variant="text" onClick={handleLoadSampleProfile}>
                          Load sample profile
                        </M3Button>
                      </div>

                      <ProfileGuidance 
                        section="identity" 
                        data={{ fullName, email, phone, location }} 
                        targetRoles={targetRoles} 
                      />
                    </div>
                  )}

                  {activeSection === "career" && (
                    <div className="bg-[var(--sys-color-charcoalBackground-steps-2)] p-8 rounded-[32px] border border-[var(--sys-color-outline-variant)] shadow-sm">
                      <h3 className="text-[22px] leading-[28px] font-bold text-[var(--sys-color-paperWhite-base)] mb-6">Career Profile</h3>
                      
                      <div className="space-y-8">
                        <div>
                          <label className="block text-sm font-bold text-[var(--sys-color-worker-ash-base)] mb-4">Target Roles</label>
                          <p className="text-xs text-[var(--sys-color-worker-ash-base)] mb-4">What roles are you aiming for? This helps us tailor your profile guidance.</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {targetRoles.map((role, i) => (
                              <span key={i} className="px-4 py-2 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-full text-xs text-[var(--sys-color-paperWhite-base)] flex items-center gap-2">
                                {role}
                                <button onClick={() => setTargetRoles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-400">
                                  <X size={14} />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Add a target role (e.g. Senior Product Manager)"
                              className="flex-1 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-xl px-4 py-3 text-sm text-[var(--sys-color-paperWhite-base)] outline-none focus:border-[var(--sys-color-worker-ash-base)] transition-all"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = e.currentTarget.value.trim();
                                  if (val && !targetRoles.includes(val)) {
                                    setTargetRoles([...targetRoles, val]);
                                    e.currentTarget.value = "";
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-[var(--sys-color-worker-ash-base)] mb-4">Target Titles</label>
                          <p className="text-xs text-[var(--sys-color-worker-ash-base)] mb-4">Specific job titles you're interested in.</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {targetTitles.map((title, i) => (
                              <span key={i} className="px-4 py-2 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-full text-xs text-[var(--sys-color-paperWhite-base)] flex items-center gap-2">
                                {title}
                                <button onClick={() => setTargetTitles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-400">
                                  <X size={14} />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Add a target title"
                              className="flex-1 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-xl px-4 py-3 text-sm text-[var(--sys-color-paperWhite-base)] outline-none focus:border-[var(--sys-color-worker-ash-base)] transition-all"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = e.currentTarget.value.trim();
                                  if (val && !targetTitles.includes(val)) {
                                    setTargetTitles([...targetTitles, val]);
                                    e.currentTarget.value = "";
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <ProfileGuidance 
                        section="career" 
                        data={{ targetRoles, targetTitles }} 
                        targetRoles={targetRoles} 
                      />
                    </div>
                  )}

                  {activeSection === "documents" && (
                    <div className="bg-[var(--sys-color-charcoalBackground-steps-2)] p-8 rounded-[32px] border border-[var(--sys-color-outline-variant)] shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                         <h3 className="text-[22px] leading-[28px] font-bold text-[var(--sys-color-paperWhite-base)]">Master resume profile</h3>
                        {ingestedDocuments.length > 0 && (
                          <M3Button 
                            variant="text"
                            onClick={handleReanalyze}
                            disabled={isProcessing}
                            className="text-[var(--sys-color-inkGold-base)]"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <path d="M23 4v6h-6"></path>
                              <path d="M1 20v-6h6"></path>
                              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                            </svg>
                            {isProcessing ? 'Analyzing...' : 'Re-analyze profile'}
                          </M3Button>
                        )}
                      </div>

                      {ingestedDocuments.length === 0 && !isProcessing ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-20 h-20 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-[var(--sys-color-outline-variant)]">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--sys-color-worker-ash-base)]">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="12" y1="18" x2="12" y2="12"></line>
                              <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                          </div>
                          <h4 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-2">Build your foundation</h4>
                          <p className="text-[var(--sys-color-worker-ash-base)] mb-8 max-w-sm">Upload your resume, cover letters, and other career documents to build your vectorized master resume profile.</p>
                          <DocumentInput 
                            onProcess={handleProcessDocuments} 
                            isLoading={isProcessing} 
                            hideTitle={true} 
                            submitLabel="Upload documents to build your master resume profile"
                          />

                          <ProfileGuidance 
                            section="documents" 
                            data={{ ingestedDocuments }} 
                            targetRoles={targetRoles} 
                          />
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 gap-4">
                            {ingestedDocuments.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-4 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-[20px] group hover:bg-[var(--sys-color-charcoalBackground-steps-4)] transition-all">
                                <div className="flex items-center gap-4 min-w-0">
                                  <div className="w-10 h-10 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded-xl flex items-center justify-center text-[var(--sys-color-worker-ash-base)]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                      <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-[var(--sys-color-paperWhite-base)] truncate tracking-tight">{doc.name}</p>
                                    <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] opacity-60 font-bold">
                                      Ingested on {new Date(doc.dateIngested).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleRemoveDocument(doc.id)}
                                  className="p-2 text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-solidarityRed-base)] transition-colors"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>

                          <ProfileGuidance 
                            section="documents" 
                            data={{ ingestedDocuments }} 
                            targetRoles={targetRoles} 
                          />

                          <div className="pt-6 border-t border-[var(--sys-color-outline-variant)]">
                            <h4 className="text-xs font-bold text-[var(--sys-color-worker-ash-base)] mb-4">Add more documents</h4>
                            <DocumentInput 
                              onProcess={handleProcessDocuments} 
                              isLoading={isProcessing} 
                              hideTitle={true}
                              submitLabel="Add to master profile"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === "voice" && (
                    <VoiceProfileManagementSection 
                      voiceProfiles={voiceProfiles}
                      onSave={handleSaveVoice}
                      onReset={handleResetVoice}
                      isLoading={isVoiceLoading}
                      error={voiceError}
                    />
                  )}

                  {activeSection === "skills" && (
                    <div className="bg-[var(--sys-color-charcoalBackground-steps-2)] p-8 rounded-[32px] border border-[var(--sys-color-outline-variant)] shadow-sm">
                      <h3 className="text-[22px] leading-[28px] font-bold text-[var(--sys-color-paperWhite-base)] mb-6">Skills</h3>
                      <p className="text-[var(--sys-color-worker-ash-base)] mb-6">Add your technical and soft skills. These will be used to match you with job opportunities.</p>
                      <div className="flex flex-wrap gap-3 mb-8">
                        {skills.map(skill => (
                          <motion.div
                            key={skill}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] font-bold text-sm rounded-full"
                          >
                            {skill}
                            <button 
                              onClick={() => removeSkill(skill)}
                              className="text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-solidarityRed-base)] transition-colors"
                            >
                              ✕
                            </button>
                          </motion.div>
                        ))}
                      </div>

                      {suggestedSkills.length > 0 && (
                        <div className="mb-8 p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-inkGold-base)]/30 rounded-2xl">
                          <h4 className="text-sm font-bold text-[var(--sys-color-inkGold-base)] mb-4 flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                            Suggested from documents
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {suggestedSkills.map(skill => (
                              <button
                                key={skill}
                                onClick={() => {
                                  addSkill(skill);
                                  setSuggestedSkills(prev => prev.filter(s => s !== skill));
                                }}
                                className="px-3 py-1.5 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-worker-ash-base)] text-xs font-bold hover:border-[var(--sys-color-inkGold-base)] hover:text-[var(--sys-color-paperWhite-base)] transition-all flex items-center gap-2 rounded-full"
                              >
                                + {skill}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <AutocompleteInput 
                            label="Add skill" 
                            placeholder="e.g. React, Project Management..." 
                            value={newSkill} 
                            onChange={setNewSkill}
                            onEnter={() => addSkill(newSkill)}
                            suggestions={[...commonIndustrySkills, ...skills]}
                          />
                        </div>
                        <M3Button 
                          variant="tonal" 
                          onClick={() => addSkill(newSkill)} 
                        >
                          Add
                        </M3Button>
                      </div>

                      <ProfileGuidance 
                        section="skills" 
                        data={{ skills }} 
                        targetRoles={targetRoles} 
                      />
                    </div>
                  )}

                  {activeSection === "integrations" && (
                    <div className="space-y-8">
                      <div className="bg-[var(--sys-color-charcoalBackground-steps-2)] p-8 rounded-[32px] border border-[var(--sys-color-outline-variant)] shadow-sm">
                        <h3 className="text-[22px] leading-[28px] font-bold text-[var(--sys-color-paperWhite-base)] mb-6">Integrations</h3>
                        <p className="text-[var(--sys-color-worker-ash-base)] mb-8">Connect your external tools to automate your job search and sync your career assets.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <IntegrationCard 
                            name="LinkedIn" 
                            desc="Import your profile data and job history directly."
                            status="Connected"
                            lastSync="1 hour ago"
                            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
                          />
                          <IntegrationCard 
                            name="Google Drive" 
                            desc="Sync your resumes and cover letters from your cloud storage."
                            status="Disconnected"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
                          />
                          <IntegrationCard 
                            name="Gmail Scan" 
                            desc="Automatically detect job application emails and update your tracker."
                            status="Connected"
                            lastSync="2 hours ago"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                          />
                          <IntegrationCard 
                            name="Slack" 
                            desc="Receive real-time notifications for job updates and interview invites."
                            status="Disconnected"
                            icon={<Zap size={24} />}
                          />
                        </div>
                      </div>

                      <CalendarIntegrationSection 
                        isConnected={!!googleTokens}
                        onConnect={handleConnectGoogle}
                        onDisconnect={handleDisconnectGoogle}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete My Data">
        <div className="p-8">
          <p className="text-[var(--sys-color-worker-ash-base)] mb-8">Are you sure you want to delete all your data? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <M3Button variant="outlined" onClick={() => setShowDeleteModal(false)}>Cancel</M3Button>
            <M3Button variant="filled" onClick={() => { setShowDeleteModal(false); console.log("Data deleted"); }}>Delete</M3Button>
          </div>
        </div>
      </Modal>
    </SolidarityPageLayout>
  );
}

function CalendarIntegrationSection({ isConnected, onConnect, onDisconnect }: any) {
  const [syncedEvents] = useState([
    { id: '1', title: 'Senior Frontend Engineer', company: 'TechCorp', date: '2024-03-28', status: 'Synced' },
    { id: '2', title: 'Product Designer', company: 'DesignStudio', date: '2024-03-30', status: 'Synced' },
  ]);

  return (
    <div className="bg-[var(--sys-color-charcoalBackground-steps-2)] p-8 rounded-[32px] border border-[var(--sys-color-outline-variant)] shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[22px] leading-[28px] font-bold text-[var(--sys-color-paperWhite-base)] mb-2">Google Calendar</h3>
          <p className="text-[var(--sys-color-worker-ash-base)]">Manage your synced application deadlines and reminders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[var(--sys-color-signalGreen-base)]' : 'bg-[var(--sys-color-solidarityRed-base)]'}`} />
          <span className="text-xs font-bold text-[var(--sys-color-paperWhite-base)]">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {!isConnected ? (
        <div className="p-10 flex flex-col items-center justify-center text-center bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-[24px] border border-dashed border-[var(--sys-color-outline-variant)]">
          <div className="w-16 h-16 rounded-full bg-[var(--sys-color-charcoalBackground-steps-4)] flex items-center justify-center mb-6">
            <Calendar size={32} className="text-[var(--sys-color-worker-ash-base)] opacity-20" />
          </div>
          <h4 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-2">Connect your calendar</h4>
          <p className="text-sm text-[var(--sys-color-worker-ash-base)] max-w-xs mx-auto mb-8">
            Sync your job application deadlines directly to your Google Calendar with proactive reminders.
          </p>
          <M3Button variant="filled" onClick={onConnect}>
            Connect Google Calendar
          </M3Button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-2xl">
              <h4 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-4">Calendar Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--sys-color-paperWhite-base)]">Primary Calendar</span>
                  <span className="text-xs text-[var(--sys-color-worker-ash-base)]">nishantdougall@gmail.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--sys-color-paperWhite-base)]">Proactive Reminders</span>
                  <span className="text-xs text-[var(--sys-color-signalGreen-base)]">Enabled</span>
                </div>
                <div className="pt-4 flex gap-3">
                  <M3Button variant="outlined" className="flex-1" onClick={onDisconnect}>Disconnect</M3Button>
                  <M3Button variant="tonal" className="flex-1">Sync All</M3Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-2xl">
              <h4 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-4">Recent Syncs</h4>
              <div className="space-y-3">
                {syncedEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded-xl">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--sys-color-paperWhite-base)] truncate">{event.title}</p>
                      <p className="text-[10px] text-[var(--sys-color-worker-ash-base)]">{event.company} • {event.date}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--sys-color-signalGreen-base)]">{event.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IntegrationCard({ name, desc, status, lastSync, icon, onConnect }: any) {
  const isConnected = status === "Connected";
  return (
    <div className="p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-2xl flex items-center justify-between group hover:border-[var(--sys-color-worker-ash-base)] transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded-xl flex items-center justify-center text-[var(--sys-color-worker-ash-base)] group-hover:text-[var(--sys-color-paperWhite-base)] transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight">{name}</h4>
          <p className="text-xs text-[var(--sys-color-worker-ash-base)]">{desc}</p>
          {lastSync && <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] opacity-60 font-bold mt-1">Last sync: {lastSync}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[10px] font-bold px-2 py-1 rounded ${isConnected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {status}
        </span>
        {!isConnected && onConnect && (
          <M3Button variant="text" onClick={onConnect} style={{ padding: '0 8px', minHeight: '32px' }}>Connect</M3Button>
        )}
        <button className="text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

function ProfileGuidance({ section, data, targetRoles }: { section: string, data: any, targetRoles: string[] }) {
  const [guidance, setGuidance] = useState<{ tips: string[], keywords: string[], examples: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGuidance = async () => {
    setIsLoading(true);
    try {
      const result = await generateProfileGuidance(section, data, targetRoles);
      setGuidance(result);
    } catch (error) {
      console.error("Failed to fetch guidance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidance();
  }, [section]);

  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-2xl animate-pulse">
        <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded w-full"></div>
          <div className="h-3 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!guidance) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-inkGold-base)]/20 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[var(--sys-color-inkGold-base)]" />
          <h4 className="text-xs font-bold text-[var(--sys-color-inkGold-base)] uppercase tracking-wider">AI Guidance & Tips</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] mb-2 uppercase">Actionable Tips</p>
            <ul className="space-y-2">
              {guidance.tips.map((tip, i) => (
                <li key={i} className="text-xs text-[var(--sys-color-paperWhite-base)] flex gap-2">
                  <span className="text-[var(--sys-color-inkGold-base)]">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {guidance.keywords.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] mb-2 uppercase">Recommended Keywords</p>
              <div className="flex flex-wrap gap-2">
                {guidance.keywords.map((keyword, i) => (
                  <span key={i} className="px-2 py-1 bg-[var(--sys-color-charcoalBackground-steps-4)] border border-[var(--sys-color-outline-variant)] rounded text-[10px] text-[var(--sys-color-worker-ash-base)]">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] mb-2 uppercase">Best Practice Examples</p>
            <div className="space-y-2">
              {guidance.examples.map((example, i) => (
                <div key={i} className="p-3 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded-xl text-[10px] italic text-[var(--sys-color-worker-ash-base)] border-l-2 border-[var(--sys-color-inkGold-base)]">
                  "{example}"
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface VoiceProfileStatusCardProps {
  profile: VoiceProfile;
  onReplace: () => void;
  onReset: () => void;
}

function VoiceProfileStatusCard({ profile, onReplace, onReset }: VoiceProfileStatusCardProps) {
  return (
    <Placard className="p-6 border-[var(--sys-color-inkGold-base)]/30">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-[var(--sys-color-inkGold-base)]">Verified authentic voice</h4>
        <StatusBadge variant="success">
          Active Profile
        </StatusBadge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-1">Tone & Formality</p>
            <p className="text-sm text-[var(--sys-color-paperWhite-base)] font-medium">
              {profile.tone} • {profile.formality}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-1">Common Phrases</p>
            <div className="flex flex-wrap gap-2">
              {profile.commonPhrases.map((phrase, i) => (
                <span key={i} className="px-2 py-1 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded text-[10px] text-[var(--sys-color-worker-ash-base)] font-mono">
                  "{phrase}"
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-1">Structural Patterns</p>
            <p className="text-xs text-[var(--sys-color-worker-ash-base)] leading-relaxed font-mono">
              {profile.structuralPatterns}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-1">Constraints</p>
            <ul className="list-disc list-inside text-xs text-[var(--sys-color-worker-ash-base)] font-mono">
              {profile.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-[var(--sys-color-outline-variant)]">
        <M3Button variant="tonal" onClick={onReplace}>Refine voice</M3Button>
        <M3Button variant="outlined" onClick={onReset}>Reset profile</M3Button>
      </div>
    </Placard>
  );
}

interface VoiceSampleSubmissionFormProps {
  onSubmit: (sample: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

function VoiceSampleSubmissionForm({ onSubmit, isLoading, initialValue = "" }: VoiceSampleSubmissionFormProps) {
  const [inputValue, setInputValue] = useState(initialValue);

  return (
    <Placard className="p-6">
      <div className="space-y-4">
        <div>
          <label className="text-[10px] text-[var(--sys-color-worker-ash-base)] opacity-60 mb-2 block font-bold uppercase tracking-wider">
            Source writing sample
          </label>
          <textarea 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste a cover letter, professional summary, or a few paragraphs of your best work. This sample will define your AI-generated tone."
            className="w-full bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] p-4 rounded-xl font-medium text-sm focus:outline-none focus:border-[var(--sys-color-inkGold-base)] transition-all min-h-[150px]"
          />
        </div>
        <Strike 
          onClick={() => onSubmit(inputValue)} 
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? "Analyzing patterns..." : "Calibrate voice"}
        </Strike>
      </div>
    </Placard>
  );
}

interface VoiceProfileCreationPanelProps {
  onSave: (sample: string) => void;
  isLoading: boolean;
  error: string | null;
  initialValue?: string;
}

function VoiceProfileCreationPanel({ onSave, isLoading, error, initialValue }: VoiceProfileCreationPanelProps) {
  return (
    <div className="space-y-8">
      <div className="p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-[var(--sys-color-worker-ash-base)]">Voice calibration</h4>
        </div>
        <p className="text-xs text-[var(--sys-color-worker-ash-base)] mb-6 leading-relaxed">
          Your authentic voice is the foundation of your career narrative. Provide a sample of your writing to ensure every generated document reflects your unique professional identity.
        </p>
        
        <VoiceSampleSubmissionForm onSubmit={onSave} isLoading={isLoading} initialValue={initialValue} />
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-[var(--sys-color-kr-charcoalRed-base)]/20 border border-[var(--sys-color-solidarityRed-base)]/30 rounded-xl"
          >
            <p className="text-xs text-[var(--sys-color-solidarityRed-base)] font-bold">
              {error}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface VoiceProfileManagementSectionProps {
  voiceProfiles: VoiceProfile[];
  onSave: (sample: string) => Promise<void>;
  onReset: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

function VoiceProfileManagementSection({
  voiceProfiles,
  onSave,
  onReset,
  isLoading,
  error
}: VoiceProfileManagementSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const activeProfile = voiceProfiles.find(p => p.isDefault) || voiceProfiles[0];

  const handleReplace = () => {
    setIsEditing(true);
  };

  const handleSaveWrapper = async (sample: string) => {
    await onSave(sample);
    setIsEditing(false);
  };

  return (
    <div className="bg-[var(--sys-color-charcoalBackground-steps-2)] p-8 rounded-[32px] border border-[var(--sys-color-outline-variant)] shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-[22px] leading-[28px] font-bold type-solidarityProtest text-[var(--sys-color-paperWhite-base)] mb-2">Authentic voice</h3>
          <p className="text-[var(--sys-color-worker-ash-base)]">
            {activeProfile && !isEditing
              ? "Your voice profile is active and being used to calibrate generated documents." 
              : "Calibrate the AI to mirror your natural writing style, ensuring consistency across all career documents."}
          </p>
        </div>
      </div>

      {activeProfile && !isEditing ? (
        <VoiceProfileStatusCard 
          profile={activeProfile} 
          onReplace={handleReplace} 
          onReset={onReset}
        />
      ) : (
        <div className="space-y-8">
          {!activeProfile && !isEditing && (
            <div className="p-10 flex flex-col items-center justify-center text-center bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-[24px] border border-dashed border-[var(--sys-color-outline-variant)]">
              <div className="w-16 h-16 rounded-full bg-[var(--sys-color-charcoalBackground-steps-4)] flex items-center justify-center mb-6">
                <Mic size={32} className="text-[var(--sys-color-worker-ash-base)] opacity-20" />
              </div>
              <h4 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-2">No voice profile</h4>
              <p className="text-sm text-[var(--sys-color-worker-ash-base)] max-w-xs mx-auto mb-8">
                Input a writing sample to generate personalized cover letters and interview responses that sound like you.
              </p>
            </div>
          )}
          <VoiceProfileCreationPanel 
            onSave={handleSaveWrapper}
            isLoading={isLoading}
            error={error}
          />
        </div>
      )}
    </div>
  );
}
