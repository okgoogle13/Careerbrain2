/**
 * CLASSIFICATION: Support-Reference Page
 * /settings: Secondary account/security utils only.
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WorkspaceLayout } from "../components/layout/WorkspaceLayout";
import { SolidarityPageLayout } from "../components/layout/SolidarityPageLayout";
import { TextInput } from "../components/ui/TextInput";
import { M3Button } from "../components/ui/M3Button";
import { Modal } from "../components/ui/Modal";
import { User } from 'firebase/auth';
import { M3Type } from "../theme/typography";

interface Props {
  user?: User | null;
}

export function SettingsView({ user }: Props) {
  const [fullName, setFullName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <SolidarityPageLayout>
      <WorkspaceLayout>
        <div className="flex flex-col w-full h-full overflow-hidden bg-[var(--sys-color-charcoalBackground-steps-1)]">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-[var(--sys-color-charcoalBackground-steps-1)]/80 backdrop-blur-md border-b border-[var(--sys-color-outline-variant)] py-4 px-8 flex items-center justify-between">
            <h2 style={{ ...M3Type.titleLarge, color: 'var(--sys-color-paperWhite-base)' }}>
              Settings
            </h2>
            <M3Button 
              variant="filled" 
              onClick={handleSave} 
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </M3Button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="bg-[var(--sys-color-charcoalBackground-steps-2)] p-8 rounded-[32px] border border-[var(--sys-color-outline-variant)] shadow-sm">
                <h3 className="text-[22px] leading-[28px] font-bold text-[var(--sys-color-paperWhite-base)] mb-8">Account & Security</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">Account configuration</h4>
                    <div className="space-y-4">
                      <TextInput label="Display name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      <TextInput label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">Locale and preferences</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)]">System language</label>
                        <select className="w-full p-4 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] rounded-xl focus:outline-none focus:border-[var(--sys-color-inkGold-base)] transition-colors">
                          <option value="en-AU">AUS English (default)</option>
                          <option value="en-US">US English</option>
                          <option value="en-GB">UK English</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-xl">
                        <span className="text-xs font-bold text-[var(--sys-color-paperWhite-base)]">Dark mode</span>
                        <div className="w-10 h-5 bg-[var(--sys-color-inkGold-base)] rounded-full relative">
                          <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Utility Integrations Panel */}
                <div className="mt-12 pt-12 border-t border-[var(--sys-color-outline-variant)]">
                  <h4 className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-8">Utility Integrations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--sys-color-inkGold-base)]/10 flex items-center justify-center">
                          <span className="text-[var(--sys-color-inkGold-base)] font-bold">G</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--sys-color-paperWhite-base)]">Gmail Scan</p>
                          <p className="text-[10px] text-[var(--sys-color-signalGreen-base)] font-bold uppercase">Connected</p>
                        </div>
                      </div>
                      <M3Button variant="tonal" className="scale-75 origin-right">Manage</M3Button>
                    </div>

                    <div className="p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--sys-color-signalGreen-base)]/10 flex items-center justify-center">
                          <span className="text-[var(--sys-color-signalGreen-base)] font-bold">S</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--sys-color-paperWhite-base)]">Google Sheets DB</p>
                          <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] font-bold uppercase">Setup Required</p>
                        </div>
                      </div>
                      <M3Button 
                        variant="outlined" 
                        className="scale-75 origin-right"
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/sheets/init", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ title: "Career_Copilot_Master_Database" })
                            });
                            const data = await res.json();
                            if (data.spreadsheetId) {
                              alert(`Successfully generated database in Google Sheets! ID: ${data.spreadsheetId}`);
                            } else {
                              alert(`Failed to generate database`);
                            }
                          } catch (err) {
                            alert(`Error generating database`);
                          }
                        }}
                      >
                        Initialize
                      </M3Button>
                    </div>
                    <div className="p-6 bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--sys-color-outline-variant)] rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--sys-color-worker-ash-base)]/10 flex items-center justify-center">
                          <span className="text-[var(--sys-color-worker-ash-base)] font-bold">S</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--sys-color-paperWhite-base)]">Job Scout</p>
                          <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] font-bold uppercase">Disconnected</p>
                        </div>
                      </div>
                      <M3Button variant="filled" className="scale-75 origin-right">Connect</M3Button>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--sys-color-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-left w-full">
                    <p className="text-sm font-bold text-[var(--sys-color-paperWhite-base)]">Data privacy</p>
                    <p className="text-[10px] text-[var(--sys-color-worker-ash-base)] font-bold">Manage your information and account status</p>
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                    <M3Button 
                      variant="outlined"
                      onClick={() => setShowDeleteModal(true)}
                      className="border-[var(--sys-color-solidarityRed-base)]/30 text-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-base)] hover:text-white"
                    >
                      Delete my data
                    </M3Button>
                    <M3Button variant="outlined">
                      Export data
                    </M3Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete My Data">
        <div className="p-8">
          <p className="text-[var(--sys-color-worker-ash-base)] mb-8">Are you sure you want to delete all your data? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <M3Button variant="outlined" onClick={() => setShowDeleteModal(false)}>Cancel</M3Button>
            <M3Button variant="filled" onClick={() => { setShowDeleteModal(false); console.log("Data deleted"); }}>Delete</M3Button>
          </div>
        </div>
      </Modal>
    </SolidarityPageLayout>
  );
}
