import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Compass, Layers3, Palette, Shapes, Type, Zap, Menu, X, Copy, ExternalLink } from 'lucide-react';
import { March, Megaphone, Placard, ScaffoldArea, ScaffoldInput, StatusBadge, Strike, KrIcon, Valve } from '../components/ui/Primitives';
import { PageHeader } from '../components/shared/PageHeader';
import { ArchetypeMorphPreviewer, LayoutSlopAuditor, MotionContractPanel, TypographyAxisValidator } from '../components/ui/M3ExpressiveComponents';
import { cn } from '../lib/utils';

const ARCHETYPE_MATRIX = [
  { archetype: 'Button', purpose: 'Action', base: 'Strike', active: 'Strike', loading: 'Strike', ambient: 'Strike', motion: 'Spring', components: 'Strike' },
  { archetype: 'Select', purpose: 'Choice', base: 'March', active: 'March', loading: 'March', ambient: 'March', motion: 'Spring', components: 'March' },
  { archetype: 'Dialog', purpose: 'Focus', base: 'Megaphone', active: 'Megaphone', loading: 'Megaphone', ambient: 'Megaphone', motion: 'Spring', components: 'Megaphone' },
  { archetype: 'Card', purpose: 'Container', base: 'Placard', active: 'Placard', loading: 'Placard', ambient: 'Placard', motion: 'Spring', components: 'Placard' },
  { archetype: 'Input', purpose: 'Data', base: 'Scaffold', active: 'Scaffold', loading: 'Scaffold', ambient: 'Scaffold', motion: 'Spring', components: 'Scaffold' },
  { archetype: 'Surface', purpose: 'Layout', base: 'Substrate', active: 'Substrate', loading: 'Substrate', ambient: 'Substrate', motion: 'Spring', components: 'Substrate' },
];

const COLOR_TOKENS = [
  { token: '--sys-color-charcoalBackground-base', swatch: '#1A1714', usage: 'substrate' },
  { token: '--sys-color-worker-ash-base', swatch: '#DAF6B3', usage: 'primary text' },
  { token: '--sys-color-solidarityRed-base', swatch: '#F14714', usage: 'critical actions' },
  { token: '--sys-color-inkGold-base', swatch: '#DAF674', usage: 'focus and halo' },
  { token: '--sys-color-kr-activistSmokeGreen-base', swatch: '#48DA8B', usage: 'success/growth' },
  { token: '--sys-color-stencilYellow-base', swatch: '#F6E748', usage: 'attention' },
  { token: '--sys-color-protestMetalBlue-base', swatch: '#48B3DA', usage: 'cool accent' },
  { token: '--sys-color-concreteGrey-base', swatch: '#A39B8F', usage: 'structure/dividers' },
];

const TYPE_SAMPLES = [
  { name: 'Proclamation', font: 'Libre Bodoni', scale: 'headline' },
  { name: 'Primary UI', font: 'Work Sans', scale: 'body' },
  { name: 'Display Editorial', font: 'Fraunces', scale: 'subhead' },
  { name: 'Field-Note', font: 'JetBrains Mono', scale: 'small' },
];

const SPACING_SCALE = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'];

const SHAPE_TOKENS = ['blockRiot01', 'blockRiot02', 'blockRiot03', 'marchSurge01', 'megaphoneCut01', 'placardTorn01'];

const MARCH_OPTIONS = [
  { value: 'resume', label: 'Resume' },
  { value: 'cover-letter', label: 'Cover Letter' },
  { value: 'ksc', label: 'KSC Response' }
];

export function StyleGuide() {
  const [marchValue, setMarchValue] = useState(MARCH_OPTIONS[0].value);
  const [showMegaphone, setShowMegaphone] = useState(false);
  const [scaffoldInput, setScaffoldInput] = useState('');
  const [scaffoldArea, setScaffoldArea] = useState('');
  const [valveEnabled, setValveEnabled] = useState(false);
  const [interactions, setInteractions] = useState({ typography: false, motion: false, quality: false, components: false, foundations: false });
  const [gritStatus, setGritStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  useEffect(() => {
    // Simulate loading grit SVG
    setGritStatus('loaded');
  }, []);

  const handleInteraction = (key: keyof typeof interactions) => {
    setInteractions(prev => ({ ...prev, [key]: true }));
  };

  const validationChecklist = useMemo(() => [
    { id: 'archetypes', label: 'Archetypes', pass: interactions.components },
    { id: 'typography', label: 'Typography', pass: interactions.typography },
    { id: 'gallery', label: 'Component Gallery', pass: interactions.components },
    { id: 'motion', label: 'Motion', pass: interactions.motion },
    { id: 'foundations', label: 'Foundations', pass: interactions.foundations },
    { id: 'quality', label: 'Quality', pass: interactions.quality },
  ], [interactions]);

  const isReady = validationChecklist.every(item => item.pass);
  const progress = (validationChecklist.filter(item => item.pass).length / validationChecklist.length) * 100;

  const sections = [
    { id: 'gate-definition', label: 'Gate Definition' },
    { id: 'typography', label: 'Typography' },
    { id: 'archetype-matrix', label: 'Archetype Matrix' },
    { id: 'component-gallery', label: 'Component Gallery' },
    { id: 'foundations', label: 'Foundations' },
    { id: 'motion-diagnostics', label: 'Motion Diagnostics' },
    { id: 'validation-checklist', label: 'Validation Checklist' },
  ];

  return (
    <div className="min-h-screen bg-[#1A1714] text-[#DAF6B3] relative font-sans">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.03'/></svg>")` }} />
      
      <div className="flex flex-row">
        <aside className="hidden 2xl:block w-64 sticky top-0 h-screen p-8 border-r border-[#A39B8F]">
          <h1 className="text-xl font-bold mb-2">KR STYLE GUIDE</h1>
          <p className="text-sm text-[#A39B8F] mb-8">Rev 2026.03.v9</p>
          <nav className="space-y-4">
            {sections.map(section => (
              <a key={section.id} href={`#${section.id}`} className="block text-sm hover:text-[#F14714]">{section.label}</a>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <StatusBadge className={cn("px-4 py-2 rounded-full", isReady ? "bg-[#48DA8B]" : "bg-[#F14714]")}>
              {isReady ? 'READY' : 'NOT READY'}
            </StatusBadge>
            <div className="w-full h-2 bg-[#A39B8F] rounded-full mt-4">
              <motion.div className="h-full bg-[#DAF674] rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-16 space-y-24">
          <PageHeader title="KR Solidarity UI Kit" subtitle="Living Style Guide" />

          <section id="gate-definition" className="scroll-mt-12">
            <Placard className="p-8 border border-[#A39B8F] rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Gate Definition</h2>
              <MotionContractPanel onInteraction={() => handleInteraction('motion')} />
            </Placard>
          </section>

          <section id="typography" className="scroll-mt-12" onMouseEnter={() => handleInteraction('typography')}>
            <h2 className="text-2xl font-bold mb-8">Typography System</h2>
            <div className="grid grid-cols-2 gap-8">
              {TYPE_SAMPLES.map(sample => (
                <div key={sample.name} className="p-6 border border-[#A39B8F] rounded-lg">
                  <h3 className="text-sm text-[#A39B8F]">{sample.name}</h3>
                  <p className="text-4xl font-serif mt-2">{sample.font}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="archetype-matrix" className="scroll-mt-12" onMouseEnter={() => handleInteraction('components')}>
            <h2 className="text-2xl font-bold mb-8">Archetype Matrix</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#A39B8F]">
                  <th className="p-4">Archetype</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Base Token</th>
                  <th className="p-4">Motion</th>
                </tr>
              </thead>
              <tbody>
                {ARCHETYPE_MATRIX.map(row => (
                  <tr key={row.archetype} className="border-b border-[#A39B8F]">
                    <td className="p-4">{row.archetype}</td>
                    <td className="p-4">{row.purpose}</td>
                    <td className="p-4">{row.base}</td>
                    <td className="p-4">{row.motion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section id="component-gallery" className="scroll-mt-12" onMouseEnter={() => handleInteraction('components')}>
            <h2 className="text-2xl font-bold mb-8">Component Gallery</h2>
            <div className="grid grid-cols-3 gap-6">
              <Placard className="p-6 border border-[#A39B8F] rounded-lg">Button Variants</Placard>
              <Placard className="p-6 border border-[#A39B8F] rounded-lg">Status Badges</Placard>
              <Placard className="p-6 border border-[#A39B8F] rounded-lg">Input + Textarea</Placard>
            </div>
          </section>

          <section id="foundations" className="scroll-mt-12" onMouseEnter={() => handleInteraction('foundations')}>
            <h2 className="text-2xl font-bold mb-8">Foundations Atlas</h2>
            <div className="grid grid-cols-4 gap-4">
              {COLOR_TOKENS.map(token => (
                <div key={token.token} className="p-4 border border-[#A39B8F] rounded-lg">
                  <div className="w-12 h-12 rounded-full mb-2" style={{ backgroundColor: token.swatch }} />
                  <p className="text-xs">{token.token}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="motion-diagnostics" className="scroll-mt-12" onMouseEnter={() => handleInteraction('motion')}>
            <h2 className="text-2xl font-bold mb-8">Motion Diagnostics</h2>
            <div className="grid grid-cols-2 gap-6">
              <ArchetypeMorphPreviewer onInteraction={() => handleInteraction('motion')} />
              <LayoutSlopAuditor onInteraction={() => handleInteraction('quality')} />
              <TypographyAxisValidator onInteraction={() => handleInteraction('typography')} />
            </div>
          </section>

          <section id="validation-checklist" className="scroll-mt-12">
            <h2 className="text-2xl font-bold mb-8">Validation Checklist</h2>
            <div className="space-y-4">
              {validationChecklist.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-[#A39B8F] rounded-lg">
                  {item.pass ? <CheckCircle2 className="text-[#48DA8B]" /> : <AlertCircle className="text-[#F14714]" />}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      
      <AnimatePresence>
        {showMegaphone && <Megaphone>System Announcement</Megaphone>}
      </AnimatePresence>
    </div>
  );
}
