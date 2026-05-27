import React from 'react';
import { cn } from '../../lib/utils';

export const March = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-[var(--sys-shape-radius-marchOpen)]", className)}>
    {children}
  </div>
);

export const Megaphone = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-[var(--sys-shape-radius-megaphoneBase)]", className)}>
    {children}
  </div>
);

export const Placard = ({ children, className, key }: { children?: React.ReactNode; className?: string; key?: React.Key }) => (
  <div className={cn("rounded-[var(--sys-shape-radius-slab)] bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] shadow-[var(--sys-shadow-elevation2Placard)]", className)}>
    {children}
  </div>
);

export const ScaffoldArea = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-[var(--sys-shape-radius-md)] bg-[var(--sys-color-charcoalBackground-steps-1)] border border-[var(--sys-color-outline-variant)]", className)}>
    {children}
  </div>
);

export const ScaffoldInput = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-[var(--sys-shape-scaffoldFrame01)] bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)]", className)}>
    {children}
  </div>
);

export const StatusBadge = ({ children, className, variant = 'default' }: { children?: React.ReactNode; className?: string; variant?: 'default' | 'success' | 'error' | 'warning' }) => {
  const variantClasses = {
    default: "bg-[var(--sys-color-charcoalBackground-steps-3)] text-[var(--sys-color-worker-ash-base)]",
    success: "bg-[var(--sys-color-kr-activistSmokeGreen-base)]/20 text-[var(--sys-color-kr-activistSmokeGreen-base)]",
    error: "bg-[var(--sys-color-kr-charcoalRed-base)]/20 text-[var(--sys-color-kr-charcoalRed-base)]",
    warning: "bg-[var(--sys-color-stencilYellow-base)]/20 text-[var(--sys-color-stencilYellow-base)]",
  };
  
  return (
    <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", variantClasses[variant], className)}>
      {children}
    </div>
  );
};

export const Strike = ({ children, className, onClick, disabled }: { children?: React.ReactNode; className?: string; onClick?: () => void; disabled?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "px-6 py-3 rounded-[var(--sys-shape-blockRiot03)] bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)] font-bold transition-all hover:scale-[var(--sys-motion-interactions-hover-button-scale)] active:scale-[var(--sys-motion-interactions-press-button-scale)] disabled:opacity-50 disabled:pointer-events-none",
      className
    )}
  >
    {children}
  </button>
);

export const KrIcon = ({ name, className }: { name: string; className?: string }) => (
  <div className={cn("inline-flex items-center justify-center", className)}>
    {/* Simple icon placeholder or mapping could go here */}
    <span className="text-[10px] uppercase font-bold">{name}</span>
  </div>
);

export const Valve = ({ children, className, key }: { children?: React.ReactNode; className?: string; key?: React.Key }) => (
  <div className={cn("p-4 border-l-2 border-[var(--sys-color-inkGold-base)] bg-[var(--sys-color-charcoalBackground-steps-3)]/30", className)}>
    {children}
  </div>
);
