import React from 'react';

export type M3ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';

interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: M3ButtonVariant;
  children: React.ReactNode;
}

export const M3Button: React.FC<M3ButtonProps> = ({ variant = 'filled', children, style, className = '', ...props }) => {
  const baseStyle: React.CSSProperties = {
    fontWeight: 500,
    fontSize: '14px',
    letterSpacing: '0.1px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background 200ms ease',
    border: 'none',
    outline: 'none',
  };

  const variants: Record<M3ButtonVariant, React.CSSProperties> = {
    filled: {
      background: '#00BCD4',
      color: '#000',
      borderRadius: '20px',
      padding: '0 24px',
      minHeight: '40px',
    },
    tonal: {
      background: 'rgba(0,188,212,0.12)',
      color: '#00BCD4',
      borderRadius: '20px',
      padding: '0 24px',
      minHeight: '40px',
    },
    outlined: {
      background: 'transparent',
      border: '1px solid rgba(0,188,212,0.5)',
      color: '#00BCD4',
      borderRadius: '20px',
      padding: '0 24px',
      minHeight: '40px',
    },
    text: {
      background: 'transparent',
      color: '#00BCD4',
      padding: '0 12px',
      minHeight: '40px',
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const getHoverStyle = (): React.CSSProperties => {
    if (!isHovered) return {};
    switch (variant) {
      case 'filled': return { background: '#00ACC1' };
      case 'tonal': return { background: 'rgba(0,188,212,0.20)' };
      case 'outlined': return { background: 'rgba(0,188,212,0.08)' };
      case 'text': return { background: 'rgba(0,188,212,0.08)' };
      default: return {};
    }
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...getHoverStyle(), ...style }}
      className={className}
      onMouseEnter={(e) => { setIsHovered(true); props.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setIsHovered(false); props.onMouseLeave?.(e); }}
      {...props}
    >
      {children}
    </button>
  );
};
