import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  compact?: boolean;
}

export function FileUploader({ onFileSelect, isLoading, compact = false }: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedFileName(acceptedFiles[0].name);
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: isLoading,
  } as any);

  if (compact) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Resume Upload</h2>
        <div 
          {...getRootProps()}
          className={`h-32 border-2 border-dashed rounded-xl bg-white/[0.02] flex flex-col items-center justify-center gap-2 group cursor-pointer transition-all
            ${isDragActive ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 hover:border-blue-500/30"}`}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          ) : (
            <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
          )}
          <p className="text-[10px] text-slate-400 text-center px-4">
            {isLoading ? "Analyzing..." : <>Drag & drop PDF or <span className="text-blue-400 font-medium">Browse</span></>}
          </p>
        </div>
        
        {selectedFileName && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 text-[11px]">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 bg-red-500/20 text-red-400 flex items-center justify-center rounded text-[9px] font-bold">PDF</div>
              <span className="truncate opacity-80 text-slate-300">{selectedFileName}</span>
            </div>
            <span className="text-emerald-400 uppercase font-bold text-[9px] shrink-0">Ready</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`relative group cursor-pointer transition-all duration-500 overflow-hidden rounded-3xl border-2 border-dashed 
        ${isDragActive ? "border-blue-500 bg-blue-500/5" : "border-white/10 hover:border-white/20 bg-white/5"}
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <motion.div
          animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 group-hover:text-blue-300 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-12 h-12 animate-spin" />
          ) : (
            <Upload className="w-12 h-12" />
          )}
        </motion.div>
        <h3 className="text-2xl font-semibold mb-2 text-white">Upload your resume</h3>
        <p className="text-slate-400 max-w-sm mx-auto">
          Let Gemini AI help you craft a narrative that resonates with top recruiters.
        </p>
      </div>
    </div>
  );
}
