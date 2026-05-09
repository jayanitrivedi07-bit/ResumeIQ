import React, { useState } from "react";
import { FileText, Wand2, Download, Copy, Check, Loader2, Sparkles, Layout, Palette, GraduationCap, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TemplateSelectorProps {
  resumeText: string;
  jobDescription: string;
  onRecreate: (text: string, templateName: string) => Promise<{ text: string }>;
}

const templates = [
  { 
    id: "modern", 
    name: "Modern Professional", 
    icon: <Layout className="w-5 h-5" />, 
    description: "Clean, impact-focused style with sharp headers and clear structure.",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    id: "creative", 
    name: "Creative Storyteller", 
    icon: <Palette className="w-5 h-5" />, 
    description: "Engaging and descriptive language that highlights your personality.",
    color: "from-purple-500 to-pink-500"
  },
  { 
    id: "academic", 
    name: "Academic Researcher", 
    icon: <GraduationCap className="w-5 h-5" />, 
    description: "Detailed focus on research, publications, and deep technical expertise.",
    color: "from-emerald-500 to-teal-500"
  },
  { 
    id: "minimal", 
    name: "Minimalist High-Impact", 
    icon: <Zap className="w-5 h-5" />, 
    description: "Ultra-concise achievements for high-level executive reviews.",
    color: "from-orange-500 to-rose-500"
  },
];

export function TemplateSelector({ resumeText, jobDescription, onRecreate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [recreatedText, setRecreatedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRecreate = async (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsLoading(true);
    try {
      const template = templates.find(t => t.id === templateId);
      const result = await onRecreate(resumeText, jobDescription, template?.name || templateId);
      setRecreatedText(result.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!recreatedText) return;
    navigator.clipboard.writeText(recreatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsTxt = () => {
    if (!recreatedText) return;
    const element = document.createElement("a");
    const file = new Blob([recreatedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Optimized_Resume_${selectedTemplate}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-400" />
            AI Resume Recreation
          </h3>
          <p className="text-sm text-slate-500 mt-1">Select a template to optimize your resume for the specific job description.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleRecreate(template.id)}
            disabled={isLoading || !jobDescription}
            className={`group relative text-left p-6 rounded-2xl border transition-all duration-300 ${
              selectedTemplate === template.id 
                ? 'bg-white/10 border-blue-500/50 ring-1 ring-blue-500/50' 
                : 'bg-white/5 border-white/5 hover:bg-white/[0.07] hover:border-white/10'
            } disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`} />
            
            <div className="flex gap-4 relative z-10">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${template.color} text-white shadow-lg`}>
                {template.icon}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{template.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{template.description}</p>
              </div>
            </div>
            
            {!jobDescription && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Add job description first</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl border border-white/5 gap-4"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <Sparkles className="w-5 h-5 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white animate-pulse">Gemini is rewriting your career story...</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Applying {templates.find(t => t.id === selectedTemplate)?.name} Template</p>
            </div>
          </motion.div>
        )}

        {recreatedText && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Optimization Complete</h4>
                  <p className="text-[10px] text-slate-500">Your resume is now perfectly aligned with the job requirements.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all relative group"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                </button>
                <button 
                  onClick={downloadAsTxt}
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 group relative"
                  title="Download as TXT"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Download TXT</span>
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-slate-900 border border-white/5 rounded-2xl p-8 max-h-[500px] overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-slate-300">
                {recreatedText.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
