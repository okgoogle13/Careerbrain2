import React from 'react';

export type M3CardVariant = 'elevated' | 'filled' | 'outlined';

interface M3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: M3CardVariant;
  children: React.ReactNode;
}

export const M3Card: React.FC<M3CardProps> = ({ variant = 'elevated', children, style, className = '', ...props }) => {
  const baseStyle: React.CSSProperties = {
    padding: '16px',
    overflow: 'hidden',
    transition: 'background 200ms ease, box-shadow 200ms ease, border 200ms ease',
  };

  const variants: Record<M3CardVariant, React.CSSProperties> = {
    elevated: {
      background: '#1E2A2B',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      borderRadius: '12px',
      border: 'none',
    },
    filled: {
      background: '#162020',
      boxShadow: 'none',
      borderRadius: '12px',
      border: 'none',
    },
    outlined: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '12px',
      boxShadow: 'none',
    }
  };

  return (
    <div
      style={{ ...baseStyle, ...variants[variant], ...style }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};
