export interface TemplateStyle {
  id: string;
  name: string;
  layout: 'single' | 'two-column';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontSans: string;
  fontSerif: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
  bgLight: string;
}

export const RESUME_TEMPLATES: TemplateStyle[] = [
  { id: 'ats-executive-modern', name: 'Executive Modern (ATS)', layout: 'single', primaryColor: '#0f172a', secondaryColor: '#334155', accentColor: '#0ea5e9', fontSans: "'Inter', sans-serif", fontSerif: "'Inter', sans-serif", headingColor: '#0f172a', textColor: '#1e293b', borderColor: '#cbd5e1', bgLight: '#ffffff' },
  { id: 'ats-classic-professional', name: 'Classic Professional (ATS)', layout: 'single', primaryColor: '#1e3a8a', secondaryColor: '#1e40af', accentColor: '#2563eb', fontSans: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSerif: "'Georgia', serif", headingColor: '#1e3a8a', textColor: '#111827', borderColor: '#d1d5db', bgLight: '#ffffff' },
  { id: 'ats-tech-minimalist', name: 'Tech Minimalist (ATS)', layout: 'single', primaryColor: '#171717', secondaryColor: '#404040', accentColor: '#10b981', fontSans: "'Roboto', sans-serif", fontSerif: "'Roboto', sans-serif", headingColor: '#171717', textColor: '#262626', borderColor: '#e5e5e5', bgLight: '#ffffff' },
  { id: 'ats-bold-impact', name: 'Bold Impact (ATS)', layout: 'single', primaryColor: '#7f1d1d', secondaryColor: '#991b1b', accentColor: '#dc2626', fontSans: "'Open Sans', sans-serif", fontSerif: "'Merriweather', serif", headingColor: '#7f1d1d', textColor: '#111827', borderColor: '#fca5a5', bgLight: '#ffffff' },
  { id: 'ats-elegant-serif', name: 'Elegant Serif (ATS)', layout: 'single', primaryColor: '#064e3b', secondaryColor: '#065f46', accentColor: '#059669', fontSans: "'Lato', sans-serif", fontSerif: "'Playfair Display', serif", headingColor: '#064e3b', textColor: '#1f2937', borderColor: '#a7f3d0', bgLight: '#ffffff' },
];
