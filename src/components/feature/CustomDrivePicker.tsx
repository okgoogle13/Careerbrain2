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
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const startOAuthFlow = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) throw new Error("Could not fetch Auth Google URL from server");
      const { url } = await response.json();
      
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        url,
        'Google OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          const { tokens } = event.data;
          localStorage.setItem('google_tokens', JSON.stringify(tokens));
          setUnauthorized(false);
          window.removeEventListener('message', handleMessage);
          fetchResumes();
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (err: any) {
      console.error("Failed to start Google OAuth flow:", err);
      setError("Failed to initiate connection. Is Google OAuth configured?");
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    setUnauthorized(false);
    try {
      const tokens = JSON.parse(localStorage.getItem('google_tokens') || 'null');
      const headers: HeadersInit = {};
      if (tokens) {
        headers['Authorization'] = `Bearer ${JSON.stringify(tokens)}`;
      }

      const res = await fetch("/api/drive/resumes", { headers });
      
      if (res.status === 401) {
        setUnauthorized(true);
        throw new Error("unauthorized");
      }
      
      if (!res.ok) {
        throw new Error("Failed to load files from Google Drive.");
      }
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err: any) {
      if (err.message !== "unauthorized") {
        setError(err.message);
      }
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
            {unauthorized ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--md-sys-color-on-surface-variant)] text-center px-6">
                <FileText size={48} className="mb-4 text-[var(--sys-color-inkGold-base)]" />
                <h3 className="text-xl font-bold mb-2 text-[var(--sys-color-paperWhite-base)]">Google Workspace Required</h3>
                <p className="text-sm max-w-sm mb-6 text-[var(--sys-color-worker-ash-base)] font-medium">
                  Connect your Google Drive to browse, search, and import your resumes directly.
                </p>
                <M3Button 
                  variant="filled" 
                  onClick={startOAuthFlow}
                  className="bg-[var(--sys-color-inkGold-base)] text-black h-11 px-6 rounded-xl hover:scale-[1.02] transition-transform font-bold"
                >
                  Connect Google Drive
                </M3Button>
              </div>
            ) : loading ? (
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
