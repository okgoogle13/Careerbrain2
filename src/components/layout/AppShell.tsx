import React from "react";
import { AppNavDrawer } from "./AppNavDrawer";
import { motion } from "motion/react";
import { User } from "firebase/auth";

type Props = {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  activeTab: 'DASHBOARD' | 'JOBS' | 'ATS_CHECK' | 'APPLICATIONS' | 'SUBMITTED_DOCS' | 'PROFILE' | 'SETTINGS';
  onTabChange: (tab: 'DASHBOARD' | 'JOBS' | 'ATS_CHECK' | 'APPLICATIONS' | 'SUBMITTED_DOCS' | 'PROFILE' | 'SETTINGS') => void;
};

import { LayoutDashboard, Briefcase, Target, FolderOpen, UserCircle, Settings, SearchCheck, History, Files, FileUser, LogOut } from "lucide-react";

export function AppShell({ children, user, onLogout, activeTab, onTabChange }: Props) {
  const navItems = [
    { id: 'DASHBOARD' as const, label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
    { id: 'JOBS' as const, label: 'Jobs', icon: <Briefcase size={24} /> },
    { id: 'ATS_CHECK' as const, label: 'ATS check', icon: <SearchCheck size={24} /> },
    { id: 'APPLICATIONS' as const, label: 'Applications', icon: <History size={24} /> },
    { id: 'SUBMITTED_DOCS' as const, label: 'Docs', icon: <Files size={24} /> },
    { id: 'PROFILE' as const, label: 'Profile', icon: <FileUser size={24} /> },
  ];

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Nav Rail — fixed narrow strip */}
      <nav style={{ width: 80, minWidth: 80, maxWidth: 80, height: '100vh', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', paddingTop: '16px' }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} onClick={() => onTabChange(item.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', width: '80px', cursor: 'pointer', borderRadius: '16px', background: isActive ? 'var(--md-sys-color-primary-container, rgba(0,188,212,0.15))' : 'transparent', color: isActive ? 'var(--md-sys-color-on-primary-container, #00BCD4)' : 'inherit' }}>
                {item.icon}
                <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Context/secondary panel */}
      <aside style={{ width: 260, minWidth: 260, maxWidth: 260, height: '100vh', flexShrink: 0, overflowY: 'auto', borderRight: '1px solid var(--md-sys-color-outline-variant)' }}>
        {/* contextual content: This needs to be populated by the active view or a constant sidebar */}
        <div className="p-4">
             {/* If this is meant to be a context panel per-page, it should probably be passed as a prop or rendered from the current page */}
        </div>
      </aside>

      {/* Main workspace */}
      <main style={{ flex: 1, minWidth: 0, height: '100vh', overflowY: 'auto', padding: '24px' }}>
        {children}
      </main>
    </div>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${active ? 'text-[var(--sys-color-signalGreen-base)]' : 'text-[var(--sys-color-worker-ash-base)]'}`}
    >
      <div className={`p-1 rounded-full transition-all ${active ? 'bg-[var(--sys-color-signalGreen-base)]/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
      {active && (
        <motion.div 
          layoutId="mobile-nav-indicator"
          className="absolute top-0 w-8 h-1 rounded-b-full bg-[var(--sys-color-signalGreen-base)]" 
        />
      )}
    </button>
  );
}
