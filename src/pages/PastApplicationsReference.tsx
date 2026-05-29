import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WorkspaceLayout } from "../components/layout/WorkspaceLayout";
import { SolidarityPageLayout } from "../components/layout/SolidarityPageLayout";
import { KanbanTracker, ApplicationDetailWorkspace } from "../components/feature/KanbanTracker";
import { M3Button } from "../components/ui/M3Button";
import { M3Type } from "../theme/typography";
import { 
  Mail, 
  Calendar, 
  History, 
  Target, 
  Plus, 
  Filter, 
  Layout, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  Search,
  MoreHorizontal,
  CheckSquare,
  ListTodo,
  Loader2
} from "lucide-react";
import { Placard, ScaffoldArea, ScaffoldInput } from "../components/ui/Primitives";
import { calendarService } from "../services/calendarService";

interface InterviewStage {
  id: string;
  type: string;
  date: string;
  notes: string;
  status: "pending" | "completed" | "passed" | "failed";
}

interface Application {
  id: string;
  company: string;
  role: string;
  date: string;
  status: "draft" | "applied" | "interviewing" | "offered" | "archived";
  atsScore: number;
  location: string;
  resumeVersion: string;
  coverLetterId: string;
  interviewStages?: InterviewStage[];
  outcome?: string;
}

const mockApplications: Application[] = [
  { 
    id: "0", 
    company: "FutureTech", 
    role: "Lead UI Engineer", 
    date: "2024-03-20", 
    status: "draft", 
    atsScore: 88, 
    location: "Remote", 
    resumeVersion: "v2.2-Lead", 
    coverLetterId: "CL-Draft-1",
    interviewStages: []
  },
  { 
    id: "1", 
    company: "TechCorp", 
    role: "Senior Frontend Engineer", 
    date: "2024-03-15", 
    status: "interviewing", 
    atsScore: 92, 
    location: "Remote", 
    resumeVersion: "v2.1-SoftwareEngineer", 
    coverLetterId: "CL-9921",
    interviewStages: [
      { id: "s1", type: "Phone Screen", date: "2024-03-20", notes: "Discussed React experience and system design.", status: "passed" },
      { id: "s2", type: "Technical Interview", date: "2024-03-25", notes: "Live coding session. Focus on performance optimization.", status: "pending" }
    ]
  },
  { 
    id: "2", 
    company: "InnoSoft", 
    role: "Product Designer", 
    date: "2024-03-10", 
    status: "applied", 
    atsScore: 85, 
    location: "San Francisco, CA", 
    resumeVersion: "v1.8-Designer", 
    coverLetterId: "CL-8812",
    interviewStages: []
  },
  { 
    id: "3", 
    company: "GlobalData", 
    role: "Full Stack Developer", 
    date: "2024-02-28", 
    status: "archived", 
    atsScore: 78, 
    location: "London, UK", 
    resumeVersion: "v1.5-FullStack", 
    coverLetterId: "CL-7731",
    outcome: "Rejected after second round. Feedback: Need more experience with distributed systems.",
    interviewStages: [
      { id: "s1", type: "Initial Call", date: "2024-03-05", notes: "Good cultural fit.", status: "passed" },
      { id: "s2", type: "System Design", date: "2024-03-12", notes: "Struggled with database sharding questions.", status: "failed" }
    ]
  },
  { 
    id: "4", 
    company: "FutureAI", 
    role: "Machine Learning Engineer", 
    date: "2024-02-15", 
    status: "offered", 
    atsScore: 95, 
    location: "Austin, TX", 
    resumeVersion: "v3.0-MLE", 
    coverLetterId: "CL-9955",
    outcome: "Accepted offer! Starting April 1st.",
    interviewStages: [
      { id: "s1", type: "Recruiter Screen", date: "2024-02-20", notes: "Very enthusiastic about the role.", status: "passed" },
      { id: "s2", type: "Technical Panel", date: "2024-02-28", notes: "Strong performance in algorithm section.", status: "passed" },
      { id: "s3", type: "Onsite/Final", date: "2024-03-05", notes: "Met with the CTO. Great alignment on vision.", status: "passed" }
    ]
  },
];

export function PastApplicationsReference() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedApp = mockApplications.find(app => app.id === selectedId);

  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarSuccess, setCalendarSuccess] = useState<string | null>(null);

  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksSuccess, setTasksSuccess] = useState<string | null>(null);

  const [emails, setEmails] = useState<any[]>([]);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [gmailError, setGmailError] = useState<string | null>(null);

  const fetchGmailUpdates = async () => {
    setGmailLoading(true);
    setGmailError(null);
    try {
      const tokens = JSON.parse(localStorage.getItem('google_tokens') || 'null');
      const headers: HeadersInit = {};
      if (tokens) {
        headers['Authorization'] = `Bearer ${JSON.stringify(tokens)}`;
      }
      const res = await fetch("/api/gmail/latest", { headers });
      if (res.status === 401) {
        throw new Error("unauthorized");
      }
      if (!res.ok) {
        throw new Error("Failed to scan application updates");
      }
      const data = await res.json();
      setEmails(data.emails || []);
    } catch (err: any) {
      if (err.message === "unauthorized") {
        setGmailError("Google Workspace Connection Required");
      } else {
        setGmailError(err.message || "An error occurred fetching Gmail");
      }
    } finally {
      setGmailLoading(false);
    }
  };

  const handleSyncToCalendar = async () => {
    if (!selectedApp) return;
    setCalendarLoading(true);
    setCalendarSuccess(null);
    try {
      const tokens = JSON.parse(localStorage.getItem('google_tokens') || 'null');
      const result = await calendarService.syncToCalendar({
        title: selectedApp.role,
        company: selectedApp.company,
        deadline: selectedApp.date,
        description: `Follow up application for ${selectedApp.role} at ${selectedApp.company}. Tracked via CareerCopilot.`
      }, tokens);
      if (result.success) {
        setCalendarSuccess("Synced to Calendar!");
        setTimeout(() => setCalendarSuccess(null), 3500);
      } else {
        alert("Failed to sync to Google Calendar.");
      }
    } catch (e) {
      alert("Error syncing to calendar");
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleSyncToTasks = async () => {
    if (!selectedApp) return;
    setTasksLoading(true);
    setTasksSuccess(null);
    try {
      const tokens = JSON.parse(localStorage.getItem('google_tokens') || 'null');
      const result = await calendarService.syncToTasks({
        title: `Follow up: ${selectedApp.company} - ${selectedApp.role}`,
        notes: `Application path submitted on ${selectedApp.date}.`,
        due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }, tokens);
      if (result.success) {
        setTasksSuccess("Added to Tasks!");
        setTimeout(() => setTasksSuccess(null), 3500);
      } else {
        alert("Failed to add task.");
      }
    } catch (e) {
      alert("Error creating Task");
    } finally {
      setTasksLoading(false);
    }
  };

  const connectGoogle = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      const popup = window.open(url, 'Google OAuth', 'width=500,height=600');
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          localStorage.setItem('google_tokens', JSON.stringify(event.data.tokens));
          window.removeEventListener('message', handleMessage);
          fetchGmailUpdates();
        }
      };
      window.addEventListener('message', handleMessage);
    } catch (err) {
      alert("Failed to connect Google account");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('google_tokens')) {
      fetchGmailUpdates();
    }
  }, []);

  return (
    <SolidarityPageLayout>
      <WorkspaceLayout>
        <div className="flex flex-col w-full h-full overflow-hidden bg-[var(--sys-color-charcoalBackground-base)]">
          {/* TOP SECTION: Kanban Board */}
          <div className="h-[480px] flex-shrink-0 p-8 overflow-hidden border-b border-[var(--sys-color-outline-variant)] bg-gradient-to-b from-[var(--sys-color-charcoalBackground-steps-1)] to-[var(--sys-color-charcoalBackground-base)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight">Applications Pipeline</h2>
                <p className="text-xs font-medium text-[var(--sys-color-worker-ash-base)] uppercase tracking-[0.2em]">Manage your active and historical job pursuits</p>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sys-color-worker-ash-base)]" size={16} />
                  <ScaffoldInput className="pl-10 h-11 bg-[var(--sys-color-charcoalBackground-steps-2)]">
                    <input 
                      placeholder="Search applications..." 
                      className="w-full h-full bg-transparent border-none outline-none text-sm text-[var(--sys-color-paperWhite-base)] px-2"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </ScaffoldInput>
                </div>
                <M3Button variant="tonal" className="h-11 px-6">
                  <Filter size={18} className="mr-2" />
                  Filter
                </M3Button>
                <M3Button variant="filled" className="h-11 px-6 bg-[var(--sys-color-inkGold-base)] text-[var(--sys-color-charcoalBackground-base)]">
                  <Plus size={18} className="mr-2" />
                  Add New
                </M3Button>
              </div>
            </div>
            
            <div className="h-[320px]">
              {mockApplications.length > 0 ? (
                <KanbanTracker onSelectApp={setSelectedId} selectedId={selectedId} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-[var(--sys-color-outline-variant)] rounded-[32px] bg-[var(--sys-color-charcoalBackground-steps-1)]">
                  <Layout size={48} className="text-[var(--sys-color-worker-ash-base)] opacity-20 mb-4" />
                  <h3 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-2">No applications yet</h3>
                  <p className="text-sm text-[var(--sys-color-worker-ash-base)] mb-6 max-w-xs">Start tracking your job applications to see them in the pipeline.</p>
                  <M3Button variant="tonal">Track your first application</M3Button>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM SECTION: Detail Workspace */}
          <div className="flex-1 min-width-0 flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedApp ? (
                <motion.div
                  key={selectedApp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-hide"
                >
                  <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-12">
                    <div className="flex-1">
                      <ApplicationDetailWorkspace app={selectedApp} />
                    </div>
                    
                    {/* Workspace Sidebar */}
                    <div className="w-full xl:w-[360px] space-y-8">
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-[0.2em]">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <WorkspaceAction 
                            icon={<Calendar size={18} />} 
                            label="Save to Calendar" 
                            onClick={handleSyncToCalendar}
                            loading={calendarLoading}
                            successText={calendarSuccess}
                          />
                          <WorkspaceAction 
                            icon={<CheckSquare size={18} />} 
                            label="Save to Google Tasks" 
                            onClick={handleSyncToTasks}
                            loading={tasksLoading}
                            successText={tasksSuccess}
                          />
                          <WorkspaceAction icon={<Mail size={18} />} label="Scan Gmail updates" onClick={fetchGmailUpdates} />
                        </div>
                      </section>

                      <Placard className="p-6 space-y-4 border-[var(--sys-color-outline-variant)] bg-[var(--sys-color-charcoalBackground-steps-2)]">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-[0.2em]">Gmail Correspondence</h3>
                          <M3Button 
                            variant="text" 
                            className="text-xs h-6 px-2 text-[var(--sys-color-inkGold-base)] hover:bg-transparent font-bold"
                            onClick={fetchGmailUpdates}
                            disabled={gmailLoading}
                          >
                            {gmailLoading ? "Scanning..." : "Scan Inbox"}
                          </M3Button>
                        </div>
                        <div className="space-y-3">
                          {gmailError ? (
                            <div className="text-center py-4 space-y-2">
                              <p className="text-xs text-[var(--sys-color-worker-ash-base)] italic">{gmailError}</p>
                              {gmailError.includes("Required") && (
                                <M3Button variant="tonal" className="scale-75 font-bold bg-[var(--sys-color-inkGold-base)] text-black" onClick={connectGoogle}>
                                  Connect Google
                                </M3Button>
                              )}
                            </div>
                          ) : emails.length > 0 ? (
                            emails.map(email => (
                              <div key={email.id} className="p-3 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-xl space-y-1 transition-all hover:bg-[var(--sys-color-charcoalBackground-steps-4)]">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="text-xs font-bold text-[var(--sys-color-paperWhite-base)] truncate max-w-[150px]">{email.subject}</span>
                                  <span className="text-[8px] font-mono text-[var(--sys-color-worker-ash-base)] shrink-0">{new Date(email.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[9px] font-mono font-bold text-[var(--sys-color-worker-ash-base)] truncate">From: {email.from}</p>
                                <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] line-clamp-2 mt-1 leading-normal">{email.snippet}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-[var(--sys-color-worker-ash-base)] italic text-center py-4 font-medium leading-relaxed">
                              No recent application emails listed. Click 'Scan Inbox' to fetch live Google mail updates.
                            </p>
                          )}
                        </div>
                      </Placard>
                      
                      <Placard className="p-8 border-[var(--sys-color-inkGold-base)]/20 bg-gradient-to-br from-[var(--sys-color-inkGold-base)]/10 to-transparent relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--sys-color-inkGold-base)]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-[var(--sys-color-inkGold-base)]/20 flex items-center justify-center text-[var(--sys-color-inkGold-base)]">
                            <Sparkles size={20} />
                          </div>
                          <h3 className="text-xs font-bold text-[var(--sys-color-inkGold-base)] uppercase tracking-[0.2em]">AI Strategy Insight</h3>
                        </div>
                        <p className="text-lg font-bold text-[var(--sys-color-paperWhite-base)] leading-relaxed italic mb-6">
                          "This company values 'Scalability' highly. Ensure your interview responses highlight your experience with high-traffic systems."
                        </p>
                        <M3Button variant="text" className="h-8 px-0 text-[var(--sys-color-inkGold-base)] hover:bg-transparent">
                          Generate Talking Points <ArrowRight size={14} className="ml-2" />
                        </M3Button>
                      </Placard>

                      <Placard className="p-6 space-y-4 border-[var(--sys-color-outline-variant)]">
                        <h3 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-[0.2em]">External Links</h3>
                        <div className="space-y-2">
                          <ExternalLinkRow label="Job Description" />
                          <ExternalLinkRow label="Company Website" />
                          <ExternalLinkRow label="Glassdoor Reviews" />
                        </div>
                      </Placard>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-12 text-center">
                  <div className="max-w-md flex flex-col items-center">
                    <div className="w-32 h-32 bg-[var(--sys-color-charcoalBackground-steps-2)] rounded-[40px] flex items-center justify-center mb-8 border border-[var(--sys-color-outline-variant)] relative group">
                      <div className="absolute inset-0 bg-[var(--sys-color-inkGold-base)]/5 rounded-[40px] scale-0 group-hover:scale-110 transition-transform duration-500" />
                      <Target size={64} className="text-[var(--sys-color-worker-ash-base)] opacity-20 relative z-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)] mb-4 tracking-tight">Select an Application</h2>
                    <p className="text-lg text-[var(--sys-color-worker-ash-base)] font-medium leading-relaxed">
                      Click on a card in the pipeline above to open the detail workspace and manage your next steps.
                    </p>
                    <div className="mt-10 flex items-center gap-4 text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-[0.2em]">
                      <span>Drag to reorder</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--sys-color-outline-variant)]" />
                      <span>Click to view</span>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </WorkspaceLayout>
    </SolidarityPageLayout>
  );
}

function WorkspaceAction({ 
  icon, 
  label, 
  onClick, 
  disabled, 
  loading, 
  successText 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick?: () => void; 
  disabled?: boolean;
  loading?: boolean;
  successText?: string | null;
}) {
  return (
    <M3Button 
      variant="outlined" 
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full justify-between group h-12 px-4 border-[var(--sys-color-outline-variant)] ${loading ? 'opacity-70' : 'hover:border-[var(--sys-color-worker-ash-base)]'}`}
    >
      <div className="flex items-center gap-4">
        {loading ? (
          <Loader2 size={16} className="animate-spin text-[var(--sys-color-inkGold-base)]" />
        ) : (
          <div className="text-[var(--sys-color-worker-ash-base)] group-hover:text-[var(--sys-color-paperWhite-base)] transition-colors">
            {icon}
          </div>
        )}
        <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] group-hover:text-[var(--sys-color-paperWhite-base)] uppercase tracking-widest transition-colors">
          {successText ? successText : label}
        </span>
      </div>
      <ChevronRight size={16} className="text-[var(--sys-color-worker-ash-base)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </M3Button>
  );
}

function ExternalLinkRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--sys-color-charcoalBackground-steps-3)] transition-colors cursor-pointer group">
      <span className="text-xs font-medium text-[var(--sys-color-worker-ash-base)] group-hover:text-[var(--sys-color-paperWhite-base)] transition-colors">{label}</span>
      <ArrowRight size={14} className="text-[var(--sys-color-worker-ash-base)] opacity-0 group-hover:opacity-100 transition-all" />
    </div>
  );
}
