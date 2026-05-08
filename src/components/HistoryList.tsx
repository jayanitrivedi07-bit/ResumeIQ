import { ResumeVersion } from "../types";
import { FileText, Calendar, ChevronRight, Trash2, TrendingUp, Target } from "lucide-react";

interface HistoryListProps {
  versions: ResumeVersion[];
  onSelect: (version: ResumeVersion) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export function HistoryList({ versions, onSelect, onDelete, selectedId }: HistoryListProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-2 shrink-0">Analysis History</h3>
      {versions.length === 0 ? (
        <div className="p-8 text-center border border-white/5 border-dashed rounded-2xl shrink-0">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">No history found</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {versions.map((v) => (
            <div 
              key={v.id}
              onClick={() => onSelect(v)}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between
                ${selectedId === v.id 
                  ? "bg-blue-500/10 border-blue-500/30" 
                  : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded-lg transition-colors
                  ${selectedId === v.id ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-slate-500 group-hover:text-slate-300"}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className={`text-xs font-medium truncate ${selectedId === v.id ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
                    {v.fileName}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] text-slate-600 uppercase font-bold tracking-tighter">
                    <Calendar className="w-2.5 h-2.5" />
                    {v.createdAt?.toDate ? v.createdAt.toDate().toLocaleDateString() : "Pending..."}
                    <span className="text-slate-800">|</span>
                    <span className={v.analysis.score >= 8.5 ? "text-emerald-500" : "text-amber-500"}>
                      Score: {v.analysis.score}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(v.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-600 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedId === v.id ? "text-blue-400 translate-x-1" : "text-slate-700"}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
