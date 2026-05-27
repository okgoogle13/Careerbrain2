import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { JobInputPanel } from '../components/feature/JobInputPanel';
import { useUserStore } from '../hooks/useUserStore';
import { M3Card } from '../components/ui/M3Card';
import { M3Button } from '../components/ui/M3Button';
import { M3Type } from '../theme/typography';

interface QuickApplyProps {
  onAnalyze: (title: string, company: string, text: string) => Promise<void>;
  onGoToDashboard?: () => void;
}

const MOCK_JOBS = [
  { id: '1', title: 'Senior Frontend Engineer', company: 'TechCorp', location: 'Remote' },
  { id: '2', title: 'Product Designer', company: 'DesignStudio', location: 'New York, NY' },
  { id: '3', title: 'Full Stack Developer', company: 'StartupInc', location: 'San Francisco, CA' },
];

export const QuickApply: React.FC<QuickApplyProps> = ({ onAnalyze, onGoToDashboard }) => {
  const { setHasSetJobTarget } = useUserStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string>(MOCK_JOBS[0].id);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isDesktop = windowWidth >= 900;

  const handleAnalyze = async (title: string, company: string, text: string) => {
    setIsAnalyzing(true);
    try {
      await onAnalyze(title, company, text);
      setHasSetJobTarget(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const jobListContent = (
    <div className="flex flex-col gap-3 overflow-y-auto h-full pr-2">
      <h2 style={{ ...M3Type.labelLarge, color: 'var(--sys-color-worker-ash-base)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent activity</h2>
      {MOCK_JOBS.map(job => {
        const isActive = job.id === activeJobId;
        const isHovered = job.id === hoveredJobId;
        return (
          <M3Card
            key={job.id}
            variant={isHovered ? 'filled' : 'elevated'}
            onClick={() => setActiveJobId(job.id)}
            onMouseEnter={() => setHoveredJobId(job.id)}
            onMouseLeave={() => setHoveredJobId(null)}
            className="cursor-pointer transition-all p-4"
            style={{
              borderLeft: isActive ? '3px solid var(--sys-color-solidarityRed-base)' : '3px solid transparent',
              background: isActive ? 'var(--sys-color-charcoalBackground-steps-2)' : undefined
            }}
          >
            <h3 style={{ ...M3Type.titleSmall, color: 'var(--sys-color-paperWhite-base)' }} className="truncate">{job.title}</h3>
            <p style={{ ...M3Type.labelSmall, color: 'var(--sys-color-worker-ash-base)' }} className="truncate">{job.company}</p>
          </M3Card>
        );
      })}
    </div>
  );

  const quickApplyContent = (
    <div className="flex flex-col w-full max-w-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full"
      >
        <JobInputPanel 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing} 
        />
      </motion.div>
      
      <div className="mt-8 text-center flex items-center justify-center gap-6">
        <div className="h-px bg-[var(--sys-color-outline-variant)] flex-1 hidden md:block" />
        <M3Button 
          variant="text"
          onClick={() => {
            setHasSetJobTarget(true);
            if (onGoToDashboard) onGoToDashboard();
          }}
          style={{ opacity: 0.6 }}
        >
          Skip to dashboard →
        </M3Button>
        <div className="h-px bg-[var(--sys-color-outline-variant)] flex-1 hidden md:block" />
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen flex flex-col p-4 md:p-8 lg:p-12 relative overflow-hidden"
      style={{ background: 'var(--sys-color-charcoalBackground-base)' }}
    >
      {/* Grit Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      <div className="w-full max-w-7xl mx-auto relative z-10 flex-1 flex flex-col justify-center">
        {isDesktop ? (
          <div className="flex flex-row gap-12 h-full max-h-[700px] items-center">
            <div className="w-80 h-full flex flex-col border-r border-[var(--sys-color-outline-variant)] pr-8 py-8">
              {jobListContent}
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
              {quickApplyContent}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-12 w-full max-w-lg mx-auto">
            <div className="w-full">
              {quickApplyContent}
            </div>
            <div className="w-full">
              {jobListContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

