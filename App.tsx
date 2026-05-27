
/**
 * CLASSIFICATION: Top-Level Shell / Router Shim
 * This file handles prototype-only navigation state. 
 * Canonical routing is owned by the main CareerCopilot repository.
 */
import React, { useState, useEffect } from 'react';
import { AppShell } from './src/components/layout/AppShell';
import { ApplyQuickWorkspaceReference } from './src/pages/ApplyQuickWorkspaceReference';
import { ProfileView } from './src/pages/ProfileView';
import { SettingsView } from './src/pages/SettingsView';
import { PastApplicationsReference } from './src/pages/PastApplicationsReference';
import { LibraryReferencePage } from './src/pages/LibraryReferencePage';
import { OptimisePage } from './src/pages/ImageStudioPage';
import { JobsWorklist } from './src/pages/JobsWorklist';
import { OnboardingPathBifurcation } from './src/pages/OnboardingPathBifurcation';
import { QuickApply } from './src/pages/QuickApply';
import { LandingPage } from './src/pages/LandingPage';
import { useUserStore } from './src/hooks/useUserStore';
import { JobInputPanel } from './src/components/feature/JobInputPanel';
import { auth, signIn, logout } from './services/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useChromeExtension } from './hooks/useChromeExtension';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { 
    hasCompletedOnboarding, 
    onboardingPath, 
    hasSetJobTarget,
    setHasSetJobTarget,
    setHasCompletedOnboarding,
    setOnboardingPath
  } = useUserStore();
  
  // Prototype-only activeTab state. Canonical routing belongs to the main repo.
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'JOBS' | 'ATS_CHECK' | 'APPLICATIONS' | 'SUBMITTED_DOCS' | 'PROFILE' | 'SETTINGS'>('DASHBOARD');
  const [initialJobData, setInitialJobData] = useState<{title: string, company: string, text: string} | null>(null);

  useEffect(() => {
    if (hasCompletedOnboarding && onboardingPath) {
      // Map onboarding paths to new tabs
      const pathMap: Record<string, any> = {
        'WORKSPACE': 'DASHBOARD',
        'QUICK_APPLY': 'JOBS',
        'PROFILE': 'PROFILE',
        'PAST': 'APPLICATIONS',
        'LIBRARY': 'SUBMITTED_DOCS',
        'OPTIMISE': 'ATS_CHECK'
      };
      setActiveTab(pathMap[onboardingPath] || 'DASHBOARD');
    }
  }, [hasCompletedOnboarding, onboardingPath]);
  const { isExtension } = useChromeExtension();

  // Auth Listener
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (timeoutId) clearTimeout(timeoutId);
    });

    // Fallback: if auth takes too long (e.g. config missing), stop loading
    timeoutId = setTimeout(() => {
      setIsAuthLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isExtension]);

  const handleLogin = async () => {
    try {
        await signIn();
    } catch (err) {
        console.error("Login failed", err);
    }
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
  };

  const handleLogout = async () => {
    await logout();
    setIsGuest(false);
    setActiveTab('DASHBOARD');
  };

  if (isAuthLoading) {
    return (
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--sys-color-charcoalBackground-base)' }}
        >
            <div 
              className="w-16 h-16 border-4 border-t-transparent animate-spin" 
              style={{ 
                borderColor: 'var(--sys-color-solidarityRed-base) transparent var(--sys-color-solidarityRed-base) var(--sys-color-solidarityRed-base)',
                borderRadius: 'var(--sys-shape-cutoutRiot01)'
              }}
            />
        </div>
    );
  }

  if (!user && !isGuest) {
    return <LandingPage onLogin={handleLogin} onGuestLogin={handleGuestLogin} />;
  }

  if ((user || isGuest) && !hasCompletedOnboarding) {
    return <OnboardingPathBifurcation />;
  }

  return (
    <AppShell user={user} onLogout={handleLogout} activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Canonical routing is owned by the main repo router. */}
      {activeTab === 'DASHBOARD' && <ApplyQuickWorkspaceReference initialJobData={initialJobData} user={user} onTabChange={setActiveTab} />}
      {activeTab === 'JOBS' && (
        <QuickApply 
          onAnalyze={async (title, company, text) => {
            setInitialJobData({ title, company, text });
            setActiveTab('DASHBOARD');
          }} 
          onGoToDashboard={() => setActiveTab('DASHBOARD')}
        />
      )}
      {activeTab === 'ATS_CHECK' && <OptimisePage user={user} />}
      {activeTab === 'APPLICATIONS' && <PastApplicationsReference user={user} />}
      {activeTab === 'SUBMITTED_DOCS' && <LibraryReferencePage user={user} />}
      {activeTab === 'PROFILE' && <ProfileView user={user} />}
      {activeTab === 'SETTINGS' && <SettingsView user={user} />}
    </AppShell>
  );
};

export default App;
