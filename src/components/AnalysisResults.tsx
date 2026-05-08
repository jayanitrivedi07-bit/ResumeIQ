import { ResumeAnalysis } from "../types";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, AlertTriangle, Cpu, Target, BrainCircuit } from "lucide-react";

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Top Row: Strengths & Improvements */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3" />
          Key Strengths
        </h3>
        <ul className="space-y-4">
          {analysis.strengths.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm group">
              <span className="text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity">✦</span>
              <span className="text-slate-300 leading-relaxed">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <AlertTriangle className="w-3 h-3" />
          Areas to Improve
        </h3>
        <ul className="space-y-4">
          {analysis.weaknesses.map((w, i) => (
            <li key={i} className="flex gap-3 text-sm group">
              <span className="text-amber-400 opacity-50 group-hover:opacity-100 transition-opacity">△</span>
              <span className="text-slate-300 leading-relaxed">{w}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Middle: AI Project Refinement (Main Focus) */}
      <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Cpu className="w-32 h-32" />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" />
            AI Project Refinement
          </h3>
          <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">Before & After</span>
        </div>

        <div className="space-y-4 relative z-10">
          {analysis.betterDescriptions.slice(0, 3).map((desc, i) => (
            <div key={i} className="p-5 rounded-xl bg-slate-900/50 border border-white/5 hover:border-blue-500/20 transition-colors group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Original</p>
                  <p className="text-xs italic text-slate-400 leading-relaxed">"{desc.original}"</p>
                </div>
                <div className="border-l border-white/5 pl-6 relative">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-[#050507] p-1">
                    <ArrowRight className="w-3 h-3 text-slate-700" />
                  </div>
                  <p className="text-[10px] text-blue-400 uppercase font-bold mb-2">Gemini Suggestion</p>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {desc.suggested}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: ATS & Skills */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Target className="w-3 h-3" />
          ATS Check
        </h3>
        <div className="space-y-3">
          {analysis.atsOptimization.slice(0, 2).map((opt, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5">
              <p className="text-[11px] font-bold text-slate-300 mb-1">{opt.tip}</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">{opt.details}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4">Recommended Skills</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.suggestedSkills.map((skill, i) => (
            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all cursor-default">
              + {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md flex flex-col items-center justify-center gap-2 text-center shadow-2xl shadow-blue-500/5 relative overflow-hidden">
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 -rotate-90">
          <circle cx="64" cy="64" r="58" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle 
            initial={{ strokeDashoffset: 364 }}
            animate={{ strokeDashoffset: 364 - (364 * score / 10) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="64" cy="64" r="58" fill="transparent" stroke="url(#grad)" strokeWidth="10" strokeDasharray="364" strokeLinecap="round" 
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col">
          <span className="text-4xl font-black text-white">{score}</span>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Score / 10</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-200">
        {score >= 8.5 ? "Highly Competitive" : score >= 7 ? "Solid Foundation" : "Action Required"}
      </p>
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
        {score >= 8.5 ? "Top 10% of candidates" : score >= 7 ? "Mid-tier professional" : "Needs significant optimization"}
      </p>
    </div>
  );
}
