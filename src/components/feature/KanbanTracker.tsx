import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Mail, 
  Link, 
  ExternalLink, 
  History, 
  Target, 
  ChevronRight, 
  MoreVertical, 
  Calendar, 
  MapPin, 
  Plus,
  GripVertical,
  Clock,
  Briefcase,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { M3Button } from '../ui/M3Button';
import { M3Type } from '../../theme/typography';
import { Placard, ScaffoldArea, StatusBadge, Valve } from '../ui/Primitives';
import { cn } from '../../lib/utils';

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

const columns = [
  { id: 'draft', label: 'Draft', color: 'var(--sys-color-worker-ash-base)' },
  { id: 'applied', label: 'Applied', color: 'var(--sys-color-inkGold-base)' },
  { id: 'interviewing', label: 'Interviewing', color: 'var(--sys-color-solidarityRed-base)' },
  { id: 'offered', label: 'Offer', color: 'var(--sys-color-signalGreen-base)' },
  { id: 'archived', label: 'Archived', color: 'var(--sys-color-charcoalBackground-steps-4)' },
];

export function KanbanTracker({ onSelectApp, selectedId }: { onSelectApp: (id: string) => void, selectedId: string | null }) {
  const [apps, setApps] = useState(mockApplications);

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4 scrollbar-hide">
      {columns.map((column) => (
        <div key={column.id} className="w-[320px] flex-shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between px-3 py-2 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-xl border border-[var(--sys-color-outline-variant)]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
              <h3 className="uppercase tracking-[0.2em] font-bold text-[10px] text-[var(--sys-color-paperWhite-base)]">{column.label}</h3>
              <span className="px-2 py-0.5 rounded-md bg-[var(--sys-color-charcoalBackground-steps-4)] text-[10px] font-mono text-[var(--sys-color-worker-ash-base)]">
                {apps.filter(app => app.status === column.id).length}
              </span>
            </div>
            <button className="p-1 hover:bg-[var(--sys-color-charcoalBackground-steps-4)] rounded-md transition-colors text-[var(--sys-color-worker-ash-base)]">
              <Plus size={14} />
            </button>
          </div>

          <ScaffoldArea className="flex-1 flex flex-col gap-4 p-2 overflow-y-auto scrollbar-hide">
            {apps
              .filter(app => app.status === column.id)
              .map((app) => (
                <motion.div
                  layoutId={app.id}
                  key={app.id}
                  className="w-full cursor-pointer group relative"
                  onClick={() => onSelectApp(app.id)}
                >
                  <Placard 
                    className={cn(
                      "p-5 border transition-all",
                      selectedId === app.id
                        ? "border-[var(--sys-color-inkGold-base)] shadow-2xl bg-[var(--sys-color-charcoalBackground-steps-3)] scale-[1.02]"
                        : "border-[var(--sys-color-outline-variant)] hover:border-[var(--sys-color-worker-ash-base)]"
                    )}
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--sys-color-worker-ash-base)]">
                      <GripVertical size={16} className="cursor-grab active:cursor-grabbing" />
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start pr-6">
                        <div>
                          <h4 className="text-sm font-bold text-[var(--sys-color-paperWhite-base)] mb-1 group-hover:text-[var(--sys-color-inkGold-base)] transition-colors">
                            {app.company}
                          </h4>
                          <p className="text-[11px] font-medium text-[var(--sys-color-worker-ash-base)] leading-tight">
                            {app.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--sys-color-charcoalBackground-steps-4)] border border-[var(--sys-color-outline-variant)]">
                          <Target size={12} className="text-[var(--sys-color-inkGold-base)]" />
                          <span className="text-[10px] font-bold font-mono text-[var(--sys-color-paperWhite-base)]">{app.atsScore}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--sys-color-worker-ash-base)]">
                          <MapPin size={12} />
                          <span>{app.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[var(--sys-color-outline-variant)]/50">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--sys-color-worker-ash-base)]">
                          <Clock size={12} />
                          <span>{app.date}</span>
                        </div>
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--sys-color-solidarityRed-base)] border-2 border-[var(--sys-color-charcoalBackground-steps-2)] flex items-center justify-center text-[8px] font-bold text-white">
                            {app.company.charAt(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Placard>
                </motion.div>
              ))}
            
            {apps.filter(app => app.status === column.id).length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--sys-color-outline-variant)] rounded-[28px] opacity-20">
                <Briefcase size={32} className="mb-4 text-[var(--sys-color-worker-ash-base)]" />
                <p className="uppercase tracking-[0.2em] text-[10px] font-bold text-[var(--sys-color-worker-ash-base)]">No items</p>
              </div>
            )}
          </ScaffoldArea>
        </div>
      ))}
    </div>
  );
}

export function ApplicationDetailWorkspace({ app }: { app: Application }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <StatusBadge variant={app.status === 'offered' ? 'success' : app.status === 'archived' ? 'default' : 'warning'}>
              {app.status}
            </StatusBadge>
            <span className="text-[10px] font-mono text-[var(--sys-color-worker-ash-base)] uppercase tracking-widest">Applied {app.date}</span>
          </div>
          <h1 className="text-5xl font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight">
            {app.role}
          </h1>
          <div className="flex items-center gap-4 text-xl font-bold text-[var(--sys-color-inkGold-base)]">
            <Briefcase size={24} />
            <span>{app.company}</span>
            <span className="text-[var(--sys-color-worker-ash-base)] opacity-30">•</span>
            <MapPin size={24} />
            <span>{app.location}</span>
          </div>
        </div>
        
        <Placard className="p-6 flex flex-col items-center justify-center min-w-[140px]">
          <span className="text-4xl font-bold text-[var(--sys-color-paperWhite-base)]">{app.atsScore}</span>
          <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-widest mt-1">ATS Score</span>
        </Placard>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Resume Version" value={app.resumeVersion} icon={<FileText size={18} />} />
        <MetricCard label="Cover Letter" value={app.coverLetterId} icon={<Mail size={18} />} />
        <MetricCard label="Interview Stages" value={String(app.interviewStages?.length || 0)} icon={<History size={18} />} />
      </div>

      {app.outcome && (
        <Placard className="p-8 border-l-8 border-[var(--sys-color-solidarityRed-base)] bg-[var(--sys-color-solidarityRed-base)]/5">
          <h3 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-widest mb-4">Final Outcome</h3>
          <p className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] leading-relaxed italic">
            "{app.outcome}"
          </p>
        </Placard>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-widest">Interview Pipeline</h3>
          <M3Button variant="tonal" className="h-10">
            <Plus size={18} className="mr-2" />
            Log Stage
          </M3Button>
        </div>
        
        <div className="space-y-4">
          {app.interviewStages && app.interviewStages.length > 0 ? (
            app.interviewStages.map((stage) => (
              <Valve key={stage.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      stage.status === 'passed' ? "bg-[var(--sys-color-signalGreen-base)]/10 text-[var(--sys-color-signalGreen-base)]" :
                      stage.status === 'failed' ? "bg-[var(--sys-color-solidarityRed-base)]/10 text-[var(--sys-color-solidarityRed-base)]" :
                      "bg-[var(--sys-color-charcoalBackground-steps-4)] text-[var(--sys-color-worker-ash-base)]"
                    )}>
                      {stage.status === 'passed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--sys-color-paperWhite-base)]">{stage.type}</h4>
                      <p className="text-[10px] font-mono text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">{stage.date}</p>
                    </div>
                  </div>
                  <StatusBadge variant={
                    stage.status === 'passed' ? 'success' : 
                    stage.status === 'failed' ? 'error' : 'default'
                  }>
                    {stage.status}
                  </StatusBadge>
                </div>
                <p className="text-sm text-[var(--sys-color-worker-ash-base)] leading-relaxed font-medium pl-14">
                  {stage.notes}
                </p>
              </Valve>
            ))
          ) : (
            <div className="p-16 text-center border-2 border-dashed border-[var(--sys-color-outline-variant)] rounded-[32px] opacity-30">
              <History size={48} className="mx-auto mb-4 text-[var(--sys-color-worker-ash-base)]" />
              <p className="text-lg font-bold text-[var(--sys-color-paperWhite-base)]">No interview stages logged yet.</p>
              <p className="text-sm text-[var(--sys-color-worker-ash-base)] mt-2">Track your progress as you move through the hiring process.</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-sm font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-widest">Application Timeline</h3>
        <div className="space-y-0 pl-4 border-l-2 border-[var(--sys-color-outline-variant)]">
          {app.interviewStages?.map(stage => (
            <TimelineRow key={stage.id} date={stage.date} event={stage.type} desc={stage.notes} />
          ))}
          <TimelineRow date={app.date} event="Application submitted" desc="Tailored via CareerCopilot" isLast />
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <Placard className="p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-[var(--sys-color-charcoalBackground-steps-3)] flex items-center justify-center text-[var(--sys-color-inkGold-base)] border border-[var(--sys-color-outline-variant)]">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-sm font-bold text-[var(--sys-color-paperWhite-base)]">{value}</p>
      </div>
    </Placard>
  );
}

function TimelineRow({ date, event, desc, isLast }: { date: string, event: string, desc: string, isLast?: boolean, key?: string | number }) {
  return (
    <div className="relative pl-8 pb-10">
      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--sys-color-solidarityRed-base)] border-4 border-[var(--sys-color-charcoalBackground-base)]" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">{date}</span>
          <span className="text-sm font-bold text-[var(--sys-color-paperWhite-base)]">{event}</span>
        </div>
        <p className="text-xs text-[var(--sys-color-worker-ash-base)] font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
