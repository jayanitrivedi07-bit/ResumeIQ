import { useState, useEffect } from "react";
import { FileUploader } from "./components/FileUploader";
import { AnalysisResults, ScoreDisplay } from "./components/AnalysisResults";
import { JobDescriptionInput } from "./components/JobDescriptionInput";
import { HistoryList } from "./components/HistoryList";
import { AuthView } from "./components/AuthView";
import { useAuth } from "./contexts/AuthContext";
import { logout } from "./lib/firebase";
import { analyzeResume } from "./services/geminiService";
import { 
  saveResumeVersion, 
  subscribeToResumeVersions, 
  deleteResumeVersion 
} from "./services/resumeStore";
import { recreateResume } from "./services/geminiService";
import { TemplateSelector } from "./components/TemplateSelector";
import { ResumeAnalysis, ResumeVersion } from "./types";
import { Sparkles, LayoutDashboard, History, FileStack, LogOut, Loader2, AlertCircle, RefreshCcw, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [history, setHistory] = useState<ResumeVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // Subscribe to history if user is logged in
  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToResumeVersions(user.uid, (versions) => {
        console.log("History updated:", versions.length, "items");
        // Sort in frontend to avoid needing a Firestore index for now
        const sorted = [...versions].sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
        setHistory(sorted);
      });
      return unsubscribe;
    } else {
      setHistory([]);
    }
  }, [user]);

  const handleAnalyze = async (textToAnalyze: string, currentFileName: string) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeResume(textToAnalyze, jobDescription);
      // Don't auto-save anymore, let the user click the button
      setAnalysis(result);
      setSelectedVersionId(null);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!user || !analysis || !parsedText) return;
    setIsLoading(true);
    try {
      await saveResumeVersion(user.uid, fileName || "resume.pdf", parsedText, analysis, jobDescription);
      setShowHistory(true);
      // Optional: show a success message
    } catch (err: any) {
      setError("Failed to save history: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      
      const parseResponse = await fetch("/api/parse-resume", { method: "POST", body: formData });
      if (!parseResponse.ok) {
        const errData = await parseResponse.json();
        throw new Error(errData.error || "Failed to parse resume PDF");
      }
      
      const { text } = await parseResponse.json();
      setParsedText(text);
      setFileName(file.name);
      
      // Run initial analysis
      await handleAnalyze(text, file.name);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (version: ResumeVersion) => {
    setAnalysis(version.analysis);
    setSelectedVersionId(version.id);
    setJobDescription(version.targetJob || "");
    setParsedText(version.resumeText);
    setFileName(version.fileName);
  };

  const handleDeleteHistory = async (id: string) => {
    if (!user) return;
    try {
      await deleteResumeVersion(user.uid, id);
      if (selectedVersionId === id) {
        setAnalysis(null);
        setSelectedVersionId(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050507]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#050507] text-slate-200 font-sans overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-mesh" />
      
      <header className="h-16 border-b border-white/5 backdrop-blur-xl flex items-center justify-between px-8 relative z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gradient">ResumeIQ<span className="text-blue-400">.ai</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400 mr-4">
            <button 
              onClick={() => { setAnalysis(null); setShowHistory(false); setShowTemplates(false); }} 
              className={`${!analysis && !showHistory && !showTemplates ? 'text-white' : 'hover:text-white'} flex items-center gap-2 transition-colors`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button 
              onClick={() => { setShowHistory(true); setShowTemplates(false); setAnalysis(null); }} 
              className={`${showHistory ? 'text-white' : 'hover:text-white'} flex items-center gap-2 transition-colors`}
            >
              <History className="w-4 h-4" /> History
            </button>
            <button 
              onClick={() => { setShowTemplates(true); setShowHistory(false); setAnalysis(null); }} 
              className={`${showTemplates ? 'text-white' : 'hover:text-white'} flex items-center gap-2 transition-colors`}
            >
              <FileStack className="w-4 h-4" /> Templates
            </button>
          </nav>
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user.displayName || user.email}</p>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Pro Account</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-bold text-blue-400">
              {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
            </div>
            <button 
              onClick={() => logout()}
              className="p-2 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 rounded-lg transition-all ml-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {!analysis && !isLoading && !showHistory && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-40 p-6 pointer-events-none"
          >
            <div className="pointer-events-auto max-w-2xl w-full text-center space-y-8">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                Land your dream job <br /> with <span className="text-blue-400">AI precision.</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Upload your resume for a diagnostic review. We'll find the gaps <br /> 
                and help you optimize for modern hiring systems.
              </p>
              <div className="pt-4 flex flex-col gap-6 max-w-lg mx-auto">
                <JobDescriptionInput 
                  value={jobDescription} 
                  onChange={setJobDescription} 
                  onSend={parsedText ? () => handleAnalyze(parsedText, fileName || "resume.pdf") : undefined}
                  disabled={isLoading} 
                />
                <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex p-6 gap-6 relative z-10 overflow-hidden">
        <aside className={`w-80 flex flex-col gap-6 transition-all duration-700 overflow-y-auto custom-scrollbar pr-2 h-full ${!analysis && !isLoading && !showHistory ? 'translate-x-[-120%] opacity-0' : 'translate-x-0 opacity-100'}`}>
          <div className="shrink-0 space-y-6">
            <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} compact />
            
            <JobDescriptionInput 
              value={jobDescription} 
              onChange={setJobDescription} 
              onSend={parsedText ? () => handleAnalyze(parsedText, fileName || "resume.pdf") : undefined}
              disabled={isLoading} 
            />
          </div>

          <div className="flex-1">
            <HistoryList 
              versions={history} 
              selectedId={selectedVersionId || undefined} 
              onSelect={handleSelectHistory} 
              onDelete={handleDeleteHistory}
            />
          </div>

          <div className="mt-auto bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 backdrop-blur-md">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Pro Tip</h4>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "Switch between versions in the history panel to track your improvement score over time."
            </p>
          </div>
        </aside>

        <section className={`flex-1 flex flex-col gap-6 overflow-hidden transition-all duration-700 delay-300 ${(!analysis && !isLoading && !showHistory) ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
              <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium animate-pulse">Analyzing your career trajectory...</p>
            </div>
          ) : analysis ? (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Analysis Snapshot</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                    {selectedVersionId ? "Viewing Archive Version" : "Latest Analysis"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {analysis && <ScoreDisplay score={analysis.score} />}
                  <div className="flex flex-col gap-2">
                    {!selectedVersionId && (
                      <button 
                        onClick={handleSaveToHistory}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Save to History
                      </button>
                    )}
                    <button 
                      onClick={() => { setAnalysis(null); setSelectedVersionId(null); }}
                      className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <AnalysisResults analysis={analysis} />
            </div>
          ) : showHistory ? (
            <div className="flex-1 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 text-center p-8">
              <div className="p-4 bg-blue-500/10 rounded-full">
                <History className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">History Mode</h3>
                <p className="text-sm text-slate-500 max-w-xs">Select a previous analysis from the sidebar on the left to view the details.</p>
              </div>
            </div>
          ) : showTemplates ? (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <TemplateSelector 
                resumeText={parsedText || ""} 
                jobDescription={jobDescription} 
                onRecreate={recreateResume} 
              />
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center">
              <p className="text-sm text-slate-600 uppercase tracking-[0.2em]">Ready for input</p>
            </div>
          )}
        </section>
      </main>

      <footer className="h-12 border-t border-white/5 flex items-center px-8 justify-between text-[10px] text-slate-500 relative z-10 shrink-0 bg-[#050507]/80 backdrop-blur-md">
        <div className="flex gap-4 uppercase font-medium tracking-widest">
          <span>Build v3.0.0-PRO</span>
          <span className="text-slate-800">|</span>
          <span className="text-blue-500/50">Enterprise Edition</span>
        </div>
        <p>© 2026 ResumeIQ Technologies Inc.</p>
      </footer>

      {error && (
        <div className="fixed bottom-16 right-6 z-[100] p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl backdrop-blur-xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-right-4 grow-0">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-4 hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
}
