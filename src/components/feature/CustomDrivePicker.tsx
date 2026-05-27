import React, { useState, useEffect } from "react";
import { X, FileText, Search, Loader2 } from "lucide-react";
import { M3Button } from "../ui/M3Button";
import { M3Type } from "../../theme/typography";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  iconLink?: string;
}

interface CustomDrivePickerProps {
  onClose: () => void;
  onFileSelect: (file: DriveFile) => void;
}

export function CustomDrivePicker({ onClose, onFileSelect }: CustomDrivePickerProps) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/drive/resumes");
      if (!res.ok) {
        throw new Error("Failed to load files from Google Drive.");
      }
      const data = await res.json();
      setFiles(data.files);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-2xl bg-[var(--md-sys-color-surface-container)] rounded-[28px] flex flex-col overflow-hidden"
        style={{ height: '80vh', maxHeight: '800px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[var(--md-sys-color-outline-variant)]">
          <h2 style={{ ...M3Type.titleLarge, color: 'var(--md-sys-color-on-surface)' }}>
            Select resume from Drive
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--md-sys-color-surface-variant)] text-[var(--md-sys-color-on-surface-variant)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-[var(--md-sys-color-outline-variant)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant)]" size={18} />
              <input 
                type="text"
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-[16px] bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)] focus:outline-none focus:border-[var(--md-sys-color-primary)] transition-colors"
                style={{ ...M3Type.bodyLarge }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--md-sys-color-on-surface-variant)]">
                <Loader2 size={32} className="animate-spin mb-4" />
                <p>Loading files from Google Drive...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--md-sys-color-error)]">
                <p className="mb-4">{error}</p>
                <M3Button variant="outlined" onClick={fetchResumes}>Retry</M3Button>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--md-sys-color-on-surface-variant)]">
                <FileText size={48} className="mb-4 opacity-50" />
                <p>No documents found matching "{searchQuery}"</p>
                <p className="text-sm mt-2">Make sure your resume is saved as a PDF or Google Doc.</p>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div 
                  key={file.id}
                  onClick={() => onFileSelect(file)}
                  className="flex items-center gap-4 p-4 rounded-[16px] hover:bg-[var(--md-sys-color-surface-variant)] cursor-pointer transition-colors border border-transparent hover:border-[var(--md-sys-color-outline-variant)]"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-surface)] flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-[var(--md-sys-color-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-[var(--md-sys-color-on-surface)]">
                      {file.name}
                    </div>
                    <div className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                      Modified {new Date(file.modifiedTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
