import React, { useState } from 'react';
import { User } from 'firebase/auth';

type TabType = 'DASHBOARD' | 'JOBS' | 'ATS_CHECK' | 'APPLICATIONS' | 'SUBMITTED_DOCS' | 'PROFILE' | 'SETTINGS';

interface AppNavDrawerProps {
  user: User | null;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout: () => void;
}

export const AppNavDrawer: React.FC<AppNavDrawerProps> = ({ user, activeTab, onTabChange, onLogout }) => {
  const [isLarge, setIsLarge] = useState(window.innerWidth >= 900);

  React.useEffect(() => {
    const handleResize = () => setIsLarge(window.innerWidth >= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Top App Bar (Only visible if < 900px) */}
      {!isLarge && (
        <div className="fixed top-0 left-0 right-0 h-[64px] px-4 flex items-center justify-between z-40 border-b"
          style={{ 
            background: 'var(--sys-color-charcoalBackground-base)',
            borderColor: 'var(--sys-color-outline-variant)'
          }}
        >
          <h1 className="type-solidarityProtest text-[var(--sys-color-paperWhite-base)] text-xl">
            Career<span className="text-[var(--sys-color-signalGreen-base)]">Copilot</span>
          </h1>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--sys-color-outline-variant)]">
            <img 
              src={user?.photoURL || "https://picsum.photos/seed/worker/100/100"} 
              alt="Avatar" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </>
  );
};

