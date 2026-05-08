import { Search, Info, Send } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend?: () => void;
  disabled?: boolean;
}

export function JobDescriptionInput({ value, onChange, onSend, disabled }: JobDescriptionInputProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Target Role</h2>
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-slate-600 hover:text-blue-400 cursor-help transition-colors" />
          <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-900 border border-white/10 rounded-lg text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Paste a job description or key requirements to tailor the analysis specifically for that role.
          </div>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste job description here..."
          className="w-full h-32 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none custom-scrollbar"
        />
        {!value && (
          <div className="absolute top-4 right-4 pointer-events-none">
            <Search className="w-4 h-4 text-slate-700" />
          </div>
        )}
      </div>

      <div className="mt-auto">
        <button
          onClick={onSend}
          disabled={disabled || !value || !onSend}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]"
        >
          {onSend ? (
            <>
              <Send className="w-3.5 h-3.5" />
              Analyze with Gemini
            </>
          ) : (
            <>
              <Info className="w-3.5 h-3.5" />
              Upload Resume to Start
            </>
          )}
        </button>
      </div>
    </div>
  );
}
