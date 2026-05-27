import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Briefcase, 
  ExternalLink, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock, 
  TrendingUp,
  ChevronRight,
  MoreVertical,
  Zap
} from 'lucide-react';
import { M3Button } from '../components/ui/M3Button';
import { M3Type } from '../theme/typography';
import { calendarService } from '../services/calendarService';
import { Placard, StatusBadge, Valve, ScaffoldInput } from '../components/ui/Primitives';
import { cn } from '../lib/utils';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  posted: string;
  url: string;
  status: 'new' | 'tracking' | 'applied' | 'interviewing';
  matchScore: number;
}

const mockJobs: Job[] = [
  { 
    id: '1', 
    title: 'Senior Frontend Engineer', 
    company: 'TechCorp', 
    location: 'Remote', 
    type: 'Full-time', 
    posted: '2d ago', 
    url: 'https://techcorp.com/jobs/1',
    status: 'new',
    matchScore: 92
  },
  { 
    id: '2', 
    title: 'Product Designer', 
    company: 'DesignStudio', 
    location: 'Sydney, AU', 
    type: 'Contract', 
    posted: '5h ago', 
    url: 'https://designstudio.com/jobs/2',
    status: 'tracking',
    matchScore: 85
  },
  { 
    id: '3', 
    title: 'Full Stack Developer', 
    company: 'StartupX', 
    location: 'Melbourne, AU', 
    type: 'Full-time', 
    posted: '1d ago', 
    url: 'https://startupx.com/jobs/3',
    status: 'applied',
    matchScore: 78
  },
  { 
    id: '4', 
    title: 'UI Engineer', 
    company: 'FinTech Plus', 
    location: 'Remote', 
    type: 'Full-time', 
    posted: '3d ago', 
    url: 'https://fintechplus.com/jobs/4',
    status: 'interviewing',
    matchScore: 95
  },
];

const FILTER_CHIPS = [
  { id: 'all', label: 'All Jobs' },
  { id: 'high-match', label: 'High Match (90%+)' },
  { id: 'remote', label: 'Remote' },
  { id: 'full-time', label: 'Full-time' },
];

export function JobsWorklist() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [pasteUrl, setPasteUrl] = useState('');
  const [jobs] = useState<Job[]>(mockJobs);
  const [syncingJobId, setSyncingJobId] = useState<string | null>(null);

  const handleSyncJob = async (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    setSyncingJobId(job.id);
    try {
      const result = await calendarService.syncToCalendar({
        title: job.title,
        company: job.company,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: `Application for ${job.title} at ${job.company}.`
      });
      if (result.success) {
        // Success feedback would go here (e.g. toast)
      }
    } catch (error) {
      console.error("Sync failed", error);
    } finally {
      setSyncingJobId(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'high-match') return job.matchScore >= 90;
    if (activeFilter === 'remote') return job.location.toLowerCase() === 'remote';
    if (activeFilter === 'full-time') return job.type.toLowerCase() === 'full-time';
    
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight">
            Jobs <span className="text-[var(--sys-color-solidarityRed-base)]">Worklist</span>
          </h2>
          <p className="text-sm text-[var(--sys-color-worker-ash-base)] font-medium mt-1">
            Track and manage your target roles across the asymmetric landscape.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ScaffoldInput className="flex items-center px-3 h-11 w-64">
            <Search className="text-[var(--sys-color-worker-ash-base)] mr-2" size={18} />
            <input 
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-[var(--sys-color-paperWhite-base)] w-full"
            />
          </ScaffoldInput>
          <M3Button variant="filled" className="h-11">
            <Plus size={18} className="mr-2" />
            Add Job
          </M3Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
              activeFilter === chip.id 
                ? "bg-[var(--sys-color-solidarityRed-base)] border-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)]" 
                : "bg-[var(--sys-color-charcoalBackground-steps-2)] border-[var(--sys-color-outline-variant)] text-[var(--sys-color-worker-ash-base)] hover:border-[var(--sys-color-worker-ash-base)]"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <Placard className="overflow-hidden">
        <div className="p-4 border-b border-[var(--sys-color-outline-variant)] bg-[var(--sys-color-charcoalBackground-steps-3)]/50 grid grid-cols-12 gap-4 text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider hidden md:grid">
          <div className="col-span-5">Role & Company</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2 text-center">Match Score</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-right pr-4">Actions</div>
        </div>

        <div className="divide-y divide-[var(--sys-color-outline-variant)]/30">
          <AnimatePresence mode="popLayout">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Valve key={job.id} className="p-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-[var(--sys-color-charcoalBackground-steps-3)]/50 transition-colors group cursor-pointer"
                  >
                    <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-xl flex items-center justify-center text-[var(--sys-color-inkGold-base)] shrink-0 group-hover:scale-110 transition-transform">
                        <Briefcase size={24} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[var(--sys-color-paperWhite-base)] truncate group-hover:text-[var(--sys-color-solidarityRed-base)] transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-xs text-[var(--sys-color-worker-ash-base)] font-medium truncate">
                          {job.company} • {job.posted}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-xs text-[var(--sys-color-worker-ash-base)]">
                      <MapPin size={14} />
                      {job.location}
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded-full overflow-hidden hidden md:block">
                          <div 
                            className="h-full bg-[var(--sys-color-inkGold-base)]" 
                            style={{ width: `${job.matchScore}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-[var(--sys-color-inkGold-base)]">{job.matchScore}%</span>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <StatusBadge 
                        variant={
                          job.status === 'interviewing' ? 'success' : 
                          job.status === 'applied' ? 'warning' : 
                          'default'
                        }
                      >
                        {job.status}
                      </StatusBadge>
                    </div>

                    <div className="col-span-1 md:col-span-1 flex justify-end gap-2">
                      <button 
                        onClick={(e) => handleSyncJob(e, job)}
                        disabled={syncingJobId === job.id}
                        className="p-2 text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)] transition-colors"
                      >
                        {syncingJobId === job.id ? (
                          <div className="w-4 h-4 border-2 border-[var(--sys-color-worker-ash-base)] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Calendar size={18} />
                        )}
                      </button>
                      <button className="p-2 text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)] transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </motion.div>
                </Valve>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[var(--sys-color-charcoalBackground-steps-2)] rounded-full flex items-center justify-center text-[var(--sys-color-worker-ash-base)] opacity-20">
                  <Search size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--sys-color-paperWhite-base)]">No matches found</h3>
                  <p className="text-sm text-[var(--sys-color-worker-ash-base)] max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </Placard>

      {/* Quick Analysis Bar */}
      <Placard className="p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] border-2 border-dashed border-[var(--sys-color-outline-variant)]">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 bg-[var(--sys-color-solidarityRed-base)]/10 rounded-full flex items-center justify-center text-[var(--sys-color-solidarityRed-base)] shrink-0">
            <Zap size={24} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-[var(--sys-color-paperWhite-base)] uppercase tracking-wider">Asymmetric Pre-processor</h4>
            <p className="text-xs text-[var(--sys-color-worker-ash-base)] mt-1 font-medium">Paste a job URL to instantly extract requirements and calculate your match score.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <ScaffoldInput className="flex-1 md:w-80 flex items-center px-3 h-11">
              <input 
                type="text"
                placeholder="https://linkedin.com/jobs/..."
                value={pasteUrl}
                onChange={(e) => setPasteUrl(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-[var(--sys-color-paperWhite-base)] w-full"
              />
            </ScaffoldInput>
            <M3Button variant="filled" className="h-11 px-6">Analyze</M3Button>
          </div>
        </div>
      </Placard>
    </div>
  );
}
