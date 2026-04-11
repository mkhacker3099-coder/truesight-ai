import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureGrid from "@/components/FeatureGrid";
import FileUpload from "@/components/FileUpload";
import AnalysisPipeline, { AnalysisResult } from "@/components/AnalysisPipeline";
import ResultPanel from "@/components/ResultPanel";
import ProfilePanel from "@/components/ProfilePanel";
import HistoryPanel from "@/components/HistoryPanel";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";
import FeedbackPanel from "@/components/FeedbackPanel";
import BiometricIdentity from "@/components/BiometricIdentity";
import ProsodyAnalysis from "@/components/ProsodyAnalysis";
import HeadPoseAnalysis from "@/components/HeadPoseAnalysis";
import MultimodeDetector from "@/components/MultimodeDetector";
import WatermarkDetection from "@/components/WatermarkDetection";
import VideoDubbing from "@/components/VideoDubbing";
import { addScanRecord, type ScanRecord } from "@/lib/history";
import { getAuthUser, logout as authLogout, type AuthUser } from "@/lib/auth";
import { initTheme } from "@/lib/theme";

type Stage = "landing" | "upload" | "analyzing" | "result";
type Page = "dashboard" | "home" | "profile" | "history" | "feedback" | "biometric" | "prosody" | "headpose" | "multimode" | "watermark" | "dubbing";

const TOOL_PAGES: Page[] = ["biometric", "prosody", "headpose", "multimode", "watermark", "dubbing", "feedback"];
const TOOL_LABELS: Record<string, string> = {
  biometric: "Biometric Identity",
  prosody: "Prosody & Emotion",
  headpose: "Head Pose & Geometry",
  multimode: "Multimode AI Detector",
  watermark: "Watermark Detection",
  dubbing: "AI Video Dubbing",
  feedback: "Feedback",
};

const Index = () => {
  const [user, setUser] = useState<AuthUser | null>(getAuthUser());
  const [stage, setStage] = useState<Stage>("landing");
  const [page, setPage] = useState<Page>("dashboard");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const detectRef = useRef<HTMLDivElement>(null);

  useEffect(() => { initTheme(); }, []);

  const scrollToDetect = () => {
    setStage("upload");
    setTimeout(() => detectRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleFileSelect = (f: File) => { setFile(f); setStage("analyzing"); };

  const handleComplete = useCallback((r: AnalysisResult) => { setResult(r); setStage("result"); }, []);

  const handleCompleteAndSave = useCallback((r: AnalysisResult) => {
    handleComplete(r);
    if (file) addScanRecord({ fileName: file.name, fileType: file.type, fileSize: file.size, result: r });
  }, [file, handleComplete]);

  const handleReset = () => { setFile(null); setResult(null); setStage("upload"); };

  const handleNavigate = (p: string) => {
    setPage(p as Page);
    if (p === "home" && stage === "landing") setStage("landing");
  };

  const handleViewHistoryResult = (record: ScanRecord) => {
    setResult(record.result);
    setFile(new File([], record.fileName, { type: record.fileType }));
    setStage("result");
    setPage("home");
  };

  const handleLogin = (u: AuthUser) => { setUser(u); setPage("dashboard"); };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setPage("dashboard");
    toast("Thank you for using VoxVerify! 👋", { description: "You have been safely logged out. Stay protected!" });
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const isAudio = file?.type.startsWith("audio") ?? false;
  const isImage = file?.type.startsWith("image") ?? false;
  const isToolPage = TOOL_PAGES.includes(page);

  const renderToolPage = () => {
    switch (page) {
      case "biometric": return <BiometricIdentity />;
      case "prosody": return <ProsodyAnalysis />;
      case "headpose": return <HeadPoseAnalysis />;
      case "multimode": return <MultimodeDetector />;
      case "watermark": return <WatermarkDetection />;
      case "dubbing": return <VideoDubbing />;
      case "feedback": return <FeedbackPanel />;
      default: return null;
    }
  };

  const BackButton = ({ label }: { label?: string }) => (
    <button onClick={() => setPage("dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
      <ArrowLeft className="w-4 h-4" /> {label || "Back to Dashboard"}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={handleNavigate} activePage={page} isLoggedIn={!!user} onLogout={handleLogout} />

      <AnimatePresence mode="wait">
        {page === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="pt-24 pb-20 px-4">
            <div className="container mx-auto"><Dashboard user={user} onNavigate={handleNavigate} /></div>
          </motion.div>
        )}

        {page === "profile" && (
          <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="pt-24 pb-20 px-4">
            <div className="container mx-auto"><ProfilePanel onBack={() => setPage("dashboard")} /></div>
          </motion.div>
        )}

        {page === "history" && (
          <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="pt-24 pb-20 px-4">
            <div className="container mx-auto">
              <BackButton />
              <HistoryPanel onViewResult={handleViewHistoryResult} />
            </div>
          </motion.div>
        )}

        {isToolPage && (
          <motion.div key={page} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="pt-24 pb-20 px-4">
            <div className="container mx-auto">
              <BackButton label={`Back — ${TOOL_LABELS[page] || ""}`} />
              {renderToolPage()}
            </div>
          </motion.div>
        )}

        {page === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {(stage === "landing" || stage === "upload") && <HeroSection onGetStarted={scrollToDetect} />}
            <div id="features">{(stage === "landing" || stage === "upload") && <FeatureGrid />}</div>
            <div id="detect" ref={detectRef} className="py-20 px-4">
              <div className="container mx-auto">
                {stage === "upload" && <><BackButton /><FileUpload onFileSelect={handleFileSelect} /></>}
                {stage === "analyzing" && file && <AnalysisPipeline file={file} onComplete={handleCompleteAndSave} />}
                {stage === "result" && result && <ResultPanel result={result} isAudio={isAudio} isImage={isImage} fileName={file?.name} onReset={handleReset} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {page !== "feedback" && (
        <div className="fixed bottom-4 right-4 z-40">
          <button onClick={() => setPage("feedback")} className="magnetic-btn bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium glow-primary shadow-lg font-display">
            💬 Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;