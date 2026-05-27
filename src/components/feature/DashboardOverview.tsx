import React, { useState } from 'react';
import { M3Button } from '../ui/M3Button';
import { M3Type } from '../../theme/typography';
import { GettingStartedChecklist } from './GettingStartedChecklist';
import { useUserStore } from '../../hooks/useUserStore';
import { 
  Link, 
  ArrowRight, 
  FileText, 
  LayoutDashboard, 
  History, 
  Files, 
  FileUser, 
  Plus, 
  Search, 
  Zap, 
  User,
  TrendingUp,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Placard, StatusBadge, Valve } from '../ui/Primitives';

const trendData = [78, 85, 92, 88, 95];
const activityData = [2, 5, 3, 8, 4, 1, 0];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Sparkline({ data }: { data: number[] }) {
  const width = 400;
  const height = 100;
  const padding = 10;
  const max = 100;
  const min = 0;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((d - min) / (max - min)) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="var(--sys-color-inkGold-base)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((d - min) / (max - min)) * (height - padding * 2) - padding;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="6"
            fill="var(--sys-color-inkGold-base)"
            stroke="var(--sys-color-charcoalBackground-steps-2)"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}

function SimpleBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end justify-between h-full gap-2">
      {data.map((d, i) => {
        const height = (d / max) * 100;
        const isCritical = d > 4;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full rounded-t-lg transition-all"
              style={{ 
                height: `${height}%`, 
                backgroundColor: isCritical ? 'var(--sys-color-solidarityRed-base)' : 'var(--sys-color-charcoalBackground-steps-4)' 
              }}
            />
            <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)]">{days[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

interface DashboardOverviewProps {
  onTabChange?: (tab: 'DASHBOARD' | 'JOBS' | 'ATS_CHECK' | 'APPLICATIONS' | 'SUBMITTED_DOCS' | 'PROFILE' | 'SETTINGS') => void;
}

export function DashboardOverview({ onTabChange }: DashboardOverviewProps) {
  const { setPendingJobUrl } = useUserStore();
  const [jobUrl, setJobUrl] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const handlePasteJob = () => {
    if (jobUrl.trim()) {
      setPendingJobUrl(jobUrl);
      onTabChange?.('ATS_CHECK');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight">Good morning</h1>
          <p className="text-sm text-[var(--sys-color-worker-ash-base)] font-medium">{currentDate}</p>
        </div>
        <div className="flex gap-3">
          <M3Button variant="tonal" onClick={() => onTabChange?.('PROFILE')}>
            <User size={16} className="mr-2" />
            Profile
          </M3Button>
          <M3Button variant="filled" onClick={() => onTabChange?.('JOBS')}>
            <Plus size={16} className="mr-2" />
            New Application
          </M3Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total applications" 
          value="42" 
          change="+12% this month" 
          icon={<History size={18} />}
          trend="up"
        />
        <StatCard 
          label="Interview rate" 
          value="24%" 
          change="+5% from last month" 
          icon={<Calendar size={18} />}
          trend="up"
        />
        <StatCard 
          label="Avg. ATS score" 
          value="88" 
          change="+3 pts improvement" 
          icon={<TrendingUp size={18} />}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <GettingStartedChecklist />

          <Placard className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-[var(--sys-color-paperWhite-base)]">ATS score trend</h3>
                <p className="text-sm text-[var(--sys-color-worker-ash-base)]">Performance across your last 5 applications</p>
              </div>
              <StatusBadge variant="success">Live tracking</StatusBadge>
            </div>

            <div className="h-[200px] w-full mt-4">
              <Sparkline data={trendData} />
              <div className="flex justify-between mt-4 px-2">
                {['App 1', 'App 2', 'App 3', 'App 4', 'App 5'].map(label => (
                  <span key={label} className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)]">{label}</span>
                ))}
              </div>
            </div>
          </Placard>

          {/* Quick Actions Grid */}
          <div>
            <h3 className="text-sm font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionCard 
                label="New Application" 
                icon={<Plus size={20} />} 
                onClick={() => onTabChange?.('JOBS')} 
                color="solidarityRed"
              />
              <QuickActionCard 
                label="Scan Resume" 
                icon={<Search size={20} />} 
                onClick={() => onTabChange?.('ATS_CHECK')} 
                color="inkGold"
              />
              <QuickActionCard 
                label="Check ATS" 
                icon={<Zap size={20} />} 
                onClick={() => onTabChange?.('ATS_CHECK')} 
                color="stencilYellow"
              />
              <QuickActionCard 
                label="Update Profile" 
                icon={<User size={20} />} 
                onClick={() => onTabChange?.('PROFILE')} 
                color="workerAsh"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <Placard className="p-8 relative overflow-hidden border-2 border-[var(--sys-color-inkGold-base)]/20">
            <div className="flex items-center gap-3 mb-4">
              <Link className="text-[var(--sys-color-inkGold-base)]" size={24} />
              <h3 className="text-lg font-bold text-[var(--sys-color-paperWhite-base)]">Paste job URL</h3>
            </div>
            <p className="text-sm text-[var(--sys-color-worker-ash-base)] mb-6 leading-relaxed">
              Ready to analyze a new role? Drop the link here to start the asymmetric pre-processor.
            </p>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="https://linkedin.com/jobs/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="flex-1 px-4 py-3 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-xl text-sm text-[var(--sys-color-paperWhite-base)] focus:outline-none focus:border-[var(--sys-color-inkGold-base)] transition-colors"
              />
              <M3Button variant="filled" onClick={handlePasteJob} style={{ padding: '0 16px' }}>
                <ArrowRight size={24} />
              </M3Button>
            </div>
          </Placard>

          <Placard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--sys-color-paperWhite-base)]">Activity</h3>
                <p className="text-xs text-[var(--sys-color-worker-ash-base)]">Applications this week</p>
              </div>
              <StatusBadge variant="default">Weekly</StatusBadge>
            </div>
            <div className="h-[120px] w-full">
              <SimpleBarChart data={activityData} />
            </div>
          </Placard>

          <YourDocumentsWidget />
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ label, icon, onClick, color }: { label: string, icon: React.ReactNode, onClick: () => void, color: string }) {
  const colorMap: Record<string, string> = {
    solidarityRed: 'var(--sys-color-solidarityRed-base)',
    inkGold: 'var(--sys-color-inkGold-base)',
    stencilYellow: 'var(--sys-color-stencilYellow-base)',
    workerAsh: 'var(--sys-color-worker-ash-base)',
  };

  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] rounded-2xl hover:border-[var(--sys-color-worker-ash-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-3)] transition-all group"
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${colorMap[color]}20`, color: colorMap[color] }}
      >
        {icon}
      </div>
      <span className="text-[10px] font-bold text-[var(--sys-color-paperWhite-base)] uppercase tracking-wider text-center">
        {label}
      </span>
    </button>
  );
}

function YourDocumentsWidget() {
  return (
    <Placard className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="text-[var(--sys-color-solidarityRed-base)]" size={24} />
          <h3 className="text-lg font-bold text-[var(--sys-color-paperWhite-base)]">Your documents</h3>
        </div>
        <M3Button variant="text" style={{ padding: '0 8px', minHeight: '32px' }}>View all</M3Button>
      </div>
      <div className="space-y-3">
        <DocumentItem name="Master_Resume_2026.pdf" type="Resume" date="Mar 20" />
        <DocumentItem name="Cover_Letter_Generic.docx" type="Cover letter" date="Mar 18" />
        <DocumentItem name="Portfolio_Case_Studies.pdf" type="Portfolio" date="Mar 15" />
      </div>
    </Placard>
  );
}

function DocumentItem({ name, type, date }: { name: string, type: string, date: string }) {
  return (
    <div className="p-3 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)]/30 rounded-xl flex items-center justify-between group hover:border-[var(--sys-color-solidarityRed-base)]/50 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded-lg flex items-center justify-center text-[var(--sys-color-worker-ash-base)]">
          <FileText size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--sys-color-paperWhite-base)] truncate max-w-[140px]">{name}</p>
          <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] font-medium">{type}</p>
        </div>
      </div>
      <div className="text-[10px] text-[var(--sys-color-worker-ash-base)] font-bold">{date}</div>
    </div>
  );
}

function StatCard({ label, value, change, icon, trend }: { label: string, value: string, change: string, icon: React.ReactNode, trend: 'up' | 'down' }) {
  return (
    <Placard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--sys-color-charcoalBackground-steps-3)] flex items-center justify-center text-[var(--sys-color-worker-ash-base)]">
          {icon}
        </div>
        <StatusBadge variant={trend === 'up' ? 'success' : 'error'}>
          {trend === 'up' ? '↑' : '↓'} {change.split(' ')[0]}
        </StatusBadge>
      </div>
      <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)]">{value}</h4>
        <span className="text-[10px] text-[var(--sys-color-worker-ash-base)] font-bold">{change.split(' ').slice(1).join(' ')}</span>
      </div>
    </Placard>
  );
}
