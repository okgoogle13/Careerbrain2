/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckCircle2, AlertCircle, FileText, FileCode, FileType, Search, Loader2 } from 'lucide-react';
import { M3Button } from '../src/components/ui/M3Button';
import { M3Card } from '../src/components/ui/M3Card';
import { M3Type } from '../src/theme/typography';
import { CustomDrivePicker } from '../src/components/feature/CustomDrivePicker';

interface DocumentInputProps {
  onProcess: (files: File[], rawText?: string, fileData?: { data: string; mimeType: string }[]) => void;
  isLoading: boolean;
  hideTitle?: boolean;
  onRawTextChange?: (text: string) => void;
  initialRawText?: string;
  submitLabel?: string;
}

const MAX_FILES = 10; // Reduced for prototype stability
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

interface FileEntry {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'reading' | 'completed' | 'error';
  errorMessage?: string;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({ onProcess, isLoading, hideTitle, onRawTextChange, initialRawText = '', submitLabel }) => {
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([]);
  const [rawText, setRawText] = useState(initialRawText);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showDrivePicker, setShowDrivePicker] = useState(false);
  const [driveLoading, setDriveLoading] = useState(false);

  const handleDriveFileSelect = async (file: any) => {
    setShowDrivePicker(false);
    setDriveLoading(true);
    setError(null);
    try {
      const tokens = JSON.parse(localStorage.getItem('google_tokens') || 'null');
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (tokens) {
        headers['Authorization'] = `Bearer ${JSON.stringify(tokens)}`;
      }

      const res = await fetch("/api/drive/file", {
        method: "POST",
        headers,
        body: JSON.stringify({ fileId: file.id, mimeType: file.mimeType })
      });
      const data = await res.json();
      if (res.ok) {
        setRawText(data.content);
        if (onRawTextChange) {
          onRawTextChange(data.content);
        }
      } else {
        throw new Error(data.error || "Failed to download Google Drive document.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching file from Google Drive.");
    } finally {
      setDriveLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setRawText(newText);
    if (onRawTextChange) {
      onRawTextChange(newText);
    }
  };

  const readFileAsBase64 = (file: File, onProgress?: (progress: number) => void): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        if (onProgress) onProgress(100);
        resolve({ data: base64String, mimeType: file.type || 'application/octet-stream' });
      };
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback((incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setError(null);
    
    const newEntries: FileEntry[] = [];
    Array.from(incomingFiles).forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const isValidExtension = ['pdf', 'docx', 'txt'].includes(extension || '');
      let entryError: string | undefined;

      if (file.size > MAX_FILE_SIZE) {
        entryError = `File too large: Max 10MB.`;
      } else if (!ALLOWED_TYPES.includes(file.type) && !isValidExtension) {
        entryError = `Unsupported type: Use PDF, DOCX, or TXT.`;
      }

      newEntries.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: entryError ? 'error' : 'pending',
        errorMessage: entryError
      });
    });

    setFileEntries(prev => {
      const combined = [...prev, ...newEntries];
      if (combined.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} documents allowed.`);
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFileEntries(prev => prev.filter(entry => entry.id !== id));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validEntries = fileEntries.filter(e => e.status !== 'error');
    
    if ((validEntries.length > 0 || rawText.trim().length > 0) && !isLoading && !isReading) {
      setIsReading(true);
      setError(null);
      
      try {
        const fileData = await Promise.all(validEntries.map(async (entry) => {
          setFileEntries(prev => prev.map(e => 
            e.id === entry.id ? { ...e, status: 'reading', progress: 0 } : e
          ));

          const result = await readFileAsBase64(entry.file, (progress) => {
            setFileEntries(prev => prev.map(e => 
              e.id === entry.id ? { ...e, progress } : e
            ));
          });

          setFileEntries(prev => prev.map(e => 
            e.id === entry.id ? { ...e, status: 'completed', progress: 100 } : e
          ));

          return result;
        }));

        onProcess(validEntries.map(e => e.file), rawText.trim(), fileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process files. Please try again.");
      } finally {
        setIsReading(false);
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return <FileType className="w-8 h-8 text-[#FF4444]" />;
      case 'docx': return <FileText className="w-8 h-8 text-[#4488FF]" />;
      case 'txt': return <FileCode className="w-8 h-8 text-[#888888]" />;
      default: return <FileIcon className="w-8 h-8 text-[var(--sys-color-inkGold-base)]" />;
    }
  };

  return (
    <M3Card variant="elevated" className="p-10 border-l-4 border-l-[var(--sys-color-solidarityRed-base)] my-8 mx-auto max-w-6xl">
      {!hideTitle && <h2 style={{ ...M3Type.headlineSmall, color: 'var(--sys-color-paperWhite-base)' }} className="mb-4 tracking-tight">1. Upload Your Career Documents</h2>}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-[var(--sys-color-charcoalBackground-steps-2)] text-[var(--sys-color-worker-ash-base)] text-sm font-bold uppercase tracking-wider rounded-full border border-[var(--sys-color-outline-variant)]">Up to {MAX_FILES} documents</span>
          <span className="px-3 py-1 bg-[var(--sys-color-charcoalBackground-steps-2)] text-[var(--sys-color-worker-ash-base)] text-sm font-bold uppercase tracking-wider rounded-full border border-[var(--sys-color-outline-variant)]">PDF · DOCX · TXT</span>
        </div>
        <M3Button 
          type="button"
          variant="tonal" 
          onClick={() => setShowDrivePicker(true)}
          className="h-10 px-4 bg-[var(--sys-color-inkGold-base)]/10 text-[var(--sys-color-inkGold-base)] border border-[var(--sys-color-inkGold-base)]/30 hover:bg-[var(--sys-color-inkGold-base)]/20 hover:scale-[1.02] flex items-center gap-2 font-bold uppercase text-xs tracking-wider"
          disabled={isLoading || isReading || driveLoading}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46.2 14.25 0 14 0h-4c-.25 0-.46.2-.49.44l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.44.49.44h4c.25 0 .46-.2.49-.44l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
          </svg>
          Browse Google Drive
        </M3Button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`relative border-2 border-dashed p-12 text-center transition-all cursor-pointer
              ${isDragging ? 'border-[var(--sys-color-primary-base)] bg-[var(--sys-color-primaryContainer-base)]' : 'border-[var(--sys-color-outline-variant)] hover:border-[var(--sys-color-paperWhite-base)]'}`}
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              disabled={isLoading || isReading}
            />
            <div className="flex flex-col items-center text-[var(--sys-color-paperWhite-base)]">
              <motion.div animate={{ scale: isDragging ? 1.2 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <UploadIcon className="w-16 h-16 mb-6 text-[var(--sys-color-solidarityRed-base)]" />
              </motion.div>
              <p className="text-xl font-bold uppercase tracking-wider mb-2">Drag & drop files here</p>
              <p className="text-[var(--sys-color-worker-ash-base)]">or click to select</p>
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="rawText" style={{ ...M3Type.titleLarge, color: 'var(--sys-color-paperWhite-base)' }} className="mb-4 tracking-tight">
              Paste raw text instead
            </label>
            <textarea
              id="rawText"
              value={rawText}
              onChange={handleTextChange}
              placeholder="If your PDF fails to upload, paste your unformatted resume or job description here..."
              className="flex-grow p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] focus:border-[var(--sys-color-primary-base)] focus:outline-none focus:shadow-[var(--sys-shadow-elevation2Placard)] transition-all resize-y"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)', minHeight: '200px' }}
              disabled={isLoading || isReading}
            />
          </div>
        </div>
        
        {error && <p className="text-[var(--sys-color-kr-charcoalRed-base)] font-bold mt-6 text-lg uppercase tracking-wider flex items-center gap-2"><AlertCircle size={20} /> {error}</p>}

        {fileEntries.length > 0 && (
          <div className="mt-8">
            <h3 style={{ ...M3Type.titleLarge, color: 'var(--sys-color-paperWhite-base)' }} className="mb-4 tracking-tight">Selected Files:</h3>
            <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
              {fileEntries.map((entry) => (
                <div key={entry.id} className={`flex flex-col bg-[var(--sys-color-charcoalBackground-steps-2)] border p-4 animate-fade-in transition-all ${entry.status === 'error' ? 'border-[var(--sys-color-kr-charcoalRed-base)]/50' : 'border-[var(--sys-color-outline-variant)]'}`} style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-hidden">
                      {getFileIcon(entry.file.name)}
                      <div className="overflow-hidden">
                        <p className={`text-lg font-bold truncate ${entry.status === 'error' ? 'text-[var(--sys-color-kr-charcoalRed-base)]' : 'text-[var(--sys-color-paperWhite-base)]'}`}>
                          {entry.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">{(entry.file.size / 1024).toFixed(1)} KB</p>
                          {entry.status === 'completed' && <CheckCircle2 size={14} className="text-[var(--sys-color-signalGreen-base)]" />}
                          {entry.status === 'error' && <span className="text-xs text-[var(--sys-color-kr-charcoalRed-base)] font-bold uppercase">{entry.errorMessage}</span>}
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeFile(entry.id)} disabled={isLoading || isReading} className="p-2 text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-kr-charcoalRed-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-3)] disabled:text-[var(--sys-color-concreteGrey-steps-0)] transition-colors" style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}>
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {(entry.status === 'reading' || entry.status === 'completed') && (
                    <div className="mt-3 w-full bg-[var(--sys-color-charcoalBackground-steps-3)] h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-[var(--sys-color-solidarityRed-base)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${entry.progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-end min-h-[60px]">
          <AnimatePresence>
            {(fileEntries.some(e => e.status !== 'error') || rawText.trim().length > 0) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <M3Button
                  variant="filled"
                  type="submit"
                  disabled={isLoading || isReading}
                >
                  {isLoading || isReading ? 'Processing...' : submitLabel || `Process ${fileEntries.filter(e => e.status !== 'error').length > 0 ? `${fileEntries.filter(e => e.status !== 'error').length} File(s)` : 'Text'}`}
                </M3Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
      
      {driveLoading && (
        <div className="absolute inset-0 bg-black/60 z-50 flex flex-col items-center justify-center p-4 rounded-3xl">
          <Loader2 size={32} className="animate-spin text-[var(--sys-color-inkGold-base)] mb-4" />
          <p className="text-[var(--sys-color-paperWhite-base)] font-mono text-xs uppercase tracking-widest">Fetching file from Google Drive...</p>
        </div>
      )}

      {showDrivePicker && (
        <CustomDrivePicker 
          onClose={() => setShowDrivePicker(false)}
          onFileSelect={handleDriveFileSelect}
        />
      )}
    </M3Card>
  );
};