import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WorkspaceLayout } from "../components/layout/WorkspaceLayout";
import { SolidarityPageLayout } from "../components/layout/SolidarityPageLayout";
import { M3Card } from "../components/ui/M3Card";
import { M3Button } from "../components/ui/M3Button";
import { M3Type } from "../theme/typography";
import { 
  FileText, 
  Mail, 
  CheckSquare, 
  MessageSquare, 
  Users, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  RefreshCw,
  ArrowRight,
  UserCircle,
  Target,
  Zap,
  ShieldCheck,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";
import { Placard, Strike, StatusBadge } from "../components/ui/Primitives";
import { useUserStore } from "../hooks/useUserStore";

export function LibraryReferencePage() {
  const [activeTab, setActiveTab] = useState("resume");
  const [step, setStep] = useState(1);
  const [letterStyle, setLetterStyle] = useState("Professional");
  const { setHasGeneratedDocument } = useUserStore();

  const tabs = [
    { id: "resume", label: "Resume builder", icon: <FileText size={18} /> },
    { id: "cover", label: "Cover letter", icon: <Mail size={18} /> },
    { id: "ksc", label: "KSC responses", icon: <CheckSquare size={18} /> },
    { id: "studio", label: "Image Studio (Preview)", icon: <Sparkles size={18} /> },
    { id: "interview", label: "Interview prep", icon: <MessageSquare size={18} /> },
    { id: "network", label: "Networking", icon: <Users size={18} /> },
  ];

  const styles = ["Professional", "Creative", "Concise", "Impact-driven"];

  const handleGenerate = () => {
    setStep(3);
    setHasGeneratedDocument(true);
  };

  return (
    <SolidarityPageLayout>
      <WorkspaceLayout>
        <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
          {/* LEFT PANE: Navigation */}
          <div className="w-full md:w-[260px] flex-shrink-0 p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] flex flex-col gap-8 overflow-y-auto rounded-t-[28px] md:rounded-l-[28px] md:rounded-tr-none md:rounded-br-none border-r border-[var(--sys-color-outline-variant)]">
            <h2 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight">Documents</h2>
            
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setStep(1);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? "bg-[var(--sys-color-charcoalBackground-steps-3)] text-[var(--sys-color-paperWhite-base)] font-bold border border-[var(--sys-color-outline-variant)]"
                      : "text-[var(--sys-color-worker-ash-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-3)]/50"
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-[var(--sys-color-outline-variant)]">
              <div className="p-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-2xl border border-[var(--sys-color-inkGold-base)]/20">
                <p className="text-[10px] text-[var(--sys-color-inkGold-base)] font-bold mb-2">Asymmetric power</p>
                <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] leading-relaxed">Tailor every document to the job description for a 400% higher interview rate.</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Content */}
          <div className="flex-1 min-width-0 bg-[var(--sys-color-charcoalBackground-steps-1)] flex flex-col overflow-hidden rounded-b-[28px] md:rounded-r-[28px] md:rounded-tl-none md:rounded-bl-none">
            {/* STEPPER HEADER */}
            <div className="px-8 py-4 bg-[var(--sys-color-charcoalBackground-steps-2)] border-b border-[var(--sys-color-outline-variant)] flex items-center justify-between">
              <div className="flex items-center gap-8">
                <StepIndicator current={step} step={1} label="Tailor" />
                <ChevronRight size={16} className="text-[var(--sys-color-outline-variant)]" />
                <StepIndicator current={step} step={2} label="Generate" />
                <ChevronRight size={16} className="text-[var(--sys-color-outline-variant)]" />
                <StepIndicator current={step} step={3} label="Review" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)]">Status:</span>
                <span className="text-[10px] font-bold text-[var(--sys-color-signalGreen-base)]">Ready to tailor</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-5xl mx-auto"
                >
                  {activeTab === "resume" && (
                    <ResumeStepContent step={step} onNext={() => setStep(2)} onGenerate={handleGenerate} />
                  )}
                  {activeTab === "cover" && (
                    <CoverLetterStepContent 
                      step={step} 
                      onNext={() => setStep(2)} 
                      onGenerate={handleGenerate}
                      letterStyle={letterStyle}
                      setLetterStyle={setLetterStyle}
                      styles={styles}
                    />
                  )}
                  {activeTab === "ksc" && (
                    <KSCStepContent step={step} onNext={() => setStep(2)} onGenerate={handleGenerate} />
                  )}
                  {activeTab === "studio" && (
                    <ImageStudioContent />
                  )}
                  {["interview", "network"].includes(activeTab) && (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-[var(--sys-color-charcoalBackground-steps-3)] flex items-center justify-center mb-6 border border-[var(--sys-color-outline-variant)]">
                        <Sparkles size={40} className="text-[var(--sys-color-inkGold-base)] opacity-40" />
                      </div>
                      <h2 className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight mb-2">Coming soon</h2>
                      <p className="text-[var(--sys-color-worker-ash-base)] max-w-md mx-auto mb-8">
                        We're currently optimizing this feature to ensure your interview and networking strategies are as impactful as possible.
                      </p>
                      <M3Button variant="outlined" onClick={() => setActiveTab("resume")}>Back to resume builder</M3Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    </SolidarityPageLayout>
  );
}

function StepIndicator({ current, step, label }: { current: number, step: number, label: string }) {
  const isActive = current === step;
  const isCompleted = current > step;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
        isActive 
          ? "bg-[var(--sys-color-solidarityRed-base)] border-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)]" 
          : isCompleted
          ? "bg-[var(--sys-color-signalGreen-base)] border-[var(--sys-color-signalGreen-base)] text-[var(--sys-color-paperWhite-base)]"
          : "bg-transparent border-[var(--sys-color-outline-variant)] text-[var(--sys-color-worker-ash-base)]"
      }`}>
        {isCompleted ? <CheckCircle2 size={12} /> : step}
      </div>
      <span className={`text-[10px] font-bold ${isActive ? "text-[var(--sys-color-paperWhite-base)]" : "text-[var(--sys-color-worker-ash-base)]"}`}>
        {label}
      </span>
    </div>
  );
}

function ResumeStepContent({ step, onNext, onGenerate }: any) {
  if (step === 1) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>Tailor your bullets</h2>
          <M3Button variant="filled" onClick={onNext}>Next step</M3Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <BulletItem 
            original="Led a team of 5 developers to build a new e-commerce platform."
            suggestion="Spearheaded a cross-functional team of 5 to architect a scalable e-commerce solution, improving checkout conversion by 15%."
          />
          <BulletItem 
            original="Optimized database queries for better performance."
            suggestion="Engineered advanced SQL optimizations reducing query latency by 40% and cutting server costs by $2k/month."
          />
          <BulletItem 
            original="Collaborated with designers to implement UI components."
            suggestion="Partnered with UX/UI designers to develop a reusable component library in React, accelerating frontend delivery by 30%."
          />
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-8">
        <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>Generate final draft</h2>
        <M3Card variant="elevated" className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="px-3 py-1 bg-[var(--sys-color-signalGreen-base)]/10 border border-[var(--sys-color-signalGreen-base)]/30 rounded-full">
              <span className="text-[8px] font-bold text-[var(--sys-color-signalGreen-base)]">ATS optimized</span>
            </div>
            <div className="px-3 py-1 bg-[var(--sys-color-inkGold-base)]/10 border border-[var(--sys-color-inkGold-base)]/30 rounded-full">
              <span className="text-[8px] font-bold text-[var(--sys-color-inkGold-base)]">High impact</span>
            </div>
          </div>
          <div className="space-y-4 opacity-50">
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-3/4" />
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-full" />
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-5/6" />
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-full" />
          </div>
          <div className="mt-12 flex justify-center">
            <M3Button 
              variant="filled" 
              onClick={onGenerate} 
              className="px-12 py-6 text-base"
            >
              <Sparkles size={20} className="mr-2" />
              Generate final resume
            </M3Button>
          </div>
        </M3Card>
      </div>
    );
  }

  return <FinalReviewContent type="resume" />;
}

function BulletItem({ original, suggestion }: { original: string, suggestion: string }) {
  const [isApplied, setIsApplied] = useState(false);

  return (
    <M3Card variant="outlined" className="p-6 group">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] mb-2">Original</p>
          <p className="text-sm text-[var(--sys-color-worker-ash-base)] italic">{original}</p>
        </div>
        <div className="hidden md:block w-px bg-[var(--sys-color-outline-variant)] opacity-30" />
        <div className="flex-1 relative">
          <div className="absolute -top-2 -right-2">
            <div className="px-2 py-0.5 bg-[var(--sys-color-inkGold-base)] text-[var(--sys-color-charcoalBackground-base)] text-[8px] font-bold rounded-full flex items-center gap-1">
              <Sparkles size={8} /> AI suggestion
            </div>
          </div>
          <p className="text-[10px] font-bold text-[var(--sys-color-inkGold-base)] mb-2">Optimized for impact</p>
          <p className="text-sm text-[var(--sys-color-paperWhite-base)] font-medium">{suggestion}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--sys-color-outline-variant)]/30 flex justify-end">
        <M3Button 
          variant={isApplied ? "filled" : "outlined"}
          onClick={() => setIsApplied(!isApplied)}
          className={isApplied ? "bg-[var(--sys-color-signalGreen-base)] text-white" : ""}
        >
          {isApplied ? "Applied ✓" : "Apply suggestion"}
        </M3Button>
      </div>
    </M3Card>
  );
}

function CoverLetterStepContent({ step, onNext, onGenerate, letterStyle, setLetterStyle, styles }: any) {
  if (step === 1) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>Configure style</h2>
          <M3Button variant="filled" onClick={onNext}>Next step</M3Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {styles.map((s: string) => (
            <button 
              key={s}
              onClick={() => setLetterStyle(s)}
              className={`p-6 rounded-2xl border transition-all text-left group ${
                letterStyle === s 
                  ? "bg-[var(--sys-color-inkGold-base)]/10 border-[var(--sys-color-inkGold-base)]" 
                  : "bg-[var(--sys-color-charcoalBackground-steps-2)] border-[var(--sys-color-outline-variant)] hover:border-[var(--sys-color-worker-ash-base)]"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                letterStyle === s ? "bg-[var(--sys-color-inkGold-base)] text-[var(--sys-color-charcoalBackground-base)]" : "bg-[var(--sys-color-charcoalBackground-steps-3)] text-[var(--sys-color-worker-ash-base)] group-hover:text-[var(--sys-color-paperWhite-base)]"
              }`}>
                <RefreshCw size={20} />
              </div>
              <h4 className={`text-sm font-bold tracking-tight ${letterStyle === s ? "text-[var(--sys-color-paperWhite-base)]" : "text-[var(--sys-color-worker-ash-base)]"}`}>{s}</h4>
              <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] mt-2">Optimized for {s.toLowerCase()} tone and structure.</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-8">
        <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>Generate letter</h2>
        <M3Card variant="elevated" className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="px-3 py-1 bg-[var(--sys-color-inkGold-base)]/10 border border-[var(--sys-color-inkGold-base)]/30 rounded-full">
              <span className="text-[8px] font-bold text-[var(--sys-color-inkGold-base)]">{letterStyle} style</span>
            </div>
            <div className="px-3 py-1 bg-[var(--sys-color-solidarityRed-base)]/10 border border-[var(--sys-color-solidarityRed-base)]/30 rounded-full">
              <span className="text-[8px] font-bold text-[var(--sys-color-solidarityRed-base)]">Tailored to job</span>
            </div>
          </div>
          <div className="space-y-4 opacity-50">
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-1/4" />
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-full" />
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-full" />
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-3/4" />
          </div>
          <div className="mt-12 flex justify-center">
            <M3Button 
              variant="filled" 
              onClick={onGenerate} 
              className="px-12 py-6 text-base"
            >
              <Sparkles size={20} className="mr-2" />
              Generate cover letter
            </M3Button>
          </div>
        </M3Card>
      </div>
    );
  }

  return <FinalReviewContent type="cover" />;
}

function ImageStudioContent() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>Image Studio (Preview)</h2>
        <p className="text-sm text-[var(--sys-color-worker-ash-base)]">Generate professional headshots or portfolio assets using AI.</p>
      </div>

      <Placard className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-[var(--sys-color-worker-ash-base)] opacity-60 mb-2 block font-bold uppercase tracking-wider">
              Visual prompt
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate (e.g., 'Professional headshot of a software engineer in a modern office setting, soft lighting, high resolution')."
              className="w-full bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] p-4 rounded-xl font-medium text-sm focus:outline-none focus:border-[var(--sys-color-inkGold-base)] transition-all min-h-[100px]"
            />
          </div>
          <Strike 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? "Generating assets..." : "Generate"}
          </Strike>
        </div>
      </Placard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Placard key={i} className="aspect-square flex items-center justify-center border-dashed border-2 border-[var(--sys-color-outline-variant)]/50">
            <div className="text-center">
              <Sparkles size={24} className="text-[var(--sys-color-worker-ash-base)] opacity-20 mx-auto mb-2" />
              <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] opacity-40 uppercase">Placeholder {i}</span>
            </div>
          </Placard>
        ))}
      </div>
    </div>
  );
}

function KSCStepContent({ step, onNext, onGenerate }: any) {
  if (step === 1) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>Draft KSC responses</h2>
          <M3Button variant="filled" onClick={onNext}>Next step</M3Button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <KSCItem 
            title="Demonstrated ability to lead technical teams."
            desc="Provide an example of when you led a team to achieve a specific outcome."
          />
          <KSCItem 
            title="Experience in cloud-native architecture."
            desc="Explain your experience with AWS, Azure, or GCP in a production environment."
          />
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-8">
        <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>Finalize KSC</h2>
        <M3Card variant="elevated" className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="px-3 py-1 bg-[var(--sys-color-signalGreen-base)]/10 border border-[var(--sys-color-signalGreen-base)]/30 rounded-full">
              <span className="text-[8px] font-bold text-[var(--sys-color-signalGreen-base)]">STAR method applied</span>
            </div>
          </div>
          <div className="space-y-4 opacity-50">
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-full" />
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-full" />
            <div className="h-4 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded w-full" />
          </div>
          <div className="mt-12 flex justify-center">
            <M3Button 
              variant="filled" 
              onClick={onGenerate} 
              className="px-12 py-6 text-base"
            >
              <Sparkles size={20} className="mr-2" />
              Generate KSC responses
            </M3Button>
          </div>
        </M3Card>
      </div>
    );
  }

  return <FinalReviewContent type="ksc" />;
}

function KSCItem({ title, desc }: { title: string, desc: string }) {
  return (
    <M3Card variant="outlined" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight">{title}</h4>
        <div className="group relative">
          <div className="p-1.5 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-lg text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-inkGold-base)] cursor-help transition-colors">
            <Info size={14} />
          </div>
          <div className="absolute bottom-full right-0 mb-2 w-64 p-4 bg-[var(--sys-color-charcoalBackground-steps-4)] border border-[var(--sys-color-outline-variant)] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50">
            <p className="text-[10px] font-bold text-[var(--sys-color-inkGold-base)] mb-2">STAR method guidance</p>
            <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] leading-relaxed">
              <span className="text-[var(--sys-color-paperWhite-base)] font-bold">S:</span> Situation<br/>
              <span className="text-[var(--sys-color-paperWhite-base)] font-bold">T:</span> Task<br/>
              <span className="text-[var(--sys-color-paperWhite-base)] font-bold">A:</span> Action<br/>
              <span className="text-[var(--sys-color-paperWhite-base)] font-bold">R:</span> Result
            </p>
          </div>
        </div>
      </div>
      <p className="text-xs text-[var(--sys-color-worker-ash-base)] mb-4">{desc}</p>
      <textarea 
        placeholder="Draft your response here..."
        className="w-full h-24 p-3 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-xl text-xs text-[var(--sys-color-paperWhite-base)] focus:outline-none focus:border-[var(--sys-color-inkGold-base)] transition-colors resize-none"
      />
    </M3Card>
  );
}

function FinalReviewContent({ type = "resume" }: { type?: string }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }}>Review & finalize</h2>
        <div className="flex gap-3">
          <M3Button variant="outlined">Download PDF</M3Button>
          <M3Button variant="filled">Save to tracker</M3Button>
        </div>
      </div>

      {type === "cover" ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Placard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-[var(--sys-color-inkGold-base)]" />
              <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">Keyword match</span>
            </div>
            <div className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] font-mono tracking-tighter">94%</div>
            <div className="text-[8px] font-bold text-[var(--sys-color-signalGreen-base)] mt-1 uppercase">High relevance</div>
          </Placard>
          <Placard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} className="text-[var(--sys-color-inkGold-base)]" />
              <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">Narrative flow</span>
            </div>
            <div className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] font-mono tracking-tighter">88%</div>
            <div className="text-[8px] font-bold text-[var(--sys-color-worker-ash-base)] mt-1 uppercase">Strong structure</div>
          </Placard>
          <Placard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCircle size={14} className="text-[var(--sys-color-inkGold-base)]" />
              <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">Personalization</span>
            </div>
            <div className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] font-mono tracking-tighter">92%</div>
            <div className="text-[8px] font-bold text-[var(--sys-color-signalGreen-base)] mt-1 uppercase">Highly tailored</div>
          </Placard>
          <Placard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-[var(--sys-color-inkGold-base)]" />
              <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">Tone alignment</span>
            </div>
            <div className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] font-mono tracking-tighter">96%</div>
            <div className="text-[8px] font-bold text-[var(--sys-color-worker-ash-base)] mt-1 uppercase">Voice matched</div>
          </Placard>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Placard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-[var(--sys-color-inkGold-base)]" />
              <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">Tone match</span>
            </div>
            <div className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] font-mono">98%</div>
            <div className="text-[8px] font-bold text-[var(--sys-color-signalGreen-base)] mt-1 uppercase">Highly authentic</div>
          </Placard>
          <Placard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} className="text-[var(--sys-color-inkGold-base)]" />
              <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">Keyword density</span>
            </div>
            <div className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] font-mono">4.2%</div>
            <div className="text-[8px] font-bold text-[var(--sys-color-worker-ash-base)] mt-1 uppercase">Optimal range</div>
          </Placard>
          <Placard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={14} className="text-[var(--sys-color-inkGold-base)]" />
              <span className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">Impact score</span>
            </div>
            <div className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] font-mono">89/100</div>
            <div className="text-[8px] font-bold text-[var(--sys-color-worker-ash-base)] mt-1 uppercase">Strong narrative</div>
          </Placard>
        </div>
      )}

      <M3Card variant="elevated" className="p-12 bg-white text-black min-h-[600px] shadow-2xl rounded-none">
        <div className="max-w-2xl mx-auto space-y-6 font-serif">
          <div className="text-center border-b-2 border-black pb-6 mb-8">
            <h1 className="text-3xl font-bold uppercase tracking-tighter">Alex Johnson</h1>
            <p className="text-sm">Senior Frontend Engineer | alex.j@example.com | +61 400 000 000</p>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase border-b border-black">Professional summary</h2>
            <p className="text-sm leading-relaxed">Highly skilled Senior Frontend Engineer with 8+ years of experience in architecting scalable web applications using React, TypeScript, and Node.js. Proven track record of leading cross-functional teams to deliver high-impact solutions that drive user engagement and business growth.</p>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase border-b border-black">Key achievements</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Spearheaded a cross-functional team of 5 to architect a scalable e-commerce solution, improving checkout conversion by 15%.</li>
              <li>Engineered advanced SQL optimizations reducing query latency by 40% and cutting server costs by $2k/month.</li>
              <li>Partnered with UX/UI designers to develop a reusable component library in React, accelerating frontend delivery by 30%.</li>
            </ul>
          </div>
        </div>
      </M3Card>
      
      <div className="bg-[var(--sys-color-inkGold-base)]/10 p-8 rounded-[32px] border border-[var(--sys-color-inkGold-base)]/30 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-[var(--sys-color-inkGold-base)] rounded-full flex items-center justify-center text-[var(--sys-color-charcoalBackground-base)] shrink-0">
          <UserCircle size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-[var(--sys-color-paperWhite-base)] tracking-tight">Bridge to profile voice</h3>
          <p className="text-xs text-[var(--sys-color-worker-ash-base)] mt-1">Want these documents to sound even more like you? Update your voice profile in your account settings.</p>
        </div>
        <M3Button 
          variant="tonal" 
          className="bg-[var(--sys-color-inkGold-base)] text-[var(--sys-color-charcoalBackground-base)] hover:bg-[var(--sys-color-inkGold-steps-2)]"
        >
          Update voice profile
          <ArrowRight size={14} className="ml-2" />
        </M3Button>
      </div>
    </div>
  );
}

