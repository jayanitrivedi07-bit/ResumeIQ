import { useState } from "react";
import { signInWithGoogle } from "../lib/firebase";
import { Sparkles, Globe, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export function AuthView() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please allow popups for localhost and try again.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("localhost is not authorized in Firebase Console. Go to Firebase Console → Authentication → Settings → Authorized domains and add 'localhost'.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
      } else {
        setError(err.message || "Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-full flex overflow-hidden relative bg-[#050507]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-mesh" />
      
      {/* Left decoration side */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative z-10">
        <div className="max-w-md w-full space-y-12">
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-6xl font-black tracking-tighter text-white leading-none">
              Intelligence for <br />
              <span className="text-blue-400">your career.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              ResumeIQ uses advanced Gemini model logic to dissect your experience, 
              aligning your profile with industry standards and ATS requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Global Standard</h4>
                <p className="text-xs text-slate-500">Benchmarked against top-tier tech and financial recruitment metrics.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">ATS Shield</h4>
                <p className="text-xs text-slate-500">Optimized parsing logic ensuring your resume never lands in the 'black hole'.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white/[0.02] border-l border-white/5 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
            <Zap className="w-96 h-96" />
        </div>

        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="max-w-sm w-full space-y-8 text-center"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
            <p className="text-slate-500 text-sm">Sign in to manage your career portfolio.</p>
          </div>

          <button 
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all shadow-xl hover:shadow-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {error && (
            <div className="flex gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-left">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
            </div>
          )}

          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            Secure enterprise-grade authentication
          </p>
        </motion.div>
      </div>
    </div>
  );
}
